import React, { useState, useEffect } from 'react';

const baseStyles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '10px 0 20px',
    borderBottom: '2px solid rgba(0, 195, 161, 0.42)',
  },
  button: {
    background: 'transparent',
    border: 'none',
    padding: '12px 24px',
    fontSize: '26px',
    fontWeight: 500,
    color: '#333',
    cursor: 'pointer',
    borderBottom: '4px solid transparent',
    transition: 'color 0.3s ease, border-color 0.3s ease',
  },
  active: {
    color: '#00C3A1',
    borderBottom: '4px solid #00C3A1',
    fontWeight: 700,
  },
};

const TabButtons = ({ tabs, activeTab, onTabChange }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const wrapperStyle = {
    ...baseStyles.wrapper,
    gap: windowWidth <= 480 ? '0' : baseStyles.wrapper.gap,
  };

  const getButtonStyle = (isActive) => {
    let fontSize = baseStyles.button.fontSize;
    let padding = baseStyles.button.padding;

    if (windowWidth <= 480) {
      fontSize = '15px';     
      padding = '0.6rem 1rem';
    } else if (windowWidth <= 900) {
      fontSize = '22px';
      padding = '10px';
    }

    return {
      ...baseStyles.button,
      fontSize,
      padding,
      ...(isActive ? baseStyles.active : {}),
    };
  };

  return (
    <div style={wrapperStyle}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            style={getButtonStyle(isActive)}
            onClick={() => onTabChange(tab.key)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabButtons;
