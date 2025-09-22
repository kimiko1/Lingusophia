import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.scss';

/**
 * Modal component - A reusable modal dialog
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal should close
 * @param {React.Node} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {string} props.size - Modal size variant
 * @param {string} props.variant - Modal style variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.closeOnOverlay - Whether clicking overlay closes modal
 * @param {boolean} props.closeOnEscape - Whether escape key closes modal
 * @param {boolean} props.showCloseButton - Whether to show close button
 * @param {string} props.closeButtonLabel - Aria label for close button
 */
const Modal = ({ 
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  variant = 'default',
  className = '',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeButtonLabel = 'Close modal',
  ...props
}) => {
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus trap - focus on modal when opened
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const modalClasses = [
    'modal',
    `modal--${size}`,
    `modal--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Utilise React Portal pour rendre le modal à la racine du body
  return ReactDOM.createPortal(
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        className={modalClasses}
        tabIndex={-1}
        {...props}
      >
        {showCloseButton && (
          <button 
            className="modal__close" 
            onClick={onClose}
            aria-label={closeButtonLabel}
            type="button"
          >
            ×
          </button>
        )}
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
          </div>
        )}
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  variant: PropTypes.oneOf(['default', 'primary', 'warning', 'danger']),
  className: PropTypes.string,
  closeOnOverlay: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  closeButtonLabel: PropTypes.string
};

export default Modal;
