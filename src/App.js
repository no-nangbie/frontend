import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/login/Login';
import HomePage from './pages/fridge/Fridge';
import RecipePage from './pages/recipe/Recipe';
import RecipeDetailsPage from './pages/recipe/RecipeDetails';
import BoardPage from './pages/board/Board';
import MenuPage from './pages/menu/Menu';
 
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/fridge" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/recipe/details" element={<RecipeDetailsPage />} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
