import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
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
  
  // 로그아웃 핸들러 함수
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      console.log("11")
      if (!accessToken) {
        alert('로그인 상태가 아닙니다.');
        navigate('/login');
        return;
      }

      console.log("11")
      await axios.post('http://localhost:8080/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log("11")
      // 로그아웃 성공 시 토큰 및 이메일 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');
      console.log("11")
      // 로그인 페이지로 리다이렉트
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error.response?.data || error.message);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // useEffect 관련 코드 주석
  useEffect(() => {
    const email = localStorage.getItem('email');
    const currentPath = location.pathname;
    if (!email && currentPath !== '/login' && currentPath !== '/signup') {
      navigate('/login');
    } else if (email && (currentPath === '/login' || currentPath === '/signup' || currentPath === '/')) {
      navigate('/fridge');
    }
  }, [location.pathname, navigate]);

  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  const getHeaderTitle = () => {
    if (location.pathname.includes('/board'))
      return '게시판';
    else if (location.pathname.includes('/fridge'))
      return '나의 냉장고';
    else if (location.pathname.includes('/recipe'))
      return '레시피';
    else if (location.pathname.includes('/menu'))
      return '메뉴';
    else if (location.pathname.includes('/signup'))
      return '회원가입';
    else if (location.pathname.includes('/login'))
      return '로그인';
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

  const handleButtonClick2 = () => {
    navigate('/fridge/delete');
  };

  const handleButtonClick3 = () => {
    navigate('/fridge/add');
  };
  const handleboardClick3 = () => {
    navigate('/board/details/edit');
  };

  return (
    <Container>
      {!hideLayout && (
        <Header>
          <Heading>{getHeaderTitle()}</Heading>
          <ButtonContainer>
            {/* 로그아웃 버튼 추가 */}
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            {/* /fridge 페이지에서는 2번째, 3번째 버튼만 보여야 함 */}
            {location.pathname === '/board' && (
              <ColoredButton src={getButtonColor1()} onClick={() => alert('첫 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/fridge') && (
              <ColoredButton src={getButtonColor2()} onClick={handleButtonClick2} />
            )}
            {(location.pathname === '/board') && (
              <ColoredButton src={getButtonColor2()} onClick={() => alert('두 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/fridge') && (
              <ColoredButton src={getButtonColor3()} onClick={handleButtonClick3} />
            )}
            {(location.pathname === '/recipe') && (
              <ColoredButton src={getButtonColor3()} onClick={() => alert('세 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/board') && (
              <ColoredButton src={getButtonColor3()} onClick={handleboardClick3} />
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
              <NavText active={location.pathname === '/fridge' ? 'true' : undefined}>나의 냉장고</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/recipe'} onClick={() => navigate('/recipe')}>
              <Icon
                src={location.pathname === '/recipe' ? recipe_on : recipe}
                alt="레시피"
              />
              <NavText active={location.pathname === '/recipe' ? 'true' : undefined}>레시피</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/board'} onClick={() => navigate('/board')}>
              <Icon
                src={location.pathname === '/board' ? board_on : board}
                alt="게시판"
              />
              <NavText active={location.pathname === '/board' ? 'true' : undefined}>게시판</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/menu'} onClick={() => navigate('/menu')}>
              <Icon
                src={location.pathname === '/menu' ? menu_on : menu}
                alt="메뉴"
              />
              <NavText active={location.pathname === '/menu' ? 'true' : undefined}>메뉴</NavText>
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

const LogoutButton = styled.button`
  background-color: #FF6347;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #FF4500;
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
