import React, { useState } from 'react';
import { Title, Card } from '../../01-atoms';
import './MyLessons.scss';

/**
 * MyLessons component - Displays user's completed and ongoing lessons
 * @param {Object} props - Component props
 */
const MyLessons = () => {
  // Simulation des leçons déjà prises (normalement viendraient d'une API)
  const [completedLessons] = useState([
    {
      id: 1,
      title: 'Basic Greetings',
      language: 'English',
      level: 'Beginner',
      category: 'Easy',
      completedDate: '2025-07-01',
      teacher: 'Sarah Johnson',
      progress: 100,
      grade: 'A'
    },
    {
      id: 2,
      title: 'Numbers 1-20',
      language: 'English',
      level: 'Beginner',
      category: 'Easy',
      completedDate: '2025-07-03',
      teacher: 'Sarah Johnson',
      progress: 100,
      grade: 'B+'
    },
    {
      id: 3,
      title: 'Salutations de base',
      language: 'French',
      level: 'Beginner',
      category: 'Easy',
      completedDate: '2025-07-05',
      teacher: 'Marie Dubois',
      progress: 85,
      grade: 'A-'
    },
    {
      id: 4,
      title: 'Present Tense Verbs',
      language: 'English',
      level: 'Intermediate',
      category: 'Medium',
      completedDate: '2025-07-06',
      teacher: 'John Smith',
      progress: 90,
      grade: 'A'
    },
    {
      id: 5,
      title: 'Chinese Pinyin',
      language: 'Chinese',
      level: 'Beginner',
      category: 'Hard',
      completedDate: '2025-07-10',
      teacher: 'Li Wei',
      progress: 75,
      grade: 'B'
    },
    {
      id: 6,
      title: 'Common Phrases',
      language: 'Spanish',
      level: 'Beginner',
      category: 'Easy',
      completedDate: '2025-07-12',
      teacher: 'Carlos Rodriguez',
      progress: 95,
      grade: 'A+'
    }
  ]);

  const [currentLessons] = useState([
    {
      id: 7,
      title: 'Past Tense Formation',
      language: 'English',
      level: 'Intermediate',
      category: 'Medium',
      startedDate: '2025-07-15',
      teacher: 'John Smith',
      progress: 60,
      nextSession: '2025-07-18 14:00'
    },
    {
      id: 8,
      title: 'Business French',
      language: 'French',
      level: 'Advanced',
      category: 'Hard',
      startedDate: '2025-07-14',
      teacher: 'Marie Dubois',
      progress: 40,
      nextSession: '2025-07-19 10:00'
    }
  ]);

  const getGradeColor = (grade) => {
    const gradeValue = grade.replace('+', '').replace('-', '');
    switch (gradeValue) {
      case 'A': return '#28a745';
      case 'B': return '#ffc107';
      case 'C': return '#fd7e14';
      case 'D': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="my-lessons">
      <div className="my-lessons__container">
        <Title level={1} className="page-title">
          My Lessons
        </Title>

        {/* Current Lessons Section */}
        <section className="current-lessons-section">
          <Title level={2} className="section-title">
            Current Lessons ({currentLessons.length})
          </Title>
          
          {currentLessons.length > 0 ? (
            <div className="lessons-grid">
              {currentLessons.map(lesson => (
                <Card key={lesson.id} className="lesson-card current-lesson">
                  <div className="lesson-header">
                    <Title level={3} className="lesson-title">
                      {lesson.title}
                    </Title>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(lesson.category) }}
                    >
                      {lesson.category}
                    </span>
                  </div>
                  
                  <div className="lesson-details">
                    <div className="lesson-info">
                      <span className="language">{lesson.language}</span>
                      <span className="level">{lesson.level}</span>
                      <span className="teacher">with {lesson.teacher}</span>
                    </div>
                    
                    <div className="progress-section">
                      <div className="progress-label">
                        Progress: {lesson.progress}%
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${lesson.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="next-session">
                      <strong>Next session:</strong> {formatDateTime(lesson.nextSession)}
                    </div>
                    
                    <div className="started-date">
                      Started: {formatDate(lesson.startedDate)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="empty-state">
              <p>You don't have any ongoing lessons. Start a new lesson to see it here!</p>
            </Card>
          )}
        </section>

        {/* Completed Lessons Section */}
        <section className="completed-lessons-section">
          <Title level={2} className="section-title">
            Completed Lessons ({completedLessons.length})
          </Title>
          
          <div className="lessons-grid">
            {completedLessons.map(lesson => (
              <Card key={lesson.id} className="lesson-card completed-lesson">
                <div className="lesson-header">
                  <Title level={3} className="lesson-title">
                    {lesson.title}
                  </Title>
                  <div className="badges">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(lesson.category) }}
                    >
                      {lesson.category}
                    </span>
                    <span 
                      className="grade-badge"
                      style={{ backgroundColor: getGradeColor(lesson.grade) }}
                    >
                      {lesson.grade}
                    </span>
                  </div>
                </div>
                
                <div className="lesson-details">
                  <div className="lesson-info">
                    <span className="language">{lesson.language}</span>
                    <span className="level">{lesson.level}</span>
                    <span className="teacher">with {lesson.teacher}</span>
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-label">
                      Final Score: {lesson.progress}%
                    </div>
                    <div className="progress-bar completed">
                      <div 
                        className="progress-fill"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="completed-date">
                    Completed: {formatDate(lesson.completedDate)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Summary Stats */}
        <section className="stats-section">
          <Title level={2} className="section-title">
            Learning Statistics
          </Title>
          
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-number">{completedLessons.length}</div>
              <div className="stat-label">Lessons Completed</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">{currentLessons.length}</div>
              <div className="stat-label">Ongoing Lessons</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">
                {[...new Set(completedLessons.map(l => l.language))].length}
              </div>
              <div className="stat-label">Languages Studied</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">
                {Math.round(
                  completedLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / 
                  completedLessons.length
                )}%
              </div>
              <div className="stat-label">Average Score</div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyLessons;
