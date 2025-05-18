import React from 'react';

const baseStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '16px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontSize: '20px',
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'Montserrat, sans-serif',
};

const successStyle = {
  backgroundColor: '#E2F6F2',
  color: '#00c3a3a3',
  borderLeft: '5px solid #00c3a3a3',
};

const errorStyle = {
  backgroundColor: '#fdecea',
  color: '#c62828',
  borderLeft: '5px solid #f44336',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  marginLeft: 'auto',
};

const AlertPopup = ({ message, type = 'success', onClose }) => {
  const style = {
    ...baseStyle,
    ...(type === 'success' ? successStyle : errorStyle),
  };

  return (
    <div style={style}>
      <span>{message}</span>
      <button style={closeButtonStyle} onClick={onClose}>×</button>
    </div>
  );
};

export default AlertPopup;
