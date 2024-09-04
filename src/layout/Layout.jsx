
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
      const email = localStorage.getItem('email');
      
      // 이메일이 없으면 /login으로 리다이렉트
      if (!email) {
        navigate('/login');
      }
    }, [navigate]);

  const hideLayout = location.pathname === '/login';

  // 경로에 따른 헤더 제목 설정
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/home':
        return '나의 냉장고';
      case '/recipe':
        return '레시피';
      case '/board':
        return '게시판';
      case '/menu':
        return '메뉴';
      default:
        return '나의 냉장고'; // 기본값
    }
  };

  return (
    <Container>
      {!hideLayout && (
        <Header>
          <Heading>{getHeaderTitle()}</Heading> {/* 동적 헤더 제목 */}
        </Header>
      )}

      <MainContent>
        <Outlet /> {/* 여기서 각 페이지의 메인 컨텐츠가 렌더링됨 */}
      </MainContent>

      {!hideLayout && (
        <Footer>
          <Nav>
            <NavItem active={location.pathname === '/'} onClick={() => navigate('/home')}>
              <Icon src="/icons/fridge.png" alt="냉장고" />
              <NavText active={location.pathname === '/home'}>나의 냉장고</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/recipe'} onClick={() => navigate('/recipe')}>
              <Icon src="/icons/recipe.png" alt="레시피" />
              <NavText active={location.pathname === '/recipe'}>레시피</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/board'} onClick={() => navigate('/board')}>
              <Icon src="/icons/board.png" alt="게시판" />
              <NavText active={location.pathname === '/board'}>게시판</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/menu'} onClick={() => navigate('/menu')}>
              <Icon src="/icons/menu.png" alt="메뉴" />
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
  background-color: #007bff;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: white;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 18px;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #f0f0f0;
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
  color: ${(props) => (props.active ? '#007bff' : '#888')}; /* 활성화 상태에 따라 색상 변경 */
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const NavText = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: ${(props) => (props.active ? '#007bff' : '#888')}; /* 활성화 상태에 따라 텍스트 색상 변경 */
`;
