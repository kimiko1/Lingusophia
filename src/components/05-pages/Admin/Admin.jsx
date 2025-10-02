import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck,
  faEdit,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { Title, Button, Input, Card, Modal } from '@atoms';

import { DataTable } from '@molecules';
import { UserForm, LessonForm } from '@organisms';
import { userService, lessonService, bookingService } from '@services';
import './Admin.scss';
import AdminTabs from './AdminTabs';
import AdminUsersTab from './AdminUsersTab';
import LessonsAdminTab from './LessonsAdminTab';
import AdminBookingsTab from './AdminBookingsTab';
import AdminModal from './AdminModal';
import AdminFileUpload from './AdminFileUpload';

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
  
  // Récupérer l'utilisateur authentifié via Redux
  const user = useSelector(state => state.auth.user);

  // Déterminer les droits
  const isAdmin = user?.role === 'Admin';
  const isTeacher = user?.role === 'Teacher';

  // Tabs accessibles selon le rôle
  const availableTabs = isAdmin
    ? ['dashboard', 'users', 'bookings'] // Retirer 'lessons' pour Admin
    : isTeacher
      ? ['lessons', 'bookings']
      : [];

  // Onglet par défaut selon le rôle
  const [activeTab, setActiveTab] = useState(() => availableTabs[0] || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  // Vérifier les permissions
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
  if (user && !isAdmin && !isTeacher) {
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
  const getFilteredBookings = () => {
    // bookings peut être un tableau ou un objet avec .data
    let bookingsArray = Array.isArray(bookings) ? bookings : bookings?.data || [];
    if (isAdmin) {
      return bookingsArray;
    } else if (isTeacher) {
      // Filtre par teacher_id
  return bookingsArray.filter(booking => booking.teacher_id === user?.user?.id);
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
      if (modalType === 'add-lesson') {
        await lessonService.createLesson(lessonData);
      } else if (modalType === 'edit-lesson') {
        await lessonService.updateLesson(lessonData.id, lessonData);
      }
      // Recharge toutes les données admin après action
      const allData = await userService.getAllUsers();
      setUsers(allData.users || []);
      setLessons(allData.lessons || []);
      setBookings(allData.bookings || []);
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
      if (action === 'confirm' && bookingService.confirmBooking) {
        await bookingService.confirmBooking(bookingId);
      } else if (action === 'complete' && bookingService.completeBooking) {
        await bookingService.completeBooking(bookingId);
      }
      // Recharge toutes les données admin après action
      const allData = await userService.getAllUsers();
      setUsers(allData.users || []);
      setLessons(allData.lessons || []);
      setBookings(allData.bookings || []);
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

        <AdminTabs
          canAccessDashboard={isAdmin}
          canAccessUsers={isAdmin}
          canAccessLessons={isAdmin || isTeacher}
          canAccessBookings={isAdmin || isTeacher}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          t={t}
          availableTabs={availableTabs}
        />
        <div className="admin__content">
          {activeTab === 'dashboard' && isAdmin && (
            <div className="admin__dashboard">
              {/* ...dashboard content... */}
            </div>
          )}
          {activeTab === 'users' && isAdmin && (
            <AdminUsersTab
              t={t}
              userColumns={userColumns}
              usersWithActions={usersWithActions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              isLoading={isLoading}
              handleAddNew={handleAddNew}
            />
          )}
          {activeTab === 'lessons' && (isAdmin || isTeacher) && (
            <LessonsAdminTab
              lessons={lessons}
              setLessons={setLessons}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          {activeTab === 'bookings' && (isAdmin || isTeacher) && (
            <AdminBookingsTab
              t={t}
              bookingColumns={bookingColumns}
              bookingsWithActions={bookingsWithActions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )}
        </div>
        <AdminModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          modalType={modalType}
          t={t}
          isLoading={isLoading}
          handleConfirmDelete={handleConfirmDelete}
          currentItem={currentItem}
          handleSaveUser={handleSaveUser}
          handleSaveLesson={handleSaveLesson}
        />
        
      </div>
    </div>
  );
};

Admin.propTypes = {
  className: PropTypes.string
};

export default Admin;
