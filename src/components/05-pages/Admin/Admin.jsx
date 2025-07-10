import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { Title, Button, Input, Card, Modal } from '../../01-atoms';
import { StatsCard, DataTable } from '../../02-molecules';
import { UserForm, LessonForm } from '../../03-organisms';
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
  const [activeTab, setActiveTab] = useState('lessons'); // Commence par les leçons par défaut
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulation du rôle utilisateur (dans une vraie app, cela viendrait du contexte d'authentification)
  const [currentUser] = useState({
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    role: 'Admin' // Peut être 'Admin', 'Teacher', ou 'Student'
  });
  
  // Vérifier les permissions
  const isAdmin = currentUser.role === 'Admin';
  const isTeacher = currentUser.role === 'Teacher';
  const isStudent = currentUser.role === 'Student';
  const canAccessDashboard = isAdmin;
  const canAccessUsers = isAdmin;
  const canAccessLessons = isAdmin || isTeacher;
  const canAccessBookings = isAdmin || isTeacher;

  // Rediriger les étudiants (ils n'ont pas accès à l'admin)
  if (isStudent) {
    return (
      <div className="admin__access-denied">
        <div className="admin__access-denied-content">
          <h1>{t('admin.accessDenied.title')}</h1>
          <p>{t('admin.accessDenied.message')}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            {t('admin.accessDenied.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  // Données simulées pour le dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 1247,
    totalLessons: 156,
    totalTeachers: 23,
    totalBookings: 892,
    monthlyRevenue: 15420,
    activeUsers: 89,
    completionRate: 76.3,
    averageRating: 4.8
  });

  // Données simulées pour les utilisateurs
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alice Martin',
      email: 'alice.martin@email.com',
      role: 'Student',
      joinDate: '2024-01-15',
      lastLogin: '2025-01-09',
      status: 'Active',
      lessonsCompleted: 12,
      totalSpent: 420
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      role: 'Student',
      joinDate: '2024-02-20',
      lastLogin: '2025-01-08',
      status: 'Active',
      lessonsCompleted: 8,
      totalSpent: 280
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      role: 'Teacher',
      joinDate: '2024-01-10',
      lastLogin: '2025-01-10',
      status: 'Active',
      lessonsGiven: 45,
      rating: 4.9
    }
  ]);

  // Données simulées pour les leçons
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Basic English Conversation',
      language: 'English',
      level: 'Beginner',
      duration: '30 min',
      price: 25,
      teacher: 'Sarah Wilson',
      bookings: 23,
      rating: 4.8,
      status: 'Active'
    },
    {
      id: 2,
      title: 'French Grammar Essentials',
      language: 'French',
      level: 'Intermediate',
      duration: '45 min',
      price: 35,
      teacher: 'Pierre Dubois',
      bookings: 18,
      rating: 4.7,
      status: 'Active'
    }
  ]);

  // Données simulées pour les réservations
  const [bookings, setBookings] = useState([
    {
      id: 1,
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      lessonTitle: 'Basic English Conversation',
      lessonId: 1,
      teacherName: 'Sarah Wilson',
      date: '2025-01-15',
      time: '14:00',
      duration: '30 min',
      price: 25,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: '2025-01-10',
      notes: 'Première leçon - niveau débutant'
    },
    {
      id: 2,
      studentName: 'Bob Johnson',
      studentEmail: 'bob.johnson@email.com',
      lessonTitle: 'Basic English Conversation',
      lessonId: 1,
      teacherName: 'Sarah Wilson',
      date: '2025-01-16',
      time: '10:00',
      duration: '30 min',
      price: 25,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: '2025-01-12',
      notes: 'Cours de conversation'
    },
    {
      id: 3,
      studentName: 'Marie Dubois',
      studentEmail: 'marie.dubois@email.com',
      lessonTitle: 'French Grammar Essentials',
      lessonId: 2,
      teacherName: 'Pierre Dubois',
      date: '2025-01-17',
      time: '16:00',
      duration: '45 min',
      price: 35,
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: '2025-01-13',
      notes: 'Grammaire française intermédiaire'
    },
    {
      id: 4,
      studentName: 'John Smith',
      studentEmail: 'john.smith@email.com',
      lessonTitle: 'Basic English Conversation',
      lessonId: 1,
      teacherName: 'Sarah Wilson',
      date: '2025-01-14',
      time: '11:00',
      duration: '30 min',
      price: 25,
      status: 'Completed',
      paymentStatus: 'Paid',
      createdAt: '2025-01-08',
      notes: 'Cours terminé avec succès'
    }
  ]);

  // Colonnes pour la table des utilisateurs
  const userColumns = [
    { key: 'name', label: t('admin.table.name'), sortable: true },
    { key: 'email', label: t('admin.table.email'), sortable: true },
    { key: 'role', label: t('admin.table.role'), sortable: true },
    { key: 'joinDate', label: t('admin.table.joinDate'), sortable: true },
    { key: 'status', label: t('admin.table.status'), sortable: true },
    { key: 'actions', label: t('admin.table.actions'), sortable: false }
  ];

  // Colonnes pour la table des leçons
  const lessonColumns = [
    { key: 'title', label: t('admin.table.title'), sortable: true },
    { key: 'language', label: t('admin.table.language'), sortable: true },
    { key: 'level', label: t('admin.table.level'), sortable: true },
    { key: 'price', label: t('admin.table.price'), sortable: true },
    { key: 'teacher', label: t('admin.table.teacher'), sortable: true },
    { key: 'bookings', label: t('admin.table.bookings'), sortable: true },
    { key: 'actions', label: t('admin.table.actions'), sortable: false }
  ];

  // Colonnes pour la table des réservations
  const bookingColumns = [
    { key: 'studentName', label: t('admin.table.student'), sortable: true },
    { key: 'lessonTitle', label: t('admin.table.lesson'), sortable: true },
    { key: 'date', label: t('admin.table.date'), sortable: true },
    { key: 'time', label: t('admin.table.time'), sortable: true },
    { key: 'status', label: t('admin.table.status'), sortable: true },
    { key: 'paymentStatus', label: t('admin.table.payment'), sortable: true },
    { key: 'actions', label: t('admin.table.actions'), sortable: false }
  ];

  // Simulation de requêtes API
  useEffect(() => {
    // Simule le chargement des données
    const loadData = async () => {
      // Simulation d'une requête API
      setTimeout(() => {
        console.log('Données chargées');
      }, 1000);
    };
    loadData();
  }, []);

  // Définir l'onglet par défaut selon le rôle
  useEffect(() => {
    if (isAdmin && activeTab === 'lessons') {
      setActiveTab('dashboard');
    } else if (isTeacher && !canAccessLessons) {
      setActiveTab('lessons');
    }
  }, [isAdmin, isTeacher, canAccessLessons, activeTab]);

  // Filtrer les données selon les rôles
  const getFilteredLessons = () => {
    if (isAdmin) {
      return lessons;
    } else if (isTeacher) {
      // Un professeur ne voit que ses propres leçons
      return lessons.filter(lesson => lesson.teacher === currentUser.name);
    }
    return [];
  };

  const getFilteredBookings = () => {
    if (isAdmin) {
      return bookings;
    } else if (isTeacher) {
      // Un professeur ne voit que les réservations de ses leçons
      return bookings.filter(booking => booking.teacherName === currentUser.name);
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

  // Sauvegarder un utilisateur (création ou modification)
  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalType === 'add-user') {
        // Ajouter un nouvel utilisateur
        setUsers(prev => [...prev, userData]);
      } else if (modalType === 'edit-user') {
        // Modifier un utilisateur existant
        setUsers(prev => prev.map(user => 
          user.id === userData.id ? userData : user
        ));
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

  // Sauvegarder une leçon (création ou modification)
  const handleSaveLesson = async (lessonData) => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalType === 'add-lesson') {
        // Ajouter une nouvelle leçon
        setLessons(prev => [...prev, lessonData]);
      } else if (modalType === 'edit-lesson') {
        // Modifier une leçon existante
        setLessons(prev => prev.map(lesson => 
          lesson.id === lessonData.id ? lessonData : lesson
        ));
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

  // Gérer les actions sur les réservations
  const handleBookingAction = async (bookingId, action) => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'confirm') {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'Confirmed' } : booking
        ));
      } else if (action === 'cancel') {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking
        ));
      } else if (action === 'complete') {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'Completed' } : booking
        ));
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un élément
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalType === 'delete-user') {
        setUsers(prev => prev.filter(user => user.id !== currentItem.id));
      } else if (modalType === 'delete-lesson') {
        setLessons(prev => prev.filter(lesson => lesson.id !== currentItem.id));
      } else if (modalType === 'delete-booking') {
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
              title={t('admin.actions.confirm', 'Confirmer')}
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
              title={t('admin.actions.complete', 'Terminer')}
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
  const usersWithActions = users.map(user => ({
    ...user,
    actions: renderActions(user, 'user')
  }));

  const lessonsWithActions = getFilteredLessons().map(lesson => ({
    ...lesson,
    actions: renderActions(lesson, 'lesson')
  }));

  const bookingsWithActions = getFilteredBookings().map(booking => ({
    ...booking,
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
              {t('admin.title', 'Administration')}
            </Title>
            <p className="admin__subtitle">
              {t('admin.subtitle', 'Gérez votre plateforme d\'apprentissage')}
            </p>
          </div>
          <div className="admin__header-actions">
            <Button variant="outline" className="admin__export-btn">
              <FontAwesomeIcon icon={faDownload} />
              {t('admin.actions.export')}
            </Button>
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
              {t('admin.tabs.dashboard')}
            </button>
          )}
          {canAccessUsers && (
            <button
              className={`admin__tab ${activeTab === 'users' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FontAwesomeIcon icon={faUsers} />
              {t('admin.tabs.users')}
            </button>
          )}
          {canAccessLessons && (
            <button
              className={`admin__tab ${activeTab === 'lessons' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              <FontAwesomeIcon icon={faBookOpen} />
              {t('admin.tabs.lessons')}
            </button>
          )}
          {canAccessBookings && (
            <button
              className={`admin__tab ${activeTab === 'bookings' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              {t('admin.tabs.bookings')}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="admin__content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin__dashboard">
              <div className="admin__stats-grid">
                <StatsCard
                  title={t('admin.stats.totalUsers')}
                  value={dashboardStats.totalUsers}
                  icon={faUsers}
                  color="blue"
                  trend="+12%"
                />
                <StatsCard
                  title={t('admin.stats.totalLessons')}
                  value={dashboardStats.totalLessons}
                  icon={faBookOpen}
                  color="green"
                  trend="+8%"
                />
                <StatsCard
                  title={t('admin.stats.totalTeachers')}
                  value={dashboardStats.totalTeachers}
                  icon={faChalkboardTeacher}
                  color="purple"
                  trend="+3%"
                />
                <StatsCard
                  title={t('admin.stats.totalBookings')}
                  value={dashboardStats.totalBookings}
                  icon={faCalendarCheck}
                  color="orange"
                  trend="+15%"
                />
              </div>

              <div className="admin__charts-grid">
                <Card className="admin__chart-card">
                  <Title level={3}>{t('admin.stats.monthlyRevenue')}</Title>
                  <div className="admin__chart-placeholder">
                    <div className="admin__revenue-display">
                      <span className="admin__revenue-amount">€{dashboardStats.monthlyRevenue.toLocaleString()}</span>
                      <span className="admin__revenue-period">{t('admin.thisMonth')}</span>
                    </div>
                  </div>
                </Card>

                <Card className="admin__chart-card">
                  <Title level={3}>{t('admin.recentActivity')}</Title>
                  <div className="admin__activity-list">
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--green"></span>
                      <span>{t('admin.newUserRegistered')}</span>
                      <span className="admin__activity-time">{t('admin.timeAgo.twoMinutes')}</span>
                    </div>
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--blue"></span>
                      <span>{t('admin.lessonBooked')}</span>
                      <span className="admin__activity-time">{t('admin.timeAgo.fiveMinutes')}</span>
                    </div>
                    <div className="admin__activity-item">
                      <span className="admin__activity-dot admin__activity-dot--orange"></span>
                      <span>{t('admin.newReview')}</span>
                      <span className="admin__activity-time">{t('admin.timeAgo.twelveMinutes')}</span>
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
                    placeholder={t('admin.users.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin__search-input"
                    icon={faSearch}
                  />
                  <Button variant="outline" className="admin__filter-btn">
                    <FontAwesomeIcon icon={faFilter} />
                    {t('admin.actions.filter')}
                  </Button>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => handleAddNew('user')}
                  className="admin__add-btn"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {t('admin.users.addUser')}
                </Button>
              </div>

              <Card className="admin__table-card">
                <DataTable
                  columns={userColumns}
                  data={usersWithActions}
                  searchTerm={searchTerm}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  className="admin__data-table"
                />
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
                    placeholder={t('admin.lessons.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin__search-input"
                    icon={faSearch}
                  />
                  <Button variant="outline" className="admin__filter-btn">
                    <FontAwesomeIcon icon={faFilter} />
                    {t('admin.actions.filter')}
                  </Button>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => handleAddNew('lesson')}
                  className="admin__add-btn"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {t('admin.lessons.addLesson')}
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
                <Title level={2}>{t('admin.bookings.title')}</Title>
                <div className="admin__section-actions">
                  <Input
                    type="text"
                    placeholder={t('admin.bookings.searchPlaceholder')}
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
        title={`${modalType.includes('add') ? t('admin.actions.add') : modalType.includes('edit') ? t('admin.actions.edit') : modalType.includes('delete') ? t('admin.actions.delete') : t('admin.actions.view')} ${modalType.includes('user') ? t('admin.modal.user') : modalType.includes('lesson') ? t('admin.modal.lesson') : modalType.includes('booking') ? t('admin.modal.booking', 'réservation') : ''}`}
        className="admin__modal"
        size={modalType.includes('delete') ? 'small' : 'large'}
      >
        <div className="admin__modal-content">
          {modalType.includes('delete') ? (
            <div className="admin__delete-confirmation">
              <p>{t('admin.modal.confirmDelete')}</p>
              <div className="admin__modal-actions">
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  {t('admin.modal.cancel')}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? t('admin.form.deleting') : t('admin.actions.delete')}
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
                  <h3>{t('admin.bookings.details', 'Détails de la réservation')}</h3>
                  <div className="admin__booking-grid">
                    <div className="admin__booking-field">
                      <label>{t('admin.table.student')}:</label>
                      <span>{currentItem.studentName}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.email')}:</label>
                      <span>{currentItem.studentEmail}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.lesson')}:</label>
                      <span>{currentItem.lessonTitle}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.teacher')}:</label>
                      <span>{currentItem.teacherName}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.date')}:</label>
                      <span>{currentItem.date}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.time')}:</label>
                      <span>{currentItem.time}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.form.duration')}:</label>
                      <span>{currentItem.duration}</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.price')}:</label>
                      <span>{currentItem.price}€</span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.status')}:</label>
                      <span className={`admin__status admin__status--${currentItem.status?.toLowerCase()}`}>
                        {currentItem.status}
                      </span>
                    </div>
                    <div className="admin__booking-field">
                      <label>{t('admin.table.payment')}:</label>
                      <span className={`admin__payment admin__payment--${currentItem.paymentStatus?.toLowerCase()}`}>
                        {currentItem.paymentStatus}
                      </span>
                    </div>
                    {currentItem.notes && (
                      <div className="admin__booking-field admin__booking-field--full">
                        <label>{t('admin.bookings.notes', 'Notes')}:</label>
                        <p>{currentItem.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="admin__booking-actions">
                    <Button variant="outline" onClick={handleCloseModal}>
                      {t('admin.modal.close')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="admin__form-placeholder">
              <p>{t('admin.modal.formPlaceholder', { type: modalType })}</p>
              <Button variant="primary" onClick={handleCloseModal}>
                {t('admin.modal.close')}
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
