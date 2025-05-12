import {
  faUser,
  faClock,
  faGraduationCap,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navigations = () => {
  return (
    <div className="navigations">
      <div className="block">
        <div className="item-block orange">
          <a href="/home" className="block-link">
            <div className="block-icon">
              <FontAwesomeIcon icon={faClock} size="2x" className="icon" />
            </div>
            <span>Schedule a lesson</span>
          </a>
        </div>
        <div className="item-block pink">
          <a href="/home" className="block-link">
            <div className="block-icon">
              <FontAwesomeIcon icon={faComments} size="2x" className="icon" />
            </div>
            <div>

            <span>Customers reviews</span>
            </div>
          </a>
        </div>
      </div>
      <div className="block">
        <div className="item-block green">
          <a href="/home" className="block-link">
          <div className="block-icon">
            <FontAwesomeIcon
              icon={faGraduationCap}
              size="2x"
              className="icon"
            />
            </div>
            <span>My learning</span>
          </a>
        </div>
        <div className="item-block blue">
          <a href="/home" className="block-link">
          <div className="block-icon">
            <FontAwesomeIcon icon={faUser} size="2x" className="icon" />
            </div>
            <span>Contact a teacher</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navigations;
