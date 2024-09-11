import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//layout
import Layout from './layout/Layout';

//login
import LoginPage from './pages/login/Login';
import SignupPage from './pages/login/signup';

//Fridge
import FridgePage from './pages/fridge/Fridge';
import FridgeAddPage from './pages/fridge/FridgeAdd';
import FridgeDeletePage from './pages/fridge/FridgeDelete';

//Recipe
import RecipePage from './pages/recipe/Recipe';
import RecipeDetailsPage from './pages/recipe/RecipeDetails';
import RecipeEditPage from './pages/recipe/RecipeEdit';
import RecipeStepPage from './pages/recipe/RecipeStep';

//board
import BoardPage from './pages/board/Board';
import BoardDetailsPage from './pages/board/BoardDetails';
import BoardEditPage from './pages/board/BoardEdit';

//menu
import MenuPage from './pages/menu/Menu';

 
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/fridge" element={<FridgePage />} />
              <Route path="/fridge/add" element={<FridgeAddPage />} />
              <Route path="/fridge/delete" element={<FridgeDeletePage />} />
              <Route path="/recipe" element={<RecipePage />} />
              <Route path="/recipe/details" element={<RecipeDetailsPage />} />
              <Route path="/recipe/details/:menuId" element={<RecipeDetailsPage />} />
              <Route path="/recipe/details/edit" element={<RecipeEditPage />} />
              <Route path="/recipe/details/step" element={<RecipeStepPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/details/:boardId" element={<BoardDetailsPage />} />
              <Route path="/board/details/edit" element={<BoardEditPage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Route>
          </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
