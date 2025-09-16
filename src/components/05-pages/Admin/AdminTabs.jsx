import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBookOpen, faChalkboardTeacher, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const AdminTabs = ({ canAccessDashboard, canAccessUsers, canAccessLessons, canAccessBookings, activeTab, setActiveTab, t }) => (
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
);

export default AdminTabs;
