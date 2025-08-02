import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Title } from '@atoms';
import './Calendar.scss';

/**
 * Calendar component - Interactive calendar for scheduling lessons
 * @param {Object} props - Component props
 */
const Calendar = () => {
  const { t } = useTranslation('pages');
  const { t: tCommon } = useTranslation('common');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Jours de la semaine traduits
  const daysOfWeek = t('calendar.weekdays', { returnObjects: true });
  
  // Mois traduits
  const months = t('calendar.months', { returnObjects: true });

  // Obtenir le premier jour du mois
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Obtenir le dernier jour du mois
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Obtenir le jour de la semaine du premier jour (0 = dimanche)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Nombre de jours dans le mois
  const daysInMonth = lastDayOfMonth.getDate();

  // Naviguer vers le mois précédent
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Naviguer vers le mois suivant
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Sélectionner une date
  const selectDate = (day) => {
    // Empêcher la sélection des dates passées
    if (isPastDate(day)) return;
    
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
  };

  // Vérifier si c'est aujourd'hui
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  // Vérifier si c'est la date sélectionnée
  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  // Vérifier si le jour est dans le passé
  const isPastDate = (day) => {
    const today = new Date();
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return dateToCheck < todayWithoutTime;
  };

  // Générer les cellules vides pour les jours avant le premier du mois
  const renderEmptyCells = () => {
    const cells = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    return cells;
  };

  // Générer les jours du mois
  const renderDays = () => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${isPastDate(day) ? 'past' : ''}`}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        {/* En-tête du calendrier */}
        <div className="calendar-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="nav-button"
            aria-label={t('calendar.previousMonth')}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          
          <Title 
            level={2} 
            className="calendar-title"
          >
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Title>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="nav-button"
            aria-label={t('calendar.nextMonth')}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>

        {/* Jours de la semaine */}
        <div className="calendar-weekdays">
          {daysOfWeek.map(day => (
            <div key={day} className="weekday-header">
              {day.substring(0, 3)} {/* Affiche les 3 premières lettres */}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="calendar-grid">
          {renderEmptyCells()}
          {renderDays()}
        </div>

        {/* Information sur la date sélectionnée */}
        {selectedDate && (
          <div className="selected-date-info">
            <p>
              {t('calendar.selectedDate')}: {selectedDate.toLocaleDateString(tCommon('locale'), { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <Button
              as={Link}
              to="/lesson-selection"
              variant="primary"
              className="schedule-btn"
            >
              {t('calendar.scheduleLesson')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
