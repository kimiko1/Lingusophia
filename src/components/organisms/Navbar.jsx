import NavItem from '../molecules/NavItem';
// import UserGreeting from '../atoms/UserGreeting'; // ← décommente si nécessaire
import { faThLarge, faGraduationCap, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {

  return (
    <header className="navbar">
      <ul className="nav-menu">
        <NavItem icon={faThLarge} label='' href="home" />
        <NavItem icon={faGraduationCap} label="My learning" href="home" />
        <NavItem icon={faUser} label="My account" href="home" />
      </ul>

      {/* <div className="navbar__right">
        <UserGreeting name="Bastien" />
      </div> */}
    </header>
  );
};

export default Navbar;
