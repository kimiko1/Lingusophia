import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from '@atoms';
import './StatsCard.scss';

/**
 * StatsCard component - Carte de statistiques pour le dashboard admin
 * @param {Object} props - Component props
 * @param {string} props.title - Titre de la statistique
 * @param {number|string} props.value - Valeur de la statistique
 * @param {Object} props.icon - Icône FontAwesome
 * @param {string} props.color - Couleur du thème (blue, green, purple, orange, red)
 * @param {string} props.trend - Tendance (ex: "+12%", "-3%")
 * @param {string} props.className - Classes CSS additionnelles
 */
const StatsCard = ({ 
  title,
  value,
  icon,
  color = 'blue',
  trend,
  className = '',
  ...props
}) => {
  const { t } = useTranslation('common');
  const cardClasses = [
    'stats-card',
    `stats-card--${color}`,
    className
  ].filter(Boolean).join(' ');

  const isPositiveTrend = trend && trend.startsWith('+');
  const isNegativeTrend = trend && trend.startsWith('-');

  return (
    <Card className={cardClasses} {...props}>
      <div className="stats-card__content">
        <div className="stats-card__header">
          <div className="stats-card__info">
            <h3 className="stats-card__title">{title}</h3>
            <div className="stats-card__value">{value.toLocaleString()}</div>
          </div>
          <div className="stats-card__icon">
            <FontAwesomeIcon icon={icon} />
          </div>
        </div>
        
        {trend && (
          <div className="stats-card__footer">
            <span 
              className={`stats-card__trend ${
                isPositiveTrend ? 'stats-card__trend--positive' : 
                isNegativeTrend ? 'stats-card__trend--negative' : ''
              }`}
            >
              {trend}
            </span>
            <span className="stats-card__trend-label">{t('comparedToLastMonth')}</span>
          </div>
        )}
      </div>
      
      <div className="stats-card__background">
        <div className="stats-card__pattern"></div>
      </div>
    </Card>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red']),
  trend: PropTypes.string,
  className: PropTypes.string
};

export default StatsCard;
