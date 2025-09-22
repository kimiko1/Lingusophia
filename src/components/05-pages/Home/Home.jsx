import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Navigations } from "@organisms";
import { ReviewSlider } from "@molecules";
import { Title } from "@atoms";
import "./Home.scss";

/**
 * Home component - Main dashboard/landing page
 * @param {Object} props - Component props
 * @param {string} props.variant - Page style variant
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.user - User data for personalization
 */
const Home = ({ variant = "default", className = "", ...props }) => {
  const { t } = useTranslation("pages");

  const homeClasses = ["home-page", `home-page--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={homeClasses} {...props}>
      <div className="home-page__container">
        {/* Hero Section */}
        <section className="home-page__hero">
          <div className="home-page__hero-content">
            <Title level={1} className="home-page__hero-title">
              {t("home.title")}
            </Title>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="home-page__navigation">
          <div className="home-page__section-header">
            <p className="home-page__section-description">
              {t("home.description")}
            </p>
          </div>
          <Navigations />
        </section>
        {/* Reviews Section */}
        <section className="home-page__reviews">
          <div className="home-page__section-header">
            <Title level={2} className="home-page__section-title">
              {t("home.reviews.title")}
            </Title>
            <p className="home-page__section-description">
              {t("home.reviews.description")}
            </p>
          </div>
          <ReviewSlider autoPlay={true} autoPlayInterval={6000} />
        </section>
      </div>
    </div>
  );
};

Home.propTypes = {
  variant: PropTypes.oneOf(["default", "minimal", "featured"]),
  className: PropTypes.string,
  user: PropTypes.object,
};

export default Home;
