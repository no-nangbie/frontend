import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Search_img from '../../resources/icon/search_3917754.png'
import { useNavigate } from 'react-router-dom'; 

// Main Component
function Board() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuCategory, setMenuCategory] = useState("전체");
  const [sort, setSort] = useState("날짜 ▼");

  const navigate = useNavigate();
  const memberEmail = localStorage.getItem('email') || '';

  /**
   * F12누르면 나오는 Application에 담겨있는 localsStorage속 email 유무 판단
   * 
   * @return : 로그인 되어있는지 여부 파악을 위한 작업 중 하나
   * 
   * @Author : 신민준
   */
  useEffect(() => {
    if (memberEmail) {
      fetchBoards(handleGetMenuCategory(menuCategory),handleGetSort(sort));
    } else {
      console.error('memberEmail이 설정되지 않았습니다.');
    }
  }, [memberEmail, sort, menuCategory]);


  /**
   * Board List를 정렬 / 분류에 맞춰서 출력하는 메서드를 호출
   * 
   * @Author : 신민준
   */
  const handleSearchClick = () => {
    fetchBoards(handleGetMenuCategory(menuCategory), handleGetSort(sort));
  };


  /**
   * Board List에서 해당 게시글을 선택했을 때 Page Navigate 작업
   * 
   * @return : 해당 BoardId를 상세하게 볼 수 있는 BoardDetails.jsx로 이동
   * 
   * @Author : 신민준
   */
  const handleClick = (boardId) => {
    navigate(`details/${boardId}`); // 페이지 이동 처리
  };


  /**
   * Board ListUp 하기 위한 메서드
   * 차후 스크롤의 위치에 따라 다음 페이지를 보여주는 방식 적용 필요
   * 
   * @return : MenuType과 Sort 방식에 맞추어 1번 페이지 20개의 레시피 메뉴를 보여줌
   * 
   * @Author : 신민준
   */
  const fetchBoards = async (type,sort) => {
    setLoading(true);
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+'boards', {
        params: { type, sort, page: 1, size: 20 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setBoards(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };


  /**
   * 선택한 MenuCategory 저장 메서드
   * 
   * @return : 선택한 MenuCategory 저장
   * 
   * @Author : 신민준
   */
  const handleSelectCategoryChange = (e) => {
    setMenuCategory(e.target.value); // 사용자가 선택한 값을 상태에 저장
  };


  /**
   * 선택한 정렬방식 저장 메서드
   * 
   * @return : 선택한 정렬방식 저장
   * 
   * @Author : 신민준
   */
  const handleSelectSortChange = (e) => {
    setSort(e.target.value); // 사용자가 선택한 값을 상태에 저장
  };


  /**
   * 선택한 MenuCategory를 axios를 통해 body값에 보낼 수 있는 유효한 명칭으로 보내기 위해
   * 변환해주는 메서드
   * 
   * @return : 한글로 적힌 MenuCategory를 BE의 MenuCategory.Enum에 맞게 변환
   * 
   * @Author : 신민준
   */
  const handleGetMenuCategory = (menuCategory) => {
    switch (menuCategory) {
      case "전체":
        return "ALL";
      case "밑 반찬":
        return "MENU_CATEGORY_SIDE";
      case "국/찌개":
        return "MENU_CATEGORY_SOUP";
      case "디저트":
        return "MENU_CATEGORY_DESSERT";
      case "면":
        return "MENU_CATEGORY_NOODLE";
      case "밥/죽/떡":
        return "MENU_CATEGORY_RICE";
      case "김치":
        return "MENU_CATEGORY_KIMCHI";
      case "퓨전":
        return "MENU_CATEGORY_FUSION";
      case "양념":
        return "MENU_CATEGORY_SEASONING";
      case "양식":
        return "MENU_CATEGORY_WESTERN";
      default:
        return "MENU_CATEGORY_ETC"; 
    }
  };

  
  /**
   * 선택한 Sort를 axios를 통해 body값에 보낼 수 있는 유효한 명칭으로 보내기 위해
   * 변환해주는 메서드
   * 
   * @return : 한글로 적힌 Sort를 BE의 SortType에 맞게 변환
   * 
   * @Author : 신민준
   */
  const handleGetSort = (sort) => {
    switch (sort) {
      case "날짜 ▼":
        return "CREATED_AT_DESC";
      case "날짜 ▲":
        return "CREATED_AT_ASC";
      case "좋아요 ▼":
        return "LIKE_DESC";
      case "좋아요 ▲":
        return "LIKE_ASC";
    }
  };
  return (
    <MainContainer>
      <Header>
        <FilterSection>
          <InputGroup2_1thLine>
                <Label>메뉴 종류</Label>
                  <Select value={menuCategory} onChange={handleSelectCategoryChange}>
                    <option>전체</option>
                    <option>밑 반찬</option>
                    <option>국/찌개</option>
                    <option>디저트</option>
                    <option>면</option>
                    <option>밥/죽/떡</option>
                    <option>김치</option>
                    <option>퓨전</option>
                    <option>양념</option>
                    <option>양식</option>
                    <option>기타</option>
                  </Select>
            </InputGroup2_1thLine>
            <InputGroup2_2thLine>
                <Label>정렬</Label>
                <Select value={sort} onChange={handleSelectSortChange}>
                  <option>날짜 ▼</option>
                  <option>날짜 ▲</option>
                  <option>좋아요 ▼</option>
                  <option>좋아요 ▲</option>
                </Select>
          </InputGroup2_2thLine>
        </FilterSection>
        <SearchBar>
          <TextArea type="text" placeholder="메뉴이름 검색" />
          <SearchIcon src={Search_img} alt="search icon" onClick={handleSearchClick}/> 
        </SearchBar>
      </Header>

      <ScrollableContainer>
      {boards.map((board) => (
        <FoodItem key={board.boardId} onClick={() => handleClick(board.boardId)}>
          <FoodImage src={board.imageUrl} alt={board.title} />
          <FoodInfo>
            <FoodName>{board.title}</FoodName>
            <FoodIngredients>좋아요 수  : {board.likesCount}</FoodIngredients>
            <FoodIngredients>작성자 : {board.author}</FoodIngredients>
            <FoodIngredients>조리시간 및 음식량 : {board.cookingTime}분 / {board.servingSize}인분</FoodIngredients>
            {/* <FoodIngredients>{board.missingIngredients}</FoodIngredients> */}
          </FoodInfo>
        </FoodItem>
      ))}
      </ScrollableContainer>
    </MainContainer>
  );
}

export default Board;

// Styled Components

// ScrollableContainer 스타일 정의
const ScrollableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  height: 100%; /* Limit height of the scrollable area */
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const FoodItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin: 5px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const FoodImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 10px;
`;

const FoodInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FoodName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const FoodIngredients = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #555;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%; /* Full viewport height */
`;

const Header = styled.header`
  background-color: #D9D9D9;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 15px 15px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #2D9CDB;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  height: 30px; 
`;
const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  margin: 10px 10px;
`;

const Label = styled.div`
  width: 70px;
  background-color: white;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  line-height: 30px; 
  border-right: 2px solid #2D9CDB;
  border-radius: 20px 0 0 20px;
`;

const Select = styled.select`
  flex: 1;
  height: 100%;
  border: none;
  font-size: 13px;
  text-align: center; 
  border-radius: 0 30px 30px 0;
  outline: none;
  // appearance: none; /* 기본 드롭다운 화살표 제거 */
  background-color: transparent;
  // background-image: url('data:image/svg+xml;base64,YOUR_BASE64_ARROW'); /* 커스텀 화살표 */
  background-repeat: no-repeat;
  background-position: right 15px center; 
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝에 균등하게 배치 */
  align-items: center;
  width: 100%; /* 전체 너비 설정 */
  padding: 0 30px; /* 양쪽에 여백을 추가 */
`;

const InputGroup2_1thLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #f5f5f5;
  width: 40vh; /* 각 InputGroup의 너비 */
  height: 30px;
  justify-content: center; /* 가운데 정렬 */
  margin-right: 10px; /* 두 그룹 사이에 간격 추가 */
`;
const InputGroup2_2thLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #f5f5f5;
  width: 40vh; /* 각 InputGroup의 너비 */
  height: 30px;
  justify-content: center; /* 가운데 정렬 */
  margin-left: 10px; /* 두 그룹 사이에 간격 추가 */
`;

const TextArea = styled.input`
  flex: 1;
  border: none;
  margin-left: 10px;
  font-size: 14px;
  outline: none;
`;