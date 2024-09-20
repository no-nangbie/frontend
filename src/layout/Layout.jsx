import React, { useState,useEffect } from 'react';
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
import allergyPlus from '../resources/icon/allergy_plus.png';
import allergyMinus from '../resources/icon/allergy_minus.png';


function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState('');
  const [adminCheck, setAdminCheck] = useState(false);
  const [actionType, setActionType] = useState('');
  
  /**
   * 자식 컴포넌트로 부터 받아온 정보 저장 메서드
   * 
   * @return : board에서 작성자와 로그인계정과 동일하다면 true, 아니면 false 저장
   * 
   * @Author : 신민준
   */
  const handleBoardData = (data) => {
    setBoardData(data);
  };

  const handleButtonAction = (action) => {
    // 부모는 자식에게 action 값을 전달만 함
    setActionType(action);
    console.log(`Action 전달됨: ${action}`);
  };
  /**
   * page의 이동 및 navigate 동작 시 무조건 실행되는 useEffect
   * 
   * @return : 1. 로그인이 되어 있지 않은 상태(localStorage에 email이 없음)이라면 로그인 페이지로 강제 리다이렉트
   *              회원가입 창일 경우 리다이렉트를 하지 않음.
   *           2. 현재 접속해 있는 사용자가 admin 계정인지 확인. -> .env 파일에서 REACT_APP_ADMIN_EMAIL 과 비교
   * 
   * @Author : 신민준
   */
  useEffect(() => {
    const email = localStorage.getItem('email');
    const currentPath = location.pathname;
    if (!email && currentPath !== '/login' && currentPath !== '/signup') {
      navigate('/login');
    } else if (email && (currentPath === '/login' || currentPath === '/signup' || currentPath === '/')) {
      navigate('/fridge');
    }
    if(localStorage.getItem('email') === process.env.REACT_APP_ADMIN_EMAIL)
      setAdminCheck(true);
    else
      setAdminCheck(false);
    
  }, [location.pathname, navigate]);


  /**
   * layout 노출 컨트롤 필드값
   * 
   * @return : login 페이지나 signup 페이지 일 경우 layout노출을 하지않음.
   * 
   * @Author : 신민준
   */
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  
  /**
   * layout 상단 제목 설정
   * 
   * @return : 현재 위치한 경로에 따라 layout 상단 제목을 설정
   * 
   * @Author : 신민준
   */
  const getHeaderTitle = () => {
    if (location.pathname.includes('/board'))
      return '게시판';
    else if (location.pathname.includes('/fridge'))
      return '나의 냉장고';
    else if (location.pathname.includes('/recipe'))
      return '레시피';
    else if (location.pathname.includes('/menu'))
      return '마이페이지';
    else if (location.pathname.includes('/signup'))
      return '회원가입';
    else if (location.pathname.includes('/login'))
      return '로그인';
  };

  
  /**
   * getButtonImage 메서드들
   * 어떠한 이미지를 제공해 줄 것인지 결정하는 메서드
   * 
   * @return : 경로에 맞는 이미지 반환
   * 
   * @Author : 신민준
   */
  const getButtonImage1 = () => {
    switch (location.pathname) {
      case '/recipe':
        return boardFix; 
      default:
        if(location.pathname.includes('/board')){
          return boardFix;
        }
    }
  };
  
  const getButtonImage2 = () => {
    switch (location.pathname) {
      case '/fridge':
        return menuMinus;
      case '/recipe':
        return boardMinus;
      case '/board':
        return boardMinus;
      case '/menu/allergy-foods':
        return allergyMinus;
      default:
        if(location.pathname.includes('/board')){
          return boardMinus;
        }
    }
  };

  const getButtonImage3 = () => {
    switch (location.pathname) {
      case '/fridge':
        return menuPlus;
      case '/recipe':
        return boardPlus;
      case '/board':
        return boardPlus;
        case '/menu/allergy-foods':
        return allergyPlus;
    }
  };



  /**
   * handleButtonClick 메서드들
   * layout 상단 버튼 클릭시 어디로 navigate 시킬지 설정하는 메서드
   * 
   * @return : 버튼종류에 따른 navigate
   * 
   * @Author : 신민준
   */
  const handleButtonClick1 = () => {
    navigate('/fridge/delete');
  };

  const handleButtonClick2 = () => {
    navigate('/fridge/add');
  };

  const handleButtonClick3 = () => {
    navigate('/board/add');
  };

  const handleButtonClick4 = () => {
    navigate('/menu/allergy-foods/add');
  };

  const handleButtonClick5 = () => {
    navigate('/menu/allergy-foods/delete');
  };

  return (
    <Container>
      {!hideLayout && (
        <Header>
          <Heading>{getHeaderTitle()}</Heading>
          <ButtonContainer>
            
            {/* /fridge 페이지에서는 2번째, 3번째 버튼만 보여야 함 */}
            {(location.pathname.includes('/board/details') && boardData) && (
              <ColoredButton src={getButtonImage1()} onClick={() => handleButtonAction('edit')} />
            )}
            {(location.pathname === '/fridge') && (
              <ColoredButton src={getButtonImage2()} onClick={handleButtonClick1} />
            )}
            {(location.pathname.includes('/board/details') && boardData) && (
              <ColoredButton src={getButtonImage2()} onClick={() => handleButtonAction('delete')} />
            )}
            {(location.pathname === '/fridge') && (
              <ColoredButton src={getButtonImage3()} onClick={handleButtonClick2} />
            )}
            {(location.pathname === '/recipe' && adminCheck) && (
              <ColoredButton src={getButtonImage3()} onClick={() => alert('세 번째 버튼 클릭됨!')} />
            )}
            {(location.pathname === '/board') && (
              <ColoredButton src={getButtonImage3()} onClick={handleButtonClick3} />
            )}
             {(location.pathname === '/menu/allergy-foods') && (
              <ColoredButton src={getButtonImage2()} onClick={handleButtonClick5} icon="allergyMinus"  />
            )}
            {(location.pathname === '/menu/allergy-foods') && (
              <ColoredButton src={getButtonImage3()} onClick={handleButtonClick4} icon="allergyPlus" />
            )}
          </ButtonContainer>
        </Header>
      )}

      <MainContent>
        <Outlet context={{ actionType, setActionType,handleBoardData }} />
      </MainContent>

      {!hideLayout && (
        <Footer>
          <Nav>
            <NavItem active={location.pathname === '/fridge'} onClick={() => navigate('/fridge')}>
              <Icon
                src={location.pathname.includes('/fridge') ? fridge_on : fridge} 
                alt="냉장고"
              />
              <NavText active={location.pathname.includes('/fridge') ? 'true' : undefined}>나의 냉장고</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/recipe'} onClick={() => navigate('/recipe')}>
              <Icon
                src={location.pathname.includes('/recipe') ? recipe_on : recipe}
                alt="레시피"
              />
              <NavText active={location.pathname.includes('/recipe') ? 'true' : undefined}>레시피</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/board'} onClick={() => navigate('/board')}>
              <Icon
                src={location.pathname.includes('/board') ? board_on : board}
                alt="게시판"
              />
              <NavText active={location.pathname.includes('/board') ? 'true' : undefined}>게시판</NavText>
            </NavItem>
            <NavItem active={location.pathname === '/menu'} onClick={() => navigate('/menu')}>
              <Icon
                src={location.pathname.includes('/menu') ? menu_on : menu}
                alt="마이페이지"
              />
              <NavText active={location.pathname.includes('/menu') ? 'true' : undefined}>마이페이지</NavText>
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
  width: ${(props) => (props.icon === 'allergyPlus' ? '34px' : (props.icon === 'allergyMinus' ? '30px' : '42px'))}; // 마이너스 아이콘 크기 설정
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
  font-family:'Pretendard', sans-serif;
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
