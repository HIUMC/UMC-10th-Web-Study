import React from 'react';

interface NavigationProps {
  currentMode: 'basic' | 'advanced';
  onModeChange: (mode: 'basic' | 'advanced') => void;
}

export function Navigation({
  currentMode,
  onModeChange,
}: NavigationProps): React.ReactElement {
  return (
    <div
      style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '15px',
      }}
    >
      <button
        onClick={() => onModeChange('basic')}
        style={{
          padding: '12px 20px',
          backgroundColor: currentMode === 'basic' ? '#007bff' : '#e9ecef',
          color: currentMode === 'basic' ? 'white' : 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'all 0.3s ease',
        }}
      >
        📚 기본 예제
      </button>
      <button
        onClick={() => onModeChange('advanced')}
        style={{
          padding: '12px 20px',
          backgroundColor: currentMode === 'advanced' ? '#007bff' : '#e9ecef',
          color: currentMode === 'advanced' ? 'white' : 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'all 0.3s ease',
        }}
      >
        🚀 고급 예제
      </button>
    </div>
  );
}
