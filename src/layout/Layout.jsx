import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import menuPlus from '../resources/icon/menu_plus.png';
import menuMinus from '../resources/icon/menu_minus.png';
import boardPlus from '../resources/icon/board_plus.png';
import boardMinus from '../resources/icon/board_minus.png';
import boardFix from '../resources/icon/board_fix.png';
import board from '../resources/icon/board.png';
import menu from '../resources/icon/menu.png';
import recipe from '../resources/icon/recipe.png';
import fridge from '../resources/icon/fridge.png';
import board_on from '../resources/icon/board_on.png';
import menu_on from '../resources/icon/menu_on.png';
import recipe_on from '../resources/icon/recipe_on.png';
import fridge_on from '../resources/icon/fridge_on.png';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅 사용

  //회원가입 관련해서 완성하면은 아래 주석을 풀어주세요
  // useEffect(() => {
  //   const email = localStorage.getItem('email');
    
  //   // 이메일이 없으면 /login으로 리다이렉트
  //   if (!email) {
  //     navigate('/login');
  //   }
  // }, [navigate]);
  const hideLayout = location.pathname === '/login';

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/fridge':
        return '나의 냉장고';
      case '/recipe':
        return '레시피';
      case '/board':
        return '게시판';
      case '/menu':
        return '메뉴';
      default:
        return '나의 냉장고';
    }
  };

  const getButtonColor1 = () => {
    switch (location.pathname) {
      case '/recipe':
        return boardFix; 
      case '/board':
        return boardFix; 
    }
  };
  
  const getButtonColor2 = () => {
    switch (location.pathname) {
      case '/fridge':
        return menuMinus;
      case '/recipe':
        return boardMinus;
      case '/board':
        return boardMinus;
    }
  };

  const getButtonColor3 = () => {
    switch (location.pathname) {
      case '/fridge':
        return menuPlus; 
      case '/recipe':
        return boardPlus;
      case '/board':
        return boardPlus;
    }
  };

  return (
    <Container>
      {!hideLayout && (
        <Header>
          <Heading>{getHeaderTitle()}</Heading>
          <ButtonContainer>
            {/* /fridge 페이지에서는 2번째, 3번째 버튼만 보여야 함 */}
            {location.pathname === '/board' && (
              <ColoredButton src={getButtonColor1()} onClick={() => alert('첫 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/fridge' || location.pathname === '/board') && (
              <ColoredButton src={getButtonColor2()} onClick={() => alert('두 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/fridge' || location.pathname === '/recipe' || location.pathname === '/board') && (
              <ColoredButton src={getButtonColor3()} onClick={() => alert('세 번째 버튼 클릭됨!')} />
            )}
          </ButtonContainer>
        </Header>
      )}

      <MainContent>
        <Outlet />
      </MainContent>

      {!hideLayout && (
        <Footer>
          <Nav>
            <NavItem active={location.pathname === '/fridge'} onClick={() => navigate('/fridge')}>
              <Icon
                src={location.pathname === '/fridge' ? fridge_on : fridge} 
                alt="냉장고"
              />
              <NavText active={location.pathname === '/fridge'}>나의 냉장고</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/recipe'} onClick={() => navigate('/recipe')}>
              <Icon
                src={location.pathname === '/recipe' ? recipe_on : recipe}
                alt="레시피"
              />
              <NavText active={location.pathname === '/recipe'}>레시피</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/board'} onClick={() => navigate('/board')}>
              <Icon
                src={location.pathname === '/board' ? board_on : board}
                alt="게시판"
              />
              <NavText active={location.pathname === '/board'}>게시판</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/menu'} onClick={() => navigate('/menu')}>
              <Icon
                src={location.pathname === '/menu' ? menu_on : menu}
                alt="메뉴"
              />
              <NavText active={location.pathname === '/menu'}>메뉴</NavText>
            </NavItem>
          </Nav>
        </Footer>
      )}
    </Container>
  );
}

export default Layout;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  background-color: #2D9CDB;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: white;
  position: relative;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 18px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  gap: 10px; /* 버튼 사이 간격 */
`;

const ColoredButton = styled.img`
  width: 42px;
  height: 31.5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: block;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
`;

const Footer = styled.footer`
  background-color: #fff;
  border-top: 1px solid #ddd;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => (props.active ? '#2D9CDB' : '#888')};
  cursor: pointer;

  &:hover {
    color: #2D9CDB;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const NavText = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: ${(props) => (props.active ? '#2D9CDB' : '#888')};
`;