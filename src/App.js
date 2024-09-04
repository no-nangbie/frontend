import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/login/Login';
import HomePage from './pages/home/Home';
import RecipePage from './pages/recipe/Recipe';
import BoardPage from './pages/board/Board';
import MenuPage from './pages/menu/Menu';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="recipe" element={<RecipePage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="menu" element={<MenuPage />} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
