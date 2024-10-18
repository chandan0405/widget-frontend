import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserChat from './components/UserChat/UserChat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UserChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
