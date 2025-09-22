import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBookOpen, faChalkboardTeacher, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

// Map des tabs disponibles
const TABS = [
  {
    key: 'dashboard',
    icon: faChalkboardTeacher,
    label: t => t('pages:admin.tabs.dashboard')
  },
  {
    key: 'users',
    icon: faUsers,
    label: t => t('pages:admin.tabs.users')
  },
  {
    key: 'lessons',
    icon: faBookOpen,
    label: t => t('pages:admin.tabs.lessons')
  },
  {
    key: 'bookings',
    icon: faCalendarCheck,
    label: t => t('pages:admin.tabs.bookings')
  }
];

const AdminTabs = ({
  activeTab,
  setActiveTab,
  t,
  availableTabs // tableau de clés: ['dashboard', ...]
}) => (
  <div className="admin__tabs">
    {TABS.filter(tab => availableTabs?.includes(tab.key)).map(tab => (
      <button
        key={tab.key}
        className={`admin__tab ${activeTab === tab.key ? 'admin__tab--active' : ''}`}
        onClick={() => setActiveTab(tab.key)}
      >
        <FontAwesomeIcon icon={tab.icon} />
        {tab.label(t)}
      </button>
    ))}
  </div>
);

export default AdminTabs;
