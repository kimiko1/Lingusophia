import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NavLink = ({ icon, href, label }) => {
  return (
    <div>
      <div className="icon-with-label">
        <Link className="nav-link" to={href}>
          <FontAwesomeIcon icon={icon} size="2x" className="icon" />
        </Link>
      </div>
      <span>{label}</span>
    </div>
  );
};
NavLink.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default NavLink;
