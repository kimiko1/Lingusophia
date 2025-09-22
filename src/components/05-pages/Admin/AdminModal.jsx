import { UserForm, LessonForm } from '@organisms';
import { Button, Modal } from '@atoms';

const AdminModal = ({
  isModalOpen,
  handleCloseModal,
  modalType,
  t,
  isLoading,
  handleConfirmDelete,
  currentItem,
  handleSaveUser,
  handleSaveLesson
}) => (
  <Modal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    title={`${modalType.includes('add') ? t('pages:admin.actions.add') : modalType.includes('edit') ? t('pages:admin.actions.edit') : modalType.includes('delete') ? t('pages:admin.actions.delete') : t('pages:admin.actions.view')} ${modalType.includes('user') ? t('pages:admin.modal.user') : modalType.includes('lesson') ? t('pages:admin.modal.lesson') : modalType.includes('booking') ? t('pages:admin.modal.booking', 'réservation') : ''}`}
    className="admin__modal"
    size={modalType.includes('delete') ? 'small' : 'large'}
  >
    <div className="admin__modal-content">
      {modalType.includes('delete') ? (
        <div className="admin__delete-confirmation">
          <p>{t('pages:admin.modal.confirmDelete')}</p>
          <div className="admin__modal-actions">
            <Button 
              variant="outline" 
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              {t('pages:admin.modal.cancel')}
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? t('pages:admin.form.deleting') : t('pages:admin.actions.delete')}
            </Button>
          </div>
        </div>
      ) : modalType.includes('user') ? (
        <UserForm
          user={currentItem}
          onSave={handleSaveUser}
          onCancel={handleCloseModal}
          isLoading={isLoading}
          mode={modalType.includes('add') ? 'create' : modalType.includes('edit') ? 'edit' : 'view'}
        />
      ) : modalType.includes('lesson') ? (
        <LessonForm
          lesson={currentItem}
          onSave={handleSaveLesson}
          onCancel={handleCloseModal}
          isLoading={isLoading}
          mode={modalType.includes('add') ? 'create' : modalType.includes('edit') ? 'edit' : 'view'}
        />
      ) : (
        <div className="admin__form-placeholder">
          <p>{t('pages:admin.modal.formPlaceholder', { type: modalType })}</p>
          <Button variant="primary" onClick={handleCloseModal}>
            {t('pages:admin.modal.close')}
          </Button>
        </div>
      )}
    </div>
  </Modal>
);

export default AdminModal;
