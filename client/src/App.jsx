import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import PollPage from './pages/PollPage.jsx';
import CreatePage from './pages/CreatePage.jsx';
function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
         <Route path="/" element={<HomePage />} />
          <Route path="/poll/:id" element={<PollPage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
        </main>
    </Router>
  );
}

export default App;
