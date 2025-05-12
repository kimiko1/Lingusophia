import NavLink from '../atoms/NavLink';
import PropTypes from 'prop-types';

const NavItem = ({ icon, label, href }) => {
  return (
    <li className="nav-item">
      <NavLink icon={icon} label={label} href={href} />
    </li>
  );
};

NavItem.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

export default NavItem;
