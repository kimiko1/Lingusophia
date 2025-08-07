import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { AdminNavbar } from "@organisms";
import "./AdminHeaderTemplate.scss";
import React from "react";

/**
 * AdminHeaderTemplate component - Template with admin header/navbar
 * @param {Object} props - Component props
 * @param {React.Node} props.children - Content to display below header
 * @param {Object} props.navbarProps - Props to pass to Navbar component
 * @param {string} props.variant - Template style variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fixed - Whether header should be fixed position
 */
const AdminHeaderTemplate = React.memo(
  ({
    children,
    navbarProps = {},
    variant = "default",
    className = "",
    fixed = false,
    ...props
  }) => {
    const templateClasses = [
      "header-template",
      `header-template--${variant}`,
      fixed && "header-template--fixed",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={templateClasses} {...props}>
        <div className="header-template__header">
          <AdminNavbar />
        </div>
        <main className="admin_content">
          {children}
          <Outlet />
        </main>
      </div>
    );
  }
);

AdminHeaderTemplate.propTypes = {
  children: PropTypes.node,
  navbarProps: PropTypes.object,
  variant: PropTypes.oneOf(["default", "compact", "transparent"]),
  className: PropTypes.string,
  fixed: PropTypes.bool,
};

export default AdminHeaderTemplate;
