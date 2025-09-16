import { useState } from 'react';
import { Card, Input, Button, Modal } from '@atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSearch, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@molecules';
import { LessonForm } from '@organisms';
import { lessonService, userService } from '@services';

const LessonsAdminTab = ({ lessons, setLessons, isLoading, setIsLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);

  // Colonnes pour la table des leçons
  const lessonColumns = [
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'language', label: 'Langue', sortable: true },
    { key: 'level', label: 'Niveau', sortable: true },
    { key: 'price', label: 'Prix', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  // Actions CRUD
  const handleEdit = (item) => {
    setCurrentItem(item);
    setModalType('edit-lesson');
    setIsModalOpen(true);
  };
  const handleDelete = (item) => {
    setCurrentItem(item);
    setModalType('delete-lesson');
    setIsModalOpen(true);
  };
  const handleAddNew = () => {
    setCurrentItem(null);
    setModalType('add-lesson');
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    }
  };
  // Sauvegarder une leçon (création ou modification) via API
  const handleSaveLesson = async (lessonData) => {
    setIsLoading(true);
    try {
      if (modalType === 'add-lesson') {
        await lessonService.createLesson(lessonData);
      } else if (modalType === 'edit-lesson') {
        await lessonService.updateLesson(lessonData.id, lessonData);
      }
      // Recharge les leçons après action
      const allData = await userService.getAllUsers();
      setLessons(allData.lessons || []);
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Supprimer une leçon via API
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await lessonService.deleteLesson(currentItem.id);
      setLessons(prev => prev.filter(lesson => lesson.id !== currentItem.id));
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType('');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Rendu des actions pour la table
  const renderActions = (lesson) => (
    <div className="admin__actions">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentItem(lesson) || setModalType('view-lesson') || setIsModalOpen(true)}
        className="admin__action-btn admin__action-btn--view"
      >
        <FontAwesomeIcon icon={faEye} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(lesson)}
        className="admin__action-btn admin__action-btn--edit"
      >
        <FontAwesomeIcon icon={faEdit} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(lesson)}
        className="admin__action-btn admin__action-btn--delete"
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
  // Normalisation des leçons pour la table
  let lessonsArray = [];
  if (Array.isArray(lessons)) {
    lessonsArray = lessons;
  } else if (lessons && typeof lessons === 'object') {
    if (Array.isArray(lessons.lessons)) {
      lessonsArray = lessons.lessons;
    } else if (lessons.data && Array.isArray(lessons.data.lessons)) {
      lessonsArray = lessons.data.lessons;
    }
  }
  const lessonsWithActions = lessonsArray.map(lesson => ({
    ...lesson,
    language: lesson.language && typeof lesson.language === 'object' ? lesson.language.name : lesson.language,
    actions: renderActions(lesson)
  }));

  return (
    <div className="admin__lessons">
      <div className="admin__section-header">
        <div className="admin__search-filter">
          <Input
            type="text"
            placeholder="Rechercher une leçon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin__search-input"
            icon={faSearch}
          />
          <Button variant="outline" className="admin__filter-btn">
            <FontAwesomeIcon icon={faFilter} />
            Filtrer
          </Button>
        </div>
        <Button 
          variant="primary"
          onClick={handleAddNew}
          className="admin__add-btn"
        >
          <FontAwesomeIcon icon={faPlus} />
          Ajouter une leçon
        </Button>
      </div>
      <Card className="admin__table-card">
        <DataTable
          columns={lessonColumns}
          data={lessonsWithActions}
          searchTerm={searchTerm}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          className="admin__data-table"
        />
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${modalType.includes('add') ? 'Ajouter' : modalType.includes('edit') ? 'Éditer' : modalType.includes('delete') ? 'Supprimer' : 'Voir'} une leçon`}
        className="admin__modal"
        size={modalType.includes('delete') ? 'small' : 'large'}
      >
        <div className="admin__modal-content">
          {modalType.includes('delete') ? (
            <div className="admin__delete-confirmation">
              <p>Confirmer la suppression ?</p>
              <div className="admin__modal-actions">
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </div>
          ) : (
            <LessonForm
              lesson={currentItem}
              onSave={handleSaveLesson}
              onCancel={handleCloseModal}
              isLoading={isLoading}
              mode={modalType.includes('add') ? 'create' : modalType.includes('edit') ? 'edit' : 'view'}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LessonsAdminTab;
