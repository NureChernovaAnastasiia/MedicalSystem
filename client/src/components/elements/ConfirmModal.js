import React from 'react';

const baseStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: 8,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
    fontFamily: "'Montserrat', sans-serif",
  },
  title: {
    marginBottom: 10,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  message: {
    marginBottom: 20,
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#333333',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 30,
  },
  cancelButton: {
    padding: '8px 20px',
    background: '#ccc',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '1.3rem',
    transition: 'background-color 0.2s',
  },
  cancelButtonHover: {
    background: '#b3b3b3',
  },
  confirmButton: {
    padding: '8px 20px',
    background: '#d33',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '1.3rem',
    transition: 'background-color 0.2s',
  },
  confirmButtonHover: {
    background: '#a00',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

const ConfirmModal = ({
  isOpen,
  title = 'Підтвердження',
  message = 'Ви впевнені?',
  onConfirm,
  onCancel,
  confirmText = 'Так',
  cancelText = 'Ні',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div style={baseStyles.overlay}>
      <div style={baseStyles.modal}>
        <h2 style={baseStyles.title}>{title}</h2>
        <p style={baseStyles.message}>{message}</p>
        <div style={baseStyles.buttons}>
          <button
            style={{ 
              ...baseStyles.cancelButton, 
              ...(loading ? baseStyles.disabled : {}) 
            }}
            onClick={onCancel}
            disabled={loading}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#b3b3b3'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#ccc'}
          >
            {cancelText}
          </button>
          <button
            style={{ 
              ...baseStyles.confirmButton,
              ...(loading ? baseStyles.disabled : {})
            }}
            onClick={onConfirm}
            disabled={loading}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#a00'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#d33'}
          >
            {loading ? 'Обробка...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
