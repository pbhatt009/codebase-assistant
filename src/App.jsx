import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import Home from './pages/Home';
import Workspace from './pages/Workspace';
import Score from './pages/Score';

import { Provider } from 'react-redux';
import { store } from './store/store';



function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="workspace/:repoId" element={<Workspace />} />
            <Route path="workspace/:repoId/score" element={<Score />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
