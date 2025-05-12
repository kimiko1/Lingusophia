import PropTypes from "prop-types";

const UserGreeting = ({ name }) => {
    return (
        <div className="user-greeting">
            Hi {name} 👋
        </div>
    );
};

UserGreeting.propTypes = {
    name: PropTypes.string.isRequired,
};

export default UserGreeting;