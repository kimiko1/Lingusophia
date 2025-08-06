import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faGraduationCap, 
  faUser, 
  faCalendarAlt,
  faBookmark,
  faStar,
  faChevronDown,
  faCog,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';

import { NavItem } from '@molecules';
import { Logo, UserGreeting, LanguageSelector } from '@atoms';
import testSvg from '@assets/test.svg';
import './Navbar.scss';

/**
 * Navbar component - Main navigation organism
 * @param {Object} props - Component props
 * @param {string} props.variant - Navigation style variant
 */
const Navbar = ({ 
  variant = 'default',
  ...props
}) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth state from AuthContext
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { icon: faThLarge, label: t('navigation.home'), href: "/", id: "dashboard" },
    { icon: faCalendarAlt, label: t('navigation.calendar'), href: "/calendar", id: "schedule" },
    { icon: faGraduationCap, label: t('navigation.myLessons'), href: "/my-lessons", id: "lessons" },
    { icon: faBookmark, label: t('navigation.bookings'), href: "/bookings", id: "bookings" },
    { icon: faStar, label: t('navigation.customerReviews'), href: "/customer-reviews", id: "reviews" }
  ];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { icon: faThLarge, label: t('navigation.home'), href: "/", id: "home" },
    { icon: faStar, label: t('navigation.customerReviews'), href: "/customer-reviews", id: "reviews" }
  ];

  const profileItems = [
    { icon: faUser, label: t('navigation.profile'), href: "/profile" },
    { icon: faCog, label: t('navigation.settings'), href: "/settings" }
  ];

  // Add admin item if user is admin
  if (user?.role === 'admin') {
    profileItems.push({ icon: faUserShield, label: "Admin", href: "/admin" });
  }

  // Check if a link is active
  const isActiveLink = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeAll();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // Forcer la déconnexion côté UI même si l'API échoue
      navigate('/');
      closeAll();
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((isMenuOpen || isProfileOpen) && !event.target.closest('.navbar')) {
        closeAll();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  // Close menus on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeAll();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  const navbarClasses = [
    'navbar',
    `navbar--${variant}`,
    isMenuOpen && 'navbar--menu-open',
    isProfileOpen && 'navbar--profile-open'
  ].filter(Boolean).join(' ');

  // Afficher un indicateur de chargement pendant la vérification d'authentification
  if (isLoading) {
    return (
      <header className={navbarClasses} {...props}>
        <div className="navbar__loading">
          <Logo 
            size="medium" 
            clickable 
            onClick={() => window.location.href = '/'}
            className="navbar__logo"
          />
          <div className="navbar__auth-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={navbarClasses} {...props}>
      <div className="navbar__left">
        <button 
          className={`navbar__menu-toggle${isMenuOpen ? ' navbar__menu-toggle--open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? t('aria.closeMenu') : t('aria.openMenu')}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar__menu-icon">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
        </button>
      </div>

      <div className="navbar__center">
      <Link to="/" className="navbar__center">
        <Logo 
          size="large" 
          variant="gradient"
          clickable
        />
      </Link>
      </div>

      <div className="navbar__right">
        {isAuthenticated ? (
          <div className="navbar__user">
            <div className="navbar__language-selector">
              <LanguageSelector 
                variant="dropdown"
                size="sm"
                showFlag={true}
                showNativeName={false}
              />
            </div>
            <div className="navbar__greeting">
              <UserGreeting 
                name={user?.firstName || 'User'} 
                variant="primary"
                animated
              />
            </div>
            <div className="navbar__profile">
              <img src={testSvg} alt={t('user.profile')} className="navbar__avatar" loading="lazy" />
              <button 
                className="navbar__profile-toggle"
                onClick={toggleProfile}
                aria-label={t('aria.openProfile')}
                aria-expanded={isProfileOpen}
              >
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`navbar__profile-chevron ${isProfileOpen ? 'navbar__profile-chevron--open' : ''}`}
                />
              </button>
              <div className={`navbar__profile-dropdown ${isProfileOpen ? 'navbar__profile-dropdown--open' : ''}`}>
                <div className="navbar__profile-header">
                  <div className="navbar__profile-info">
                    <div className="navbar__profile-name">{user?.firstName} {user?.lastName}</div>
                    <div className="navbar__profile-email">{user?.email}</div>
                    <div className="navbar__profile-role">{t(`common:roles.${user?.role?.toLowerCase()}`)}</div>
                  </div>
                </div>
                <ul className="navbar__profile-menu">
                  {profileItems.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href} className="navbar__profile-link">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                  <li className="navbar__profile-divider"></li>
                  <li>
                    <button 
                      className="navbar__profile-link navbar__profile-link--logout"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>{t('navigation.logout')}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="navbar__auth">
            <div className="navbar__language-selector">
              <LanguageSelector 
                variant="dropdown"
                size="sm"
                showFlag={true}
                showNativeName={false}
              />
            </div>
            <div className="navbar__auth-buttons">
              <Link to="/login" className="navbar__auth-button navbar__auth-button--login">
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="navbar__auth-button navbar__auth-button--register">
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Hamburger Menu Overlay */}
      <nav className={`navbar__nav ${isMenuOpen ? 'navbar__nav--open' : ''}`}>
        <ul className="navbar__nav-list">
          {(isAuthenticated ? authenticatedNavItems : publicNavItems).map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={isActiveLink(item.href)}
              variant={variant === 'primary' ? 'primary' : 'default'}
              size="medium"
            />
          ))}
        </ul>
      </nav>

      {/* Overlay for menu/profile */}
      {(isMenuOpen || isProfileOpen) && (
        <div className="navbar__overlay" onClick={closeAll}></div>
      )}
    </header>
  );
};

Navbar.propTypes = {
  variant: PropTypes.oneOf(['default', 'primary', 'minimal'])
};

export default Navbar;
