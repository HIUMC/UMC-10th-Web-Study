import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { UserList } from './components/UserList';
import { AdvancedExample } from './components/AdvancedExample';
import './App.css';

function App(): React.ReactElement {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="app-container">
      <Navigation currentMode={mode} onModeChange={setMode} />

      {/* 콘텐츠 */}
      {mode === 'basic' && <UserList />}
      {mode === 'advanced' && <AdvancedExample />}
    </div>
  );
}

export default App;
