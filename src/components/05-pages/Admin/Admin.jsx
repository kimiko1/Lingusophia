import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBookOpen, 
  faChalkboardTeacher, 
  faCalendarCheck,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { Title, Button, Input, Card, Modal } from '../../01-atoms';

import { DataTable } from '../../02-molecules';
import { UserForm, LessonForm } from '../../03-organisms';
import { userService, lessonService, bookingService } from '../../../services';
import './Admin.scss';

/**
 * Admin component - Dashboard d'administration moderne
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
const Admin = ({ 
  className = '',
  ...props
}) => {
  const { t } = useTranslation(['pages', 'common']);
  
  // Récupérer l'utilisateur authentifié via le context Auth
  const { user } = useAuth();
  
  // Définir l'onglet par défaut selon le rôle
  const [activeTab, setActiveTab] = useState(() => {
    if (user?.role === 'Teacher') {
      return 'lessons';
    }
    return 'users';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Utiliser l'utilisateur authentifié au lieu d'une simulation
  const currentUser = user;
  
  // Vérifier les permissions
  const isAdmin = currentUser?.role === 'Admin';
  const isTeacher = currentUser?.role === 'Teacher';
  const canAccessDashboard = isAdmin;
  const canAccessUsers = isAdmin;
  const canAccessLessons = isAdmin || isTeacher;
  const canAccessBookings = isAdmin || isTeacher;
  
  // Données API
  // TODO: const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Chargement des données depuis l'API au montage
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer toutes les données admin via userService.getAllUsers
        const allData = await userService.getAllUsers();
        setUsers(allData.users || []);
        setLessons(allData.lessons || []);
        setBookings(allData.bookings || []);
        // setDashboardStats(allData.stats || {});
      } catch (err) {
        console.error('Erreur lors du chargement des données admin:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Définir l'onglet par défaut selon le rôle
  useEffect(() => {
    if (isAdmin && activeTab === 'lessons') {
      setActiveTab('dashboard');
    } else if (isTeacher && !canAccessLessons) {
      setActiveTab('lessons');
    }
  }, [isAdmin, isTeacher, canAccessLessons, activeTab]);

  // Garde d'accès admin :
  if (!user) {
    // User pas encore chargé (ex: au refresh), on affiche un loader
    return (
      <div className="admin__access-denied">
        <div className="admin__access-denied-content">
          <h1>{t('pages:admin.accessDenied.loading', 'Chargement...')}</h1>
        </div>
      </div>
    );
  }
  
  if (user && user.role !== 'Admin' && user.role !== 'Teacher') {
    // Accès refusé si pas admin/teacher
    return (
      <div className="admin__access-denied">
        <div className="admin__access-denied-content">
          <h1>{t('pages:admin.accessDenied.title')}</h1>
          <p>{t('pages:admin.accessDenied.message')}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            {t('pages:admin.accessDenied.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  // Colonnes pour la table des utilisateurs
  const userColumns = [
    { key: 'name', label: t('pages:admin.table.name'), sortable: true },
    { key: 'email', label: t('pages:admin.table.email'), sortable: true },
    { key: 'role', label: t('pages:admin.table.role'), sortable: true },
    { key: 'joinDate', label: t('pages:admin.table.joinDate'), sortable: true },
    { key: 'status', label: t('pages:admin.table.status'), sortable: true },
    { key: 'actions', label: t('pages:admin.table.actions'), sortable: false }
  ];

  // Colonnes pour la table des leçons
  const lessonColumns = [
    { key: 'title', label: t('pages:admin.table.title'), sortable: true },
    { key: 'language', label: t('pages:admin.table.language'), sortable: true },
    { key: 'level', label: t('pages:admin.table.level'), sortable: true },
    { key: 'price', label: t('pages:admin.table.price'), sortable: true },
    { key: 'actions', label: t('pages:admin.table.actions'), sortable: false }
  ];

  // Colonnes pour la table des réservations
  const bookingColumns = [
    { key: 'studentName', label: t('pages:admin.table.student'), sortable: true },
    { key: 'lessonTitle', label: t('pages:admin.table.lesson'), sortable: true },
    { key: 'scheduled_date', label: t('pages:admin.table.date'), sortable: true },
    { key: 'time', label: t('pages:admin.table.time'), sortable: true },
    { key: 'status', label: t('pages:admin.table.status'), sortable: true },
    { key: 'paymentStatus', label: t('pages:admin.table.payment'), sortable: true },
    { key: 'actions', label: t('pages:admin.table.actions'), sortable: false }
  ];


  // Filtrer les données selon les rôles
//   const getFilteredLessons = () => {
//   let lessonsArray = [];
//   if (Array.isArray(lessons)) {
//     lessonsArray = lessons;
//   } else if (lessons && typeof lessons === 'object') {
//     if (Array.isArray(lessons.lessons)) {
//       lessonsArray = lessons.lessons;
//     } else if (lessons.data && Array.isArray(lessons.data.lessons)) {
//       lessonsArray = lessons.data.lessons;
//     }
//   }
//   if (isAdmin) {
//     return lessonsArray;
//   } else if (isTeacher) {
//     return lessonsArray.filter(lesson => lesson.teacher === currentUser?.firstName + ' ' + currentUser?.lastName);
//   }
//   return [];
// };

  const getFilteredBookings = () => {
    // bookings peut être un tableau ou un objet avec .data
    let bookingsArray = Array.isArray(bookings) ? bookings : bookings?.data || [];
    if (isAdmin) {
      return bookingsArray;
    } else if (isTeacher) {
      // Filtre par teacher_id
      return bookingsArray.filter(booking => booking.teacher_id === currentUser?.id);
    }
    return [];
  };

  // Gestion des actions
  const handleEdit = (item, type) => {
    setCurrentItem(item);
    setModalType(`edit-${type}`);
    setIsModalOpen(true);
  };

  const handleDelete = (item, type) => {
    setCurrentItem(item);
    setModalType(`delete-${type}`);
    setIsModalOpen(true);
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleAddNew = (type) => {
    setCurrentItem(null);
    setModalType(`add-${type}`);
    setIsModalOpen(true);
  };


  // Sauvegarder un utilisateur (création ou modification) via API
  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    try {
      let savedUser;
      if (modalType === 'add-user') {
        savedUser = await userService.createUser(userData);
        setUsers(prev => [...prev, savedUser]);
      } else if (modalType === 'edit-user') {
        savedUser = await userService.updateUser(userData.id, userData);
        setUsers(prev => prev.map(user => user.id === savedUser.id ? savedUser : user));
      }
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Sauvegarder une leçon (création ou modification) via API
  const handleSaveLesson = async (lessonData) => {
    setIsLoading(true);
    try {
      let savedLesson;
      if (modalType === 'add-lesson') {
        savedLesson = await lessonService.createLesson(lessonData);
        setLessons(prev => [...prev, savedLesson]);
      } else if (modalType === 'edit-lesson') {
        savedLesson = await lessonService.updateLesson(lessonData.id, lessonData);
        setLessons(prev => prev.map(lesson => lesson.id === savedLesson.id ? savedLesson : lesson));
      }
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Gérer les actions sur les réservations via API
  const handleBookingAction = async (bookingId, action) => {
    setIsLoading(true);
    try {
      let updatedBooking;
      if (action === 'confirm' && bookingService.confirmBooking) {
        updatedBooking = await bookingService.confirmBooking(bookingId);
      } else if (action === 'cancel' && bookingService.cancelBooking) {
        updatedBooking = await bookingService.cancelBooking(bookingId);
      } else if (action === 'complete' && bookingService.completeBooking) {
        updatedBooking = await bookingService.completeBooking(bookingId);
      }
      if (updatedBooking) {
        setBookings(prev => prev.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Supprimer un élément via API
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      if (modalType === 'delete-user') {
        await userService.deleteUser(currentItem.id);
        setUsers(prev => prev.filter(user => user.id !== currentItem.id));
      } else if (modalType === 'delete-lesson') {
        await lessonService.deleteLesson(currentItem.id);
        setLessons(prev => prev.filter(lesson => lesson.id !== currentItem.id));
      } else if (modalType === 'delete-booking' && bookingService.deleteBooking) {
        await bookingService.deleteBooking(currentItem.id);
        setBookings(prev => prev.filter(booking => booking.id !== currentItem.id));
      }
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fermer la modal
  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    }
  };

  // Rendu des actions pour les tables
  const renderActions = (item, type) => {
    if (type === 'booking') {
      return (
        <div className="admin__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(item)}
            className="admin__action-btn admin__action-btn--view"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {item.status === 'Pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBookingAction(item.id, 'confirm')}
              className="admin__action-btn admin__action-btn--confirm"
              title={t('pages:admin.actions.confirm', 'Confirmer')}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
            </Button>
          )}
          {item.status === 'Confirmed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBookingAction(item.id, 'complete')}
              className="admin__action-btn admin__action-btn--complete"
              title={t('pages:admin.actions.complete', 'Terminer')}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item, type)}
            className="admin__action-btn admin__action-btn--delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="admin__actions">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleView(item)}
          className="admin__action-btn admin__action-btn--view"
        >
          <FontAwesomeIcon icon={faEye} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(item, type)}
          className="admin__action-btn admin__action-btn--edit"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(item, type)}
          className="admin__action-btn admin__action-btn--delete"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    );
  };

  // Préparation des données avec actions

// Normalize lessons array for actions mapping
let lessonsArray = [];
if (Array.isArray(lessons)) {
  lessonsArray = lessons;
} else if (lessons && typeof lessons === 'object') {
  if (Array.isArray(lessons.lessons)) {
    lessonsArray = lessons.lessons;
  } else if (lessons.data && Array.isArray(lessons.data.lessons)) {
    lessonsArray = lessons.data.lessons;
  }
}

let usersArray = [];
if (Array.isArray(users)) {
  usersArray = users;
} else if (users && typeof users === 'object') {
  if (Array.isArray(users.users)) {
    usersArray = users.users;
  } else if (users.data && Array.isArray(users.data.users)) {
    usersArray = users.data.users;
  }
}

const usersWithActions = usersArray.map(user => ({
  ...user,
  actions: renderActions(user, 'user')
}));

const lessonsWithActions = lessonsArray.map(lesson => ({
  ...lesson,
  language: lesson.language && typeof lesson.language === 'object' ? lesson.language.name : lesson.language,
  actions: renderActions(lesson, 'lesson')
}));

const bookingsWithActions = getFilteredBookings().map(booking => ({
  ...booking,
  studentName:
    booking.studentName ||
    ((booking.studentFirstName && booking.studentLastName)
      ? booking.studentFirstName + ' ' + booking.studentLastName
      : (() => {
          // Cherche l'utilisateur dans users par id
          let userObj = null;
          if (booking.student_id) {
            if (Array.isArray(usersArray)) {
              userObj = usersArray.find(u => u.id === booking.student_id);
            }
          }
          return userObj ? `${userObj.firstName} ${userObj.lastName}` : '';
        })()),
  lessonTitle:
    (() => {
      let lessonObj = null;
      if (booking.lesson_id) {
        if (Array.isArray(lessonsArray)) {
          lessonObj = lessonsArray.find(l => l.id === booking.lesson_id);
        }
      }
      return lessonObj && lessonObj.title ? lessonObj.title : '';
    })(),
  scheduled_date:
    booking.scheduled_date || '',
  paymentStatus:
    booking.paymentStatus || booking.payment_status || '',
  actions: renderActions(booking, 'booking')
}));

  const adminClasses = [
    'admin',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={adminClasses} {...props}>
      <div className="admin__container">
        {/* Header */}
        <div className="admin__header">
          <div className="admin__header-content">
            <Title level={1} className="admin__title">
              {t('pages:admin.title', 'Administration')}
            </Title>
            <p className="admin__subtitle">
              {t('pages:admin.subtitle', 'Gérez votre plateforme d\'apprentissage')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin__tabs">
          {canAccessDashboard && (
            <button
              className={`admin__tab ${activeTab === 'dashboard' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FontAwesomeIcon icon={faChalkboardTeacher} />
              {t('pages:admin.tabs.dashboard')}
            </button>
          )}
          {canAccessUsers && (
            <button
              className={`admin__tab ${activeTab === 'users' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FontAwesomeIcon icon={faUsers} />
              {t('pages:admin.tabs.users')}
            </button>
          )}
          {canAccessLessons && (
            <button
              className={`admin__tab ${activeTab === 'lessons' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              <FontAwesomeIcon icon={faBookOpen} />
              {t('pages:admin.tabs.lessons')}
            </button>
          )}
          {canAccessBookings && (
            <button
              className={`admin__tab ${activeTab === 'bookings' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              {t('pages:admin.tabs.bookings')}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="admin__content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin__dashboard">
              <div className="admin__stats-grid">
                {/* <StatsCard
                  title={t('pages:admin.stats.totalUsers')}
                  value={dashboardStats.totalUsers}
                  icon={faUsers}
                  color="blue"
                  trend="+12%"
                />
                <StatsCard
                  title={t('pages:admin.stats.totalLessons')}
                  value={dashboardStats.totalLessons}
                  icon={faBookOpen}
                  color="green"
                  trend="+8%"
                />
                <StatsCard
                  title={t('pages:admin.stats.totalTeachers')}
                  value={dashboardStats.totalTeachers}
                  icon={faChalkboardTeacher}
                  color="purple"
                  trend="+3%"
                />
                <StatsCard
                  title={t('pages:admin.stats.totalBookings')}
                  value={dashboardStats.totalBookings}
                  icon={faCalendarCheck}
                  color="orange"
                  trend="+15%"
                /> */}
              </div>

              <div className="admin__charts-grid">
                <Card className="admin__chart-card">
                  <Title level={3}>{t('pages:admin.stats.monthlyRevenue')}</Title>
                  <div className="admin__chart-placeholder">
                    <div className="admin__revenue-display">
                      {/* <span className="admin__revenue-amount">€{(dashboardStats.monthlyRevenue ?? 0).toLocaleString()}</span> */}
                      <span className="admin__revenue-period">{t('pages:admin.thisMonth')}</span>
                    </div>
                  </div>
                </Card>

                <Card className="admin__chart-card">
                  <Title level={3}>{t('pages:admin.recentActivity')}</Title>
                  <div className="admin__activity-list">
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--green"></span>
                      <span>{t('pages:admin.newUserRegistered')}</span>
                      <span className="admin__activity-time">{t('pages:admin.timeAgo.twoMinutes')}</span>
                    </div>
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--blue"></span>
                      <span>{t('pages:admin.lessonBooked')}</span>
                      <span className="admin__activity-time">{t('pages:admin.timeAgo.fiveMinutes')}</span>
                    </div>
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--orange"></span>
                      <span>{t('pages:admin.newReview')}</span>
                      <span className="admin__activity-time">{t('pages:admin.timeAgo.twelveMinutes')}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin__users">
              <div className="admin__section-header">
                <div className="admin__search-filter">
                  <Input
                    type="text"
                    placeholder={t('pages:admin.users.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin__search-input"
                    icon={faSearch}
                  />
                  <Button variant="outline" className="admin__filter-btn">
                    <FontAwesomeIcon icon={faFilter} />
                    {t('pages:admin.actions.filter')}
                  </Button>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => handleAddNew('user')}
                  className="admin__add-btn"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {t('pages:admin.users.addUser')}
                </Button>
              </div>

              <Card className="admin__table-card">
                {usersWithActions.length === 0 ? (
                  <div className="admin__empty-message">
                    {isLoading
                      ? t('pages:admin.users.loading', 'Chargement des utilisateurs...')
                      : t('pages:admin.users.empty', 'Aucun utilisateur à afficher.')}
                  </div>
                ) : (
                  <DataTable
                    columns={userColumns}
                    data={usersWithActions}
                    searchTerm={searchTerm}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    className="admin__data-table"
                  />
                )}
              </Card>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="admin__lessons">
              <div className="admin__section-header">
                <div className="admin__search-filter">
                  <Input
                    type="text"
                    placeholder={t('pages:admin.lessons.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin__search-input"
                    icon={faSearch}
                  />
                  <Button variant="outline" className="admin__filter-btn">
                    <FontAwesomeIcon icon={faFilter} />
                    {t('pages:admin.actions.filter')}
                  </Button>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => handleAddNew('lesson')}
                  className="admin__add-btn"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {t('pages:admin.lessons.addLesson')}
                </Button>
              </div>

              <Card className="admin__table-card">
                <DataTable
                  columns={lessonColumns}
                  data={lessonsWithActions}
                  searchTerm={searchTerm}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  className="admin__data-table"
                />
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="admin__bookings">
              <div className="admin__section-header">
                <Title level={2}>{t('pages:admin.bookings.title')}</Title>
                <div className="admin__section-actions">
                  <Input
                    type="text"
                    placeholder={t('pages:admin.bookings.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin__search-input"
                    icon={faSearch}
                  />
                </div>
              </div>

              <Card className="admin__table-card">
                <DataTable
                  columns={bookingColumns}
                  data={bookingsWithActions}
                  searchTerm={searchTerm}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  className="admin__data-table"
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour les actions CRUD */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${modalType.includes('add') ? t('pages:admin.actions.add') : modalType.includes('edit') ? t('pages:admin.actions.edit') : modalType.includes('delete') ? t('pages:admin.actions.delete') : t('pages:admin.actions.view')} ${modalType.includes('user') ? t('pages:admin.modal.user') : modalType.includes('lesson') ? t('pages:admin.modal.lesson') : modalType.includes('booking') ? t('pages:admin.modal.booking', 'réservation') : ''}`}
        className="admin__modal"
        size={modalType.includes('delete') ? 'small' : 'large'}
      >
        <div className="admin__modal-content">
          {modalType.includes('delete') ? (
            <div className="admin__delete-confirmation">
              <p>{t('pages:admin.modal.confirmDelete')}</p>
              <div className="admin__modal-actions">
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  {t('pages:admin.modal.cancel')}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? t('pages:admin.form.deleting') : t('pages:admin.actions.delete')}
                </Button>
              </div>
            </div>
          ) : modalType.includes('user') ? (
            <UserForm
              user={currentItem}
              onSave={handleSaveUser}
              onCancel={handleCloseModal}
              isLoading={isLoading}
              mode={modalType.includes('add') ? 'create' : modalType.includes('edit') ? 'edit' : 'view'}
            />
          ) : modalType.includes('lesson') ? (
            <LessonForm
              lesson={currentItem}
              onSave={handleSaveLesson}
              onCancel={handleCloseModal}
              isLoading={isLoading}
              mode={modalType.includes('add') ? 'create' : modalType.includes('edit') ? 'edit' : 'view'}
            />
          ) : modalType.includes('booking') ? (
            <div className="admin__booking-details">
              {currentItem && (
                <div className="admin__booking-info">
                  <h3>{t('pages:admin.bookings.details', 'Détails de la réservation')}</h3>
                  <div className="admin__booking-grid">
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.student')}:</label>
                      <span>{currentItem.studentName}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.email')}:</label>
                      <span>{currentItem.studentEmail}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.lesson')}:</label>
                      <span>{currentItem.lessonTitle}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.teacher')}:</label>
                      <span>{currentItem.teacherName}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.date')}:</label>
                      <span>{currentItem.date}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.time')}:</label>
                      <span>{currentItem.time}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.form.duration')}:</label>
                      <span>{currentItem.duration}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.price')}:</label>
                      <span>{currentItem.price}€</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.status')}:</label>
                      <span className={`admin__status admin__status--${currentItem.status?.toLowerCase()}`}>
                        {currentItem.status}
                      </span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('pages:admin.table.payment')}:</label>
                      <span className={`admin__payment admin__payment--${currentItem.paymentStatus?.toLowerCase()}`}>
                        {currentItem.paymentStatus}
                      </span>
                    </div>
                    {currentItem.notes && (
                      <div className="admin__booking-field admin__booking-field--full">
                        <label>{t('pages:admin.bookings.notes', 'Notes')}:</label>
                        <p>{currentItem.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="admin__booking-actions">
                    <Button variant="outline" onClick={handleCloseModal}>
                      {t('pages:admin.modal.close')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="admin__form-placeholder">
              <p>{t('pages:admin.modal.formPlaceholder', { type: modalType })}</p>
              <Button variant="primary" onClick={handleCloseModal}>
                {t('pages:admin.modal.close')}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

Admin.propTypes = {
  className: PropTypes.string
};

export default Admin;
