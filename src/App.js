import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//layout
import Layout from './layout/Layout';

//login
import LoginPage from './pages/login/Login';
import SignupPage from './pages/login/signup';
import LogoutButton from './pages/login/LogoutButton';  // 로그아웃 버튼 임포트

//Fridge
import FridgePage from './pages/fridge/Fridge';
import FridgeAddPage from './pages/fridge/FridgeAdd';
import FridgeUpdatePage from './pages/fridge/FridgeUpdate';
import FridgeDeletePage from './pages/fridge/FridgeDelete';

//Recipe
import RecipePage from './pages/recipe/Recipe';
import RecipeDetailsPage from './pages/recipe/RecipeDetails';
import RecipeEditPage from './pages/recipe/RecipeEdit';
import RecipeStepPage from './pages/recipe/RecipeStep';

//board
import BoardPage from './pages/board/Board';
import BoardDetailsPage from './pages/board/BoardDetails';
import BoardAddPage from './pages/board/BoardAdd';
import BoardEditPage from './pages/board/BoardEdit';

//menu
import ChangePassword from "./pages/menu/ChangePassword";
import FridgeStatistics from "./pages/menu/FridgeStatistics";
import MyPage from "./pages/menu/MyPage";
import ChangeNickname from "./pages/menu/ChangeNickname";
import AllergyFoods from "./pages/menu/AllergyFoods";
import AllergyFoodsAdd from "./pages/menu/AllergyFoodsAdd";
import AllergyFoodsDelete from "./pages/menu/AllergyFoodsDelete";
 
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/logout" element={<LogoutButton />} /> {/* 로그아웃 경로 추가 */}
              <Route path="/fridge" element={<FridgePage />} />
              <Route path="/fridge/add" element={<FridgeAddPage />} />
              <Route path="/fridge/:memberFoodId" element={<FridgeUpdatePage />} />
              <Route path="/fridge/delete" element={<FridgeDeletePage />} />
              <Route path="/recipe" element={<RecipePage />} />
              <Route path="/recipe/details" element={<RecipeDetailsPage />} />
              <Route path="/recipe/details/:menuId" element={<RecipeDetailsPage />} />
              <Route path="/recipe/details/edit" element={<RecipeEditPage />} />
              <Route path="/recipe/details/:menuId/step" element={<RecipeStepPage />} />
              {/* <Route path="/recipe/details/step" element={<RecipeStepPage />} /> */}
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/details/:boardId" element={<BoardDetailsPage />} />
              <Route path="/board/add" element={<BoardAddPage />} />
              <Route path="/board/edit/:boardId" element={<BoardEditPage />} />
              <Route path="/menu" element={<MyPage />} />
              <Route path="/menu/change-password" element={<ChangePassword />} />
              <Route path="/menu/change-nickname" element={<ChangeNickname />} />
              <Route path="/menu/statistics/1" element={<FridgeStatistics />} />
              <Route path="/menu/allergy-foods" element={<AllergyFoods/>} /> 
              <Route path="/menu/allergy-foods/add" element={<AllergyFoodsAdd/>} /> 
              <Route path="/menu/allergy-foods/delete" element={<AllergyFoodsDelete/>} /> 
            </Route>
          </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
