import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faGraduationCap, 
  faUser, 
  faBars, 
  faTimes, 
  faCalendarAlt,
  faHistory,
  faUserCircle,
  faStar,
  faChevronDown,
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import { NavItem } from '../../02-molecules';
import { Logo, UserGreeting } from '../../01-atoms';
import LanguageSelector from '../../01-atoms/LanguageSelector/LanguageSelector';
import testSvg from '../../../assets/test.svg';
import './Navbar.scss';

/**
 * Navbar component - Main navigation organism
 * @param {Object} props - Component props
 * @param {string} props.variant - Navigation style variant
 * @param {boolean} props.showUserInfo - Whether to show user greeting
 * @param {string} props.userName - Current user's name
 * @param {function} props.onLogout - Logout handler
 * @param {boolean} props.isLoggedIn - Whether user is logged in
 */
const Navbar = ({ 
  variant = 'default',
  showUserInfo = true,
  userName = 'User',
  onLogout,
  isLoggedIn = true,
  ...props
}) => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { icon: faThLarge, label: t('navigation.home'), href: "/", id: "dashboard" },
    { icon: faCalendarAlt, label: t('navigation.calendar'), href: "/calendar", id: "schedule" },
    { icon: faGraduationCap, label: t('navigation.myLessons'), href: "/my-lessons", id: "lessons" },
    { icon: faStar, label: t('navigation.customerReviews'), href: "/customer-reviews", id: "reviews" }
  ];

  const profileItems = [
    { icon: faUser, label: t('navigation.profile'), href: "/profile" },
    { icon: faHistory, label: t('user.learningHistory'), href: "/history" },
    { icon: faCog, label: t('navigation.settings'), href: "/settings" }
  ];

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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    closeAll();
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

  return (
    <header className={navbarClasses} {...props}>
      {/* Mobile Logo & Menu Toggle */}
      <div className="navbar__mobile-header">
        <Logo 
          size="medium" 
          clickable 
          onClick={() => window.location.href = '/'}
          className="navbar__logo-mobile"
        />
        
        <button 
          className="navbar__menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? t('aria.closeMenu') : t('aria.openMenu')}
          aria-expanded={isMenuOpen}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Desktop Logo */}
      <div className="navbar__logo-desktop">
        <Logo 
          size="large" 
          variant="gradient"
          clickable 
          onClick={() => window.location.href = '/'}
        />
      </div>

      {/* Main Navigation */}
      <nav className={`navbar__nav ${isMenuOpen ? 'navbar__nav--open' : ''}`}>
        <ul className="navbar__nav-list">
          {navItems.map((item) => (
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

      {/* User Section */}
      {isLoggedIn && (
        <div className="navbar__user">
          {/* Language Selector */}
          <div className="navbar__language-selector">
            <LanguageSelector 
              variant="dropdown"
              size="sm"
              showFlag={true}
              showNativeName={false}
            />
          </div>

          {/* User Greeting - Desktop */}
          {showUserInfo && (
            <div className="navbar__greeting">
              <UserGreeting 
                name={userName} 
                variant="primary"
                animated
              />
            </div>
          )}

          {/* Profile Avatar */}
          <div className="navbar__profile">
            <img src={testSvg} alt={t('user.profile')} className="navbar__avatar" />
            
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

            {/* Profile Dropdown */}
            <div className={`navbar__profile-dropdown ${isProfileOpen ? 'navbar__profile-dropdown--open' : ''}`}>
              <div className="navbar__profile-header">
                <div className="navbar__profile-info">
                  <div className="navbar__profile-name">{userName}</div>
                  <div className="navbar__profile-email">user@example.com</div>
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
      )}

      {/* Overlay for mobile menu */}
      {(isMenuOpen || isProfileOpen) && (
        <div className="navbar__overlay" onClick={closeAll}></div>
      )}
    </header>
  );
};

Navbar.propTypes = {
  variant: PropTypes.oneOf(['default', 'primary', 'minimal']),
  showUserInfo: PropTypes.bool,
  userName: PropTypes.string,
  onLogout: PropTypes.func,
  isLoggedIn: PropTypes.bool
};

export default Navbar;
