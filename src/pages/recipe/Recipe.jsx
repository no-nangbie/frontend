import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Search_img from '../../resources/icon/search_3917754.png';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

// Main Component
function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainFoodCategory, setMainFoodCategory] = useState([]);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("전체"); 
  const [menuCategory, setMenuCategory] = useState("전체");
  const [sortOption, setsortOption] = useState("missingFoodsCount_asc");
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 여부

  const handleClick = (menuId) => {
    navigate(`details/${menuId}`); // 페이지 이동 처리
  };

  const fetchRecipes = async (pageNumber, reset = false) => {
    if (reset) {
      setRecipes([]); // 기존 데이터를 비웁니다.
    }
    
    setLoading(true);
    try {
      const params = { page: pageNumber, size: 20, sort: sortOption === "likeList" ? "missingFoodsCount_asc" : sortOption };
      const response = menuCategory === "전체"
        ? await axios.get(process.env.REACT_APP_API_URL + 'menus/all', {
            params,
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          })
        : await axios.get(process.env.REACT_APP_API_URL + 'menus', {
            params: { ...params, menuCategory: handleGetMenuCategory(menuCategory) },
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });
  
      let menuList = response.data.data;
  
      if (sortOption === "likeList") {
        menuList = menuList.filter(menu => menu.likeCheck === "T");
      }
  
     // 메인 식재료를 기반으로 필터링 추가
    const filteredMenuList = selectedFoodCategory !== "전체" && selectedFoodCategory.length > 0
      ? menuList.filter(menu => {
          console.log("menu.foodMenuQuantityList 확인:", menu.foodMenuQuantityList); // 여기서 값 확인
          return menu.foodMenuQuantityList.some(food => food.foodId === parseInt(selectedFoodCategory));
        })
      : menuList;

     console.warn("메인식재료 확인: ", selectedFoodCategory);
     console.warn("filteredMenuList 확인 :", filteredMenuList);

     console.warn("menuList 확인 : ", menuList);



      // missingFoodsCount 또는 menuLikeCount 정렬 적용
      if (sortOption === "menuLikeCount_desc") {
        filteredMenuList.sort((a, b) => b.menuLikeCount - a.menuLikeCount);
      } else if (sortOption === "menuLikeCount_asc") {
        filteredMenuList.sort((a, b) => a.menuLikeCount - b.menuLikeCount);
      } else if (sortOption === "missingFoodsCount_desc") {
        filteredMenuList.sort((a, b) => b.missingFoodsCount - a.missingFoodsCount);
      } else if (sortOption === "missingFoodsCount_asc") {
        filteredMenuList.sort((a, b) => a.missingFoodsCount - b.missingFoodsCount);
      }
  
       setRecipes(prevRecipes => {
      const uniqueRecipes = [...prevRecipes, ...menuList].reduce((acc, curr) => {
        if (!acc.some(item => item.menuId === curr.menuId)) {
          acc.push(curr);
        }
        return acc;
      }, []);
      return uniqueRecipes;
    });

    setLoading(false);
  } catch (error) {
    console.error('Error:', error);
    setError(error);
    setLoading(false);
  }
};
// 페이지를 업데이트할 때 첫 페이지에서 데이터를 새로 불러오기
const handleSortChange = (e) => {
  const value = e.target.value;
  setsortOption(value);
  setPage(1); // 페이지를 1로 초기화
};

// 페이지가 변경될 때 데이터를 불러오는 useEffect 추가
useEffect(() => {
  if (isSearching) {
    searchMenu(page); // 검색 중일 경우 검색 함수 실행
  } else {
    fetchRecipes(page); // 그 외 경우 레시피 목록 불러오기
  }
}, [page]);

  useEffect(() => {
  fetchRecipes(page, true); // 선택된 값에 따라 데이터 로드 (기존 데이터 지우고 새로 로드)
}, [selectedFoodCategory, menuCategory, sortOption]);
  

const handleFoodCategoryChange = (e) => {
  const selectedFoodName = e.target.value;
  setSelectedFoodCategory(selectedFoodName); // 여기서 foodId 값을 설정함
  setRecipes([]); // 기존 데이터를 비우고
  setPage(1); // 페이지 초기화
};

  const searchMenu = async (pageNumber) => {
    setLoading(true);
    try {
      const params = { page: pageNumber, size: 700, sort: sortOption, keyword: searchKeyword.trim() }; // keyword 추가
      const response = menuCategory === "전체"
          ? await axios.get(process.env.REACT_APP_API_URL + 'menus/search', {
            params,
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          })
          : await axios.get(process.env.REACT_APP_API_URL + 'menus/search_by_category', {
            params: { ...params, menuCategory: handleGetMenuCategory(menuCategory) },
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });
  
      const menuList = response.data.data;

      // 검색 결과를 상태에 반영
      setRecipes(menuList); // 검색된 데이터로 상태를 업데이트
      setLoading(false);
      if (menuList.length === 0) {
        // 만약 새로 가져온 음식 목록이 비어 있으면,
        // 즉, 더 이상 새로운 음식이 없으면,
        setHasMore(false); // 더 이상 음식이 없다는 것을 알려줍니다.
      }
    } catch (error) {
      console.error("Failed to fetch recipes: ", error);
      setError(error);
      setLoading(false);
    }
  };
  
  
  const getFoodName = async() => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
        params: { page: 1, size: 700, sort: "foodName_asc" },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setMainFoodCategory(response.data.data);
    } catch(error) {
    }
  };

  const handleSelectCategoryChange = (e) => {
    setMenuCategory(e.target.value);
    setRecipes([]);
    setPage(1);
  };

  const handleSearchClick = () => {
    const trimmedKeyword = searchKeyword.trim();
    setRecipes([]); // 검색할 때마다 기존 데이터를 리셋
    setPage(1); // 페이지 초기화
  
    if (trimmedKeyword === "") {
      // 검색어가 빈칸일 때, 전체 레시피 조회
      setIsSearching(false);
      fetchRecipes(1); // 1페이지부터 전체 레시피 조회
    } else {
      // 검색어가 있을 때, 검색 실행
      setIsSearching(true);
      searchMenu(1); // 검색 함수 실행
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick(); // 엔터키를 누르면 handleSearchClick 호출
    }
  };

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

  const handleScroll = () => {
    const container = document.getElementById('scrollable-container');
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      if (!loading && hasMore) {
        setPage(prevPage => {
          const newPage = prevPage + 1;
          if (searchKeyword.trim()) {
            searchMenu(newPage); 
          } else {
            fetchRecipes(newPage);
          }
          return newPage;
        });
      }
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [sortOption, menuCategory, page]);

  useEffect(() => {
    const container = document.getElementById('scrollable-container');
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    getFoodName();
  }, []);



return (
  <MainContainer>
    <Header>
      <InputGroup>
        <Label>메인 식재료</Label>
        <Select onChange={handleFoodCategoryChange}>
          <option value="">전체</option>
          {mainFoodCategory.map((food, index) => (
            <option key={food.foodId} value={food.foodId}>
              {food.foodName}
            </option>
          ))}
        </Select>
      </InputGroup>

      <FilterSection>
        <InputGroup2_1thLine>
          <Label2>메뉴 종류</Label2>
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
          <Label2>정렬</Label2>
          <Select onChange={handleSortChange} value={sortOption}>
            <option value="missingFoodsCount_asc">추천순 ▼</option>
            <option value="menuLikeCount_desc">좋아요 ▼</option>
            <option value="menuLikeCount_asc">좋아요 ▲</option>
            <option value="likeList">좋아요 목록</option>
          </Select>
        </InputGroup2_2thLine>
      </FilterSection>

      <SearchBar>
        <TextArea
          type="text"
          placeholder="메뉴이름 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress} // Enter 키 입력 감지
        />
        <SearchIcon src={Search_img} alt="search icon" onClick={handleSearchClick} />
      </SearchBar>
    </Header>

    <ScrollableContainer id="scrollable-container">
      {recipes.map((menu, index) => {
        return (
          <FoodItem key={`${menu.menuId}_${index}`} onClick={() => handleClick(menu.menuId)}>
            <FoodImage src={menu.imageUrl} alt={menu.title} />
            <FoodInfo>
              <FoodName>{menu.menuTitle}</FoodName>
              <FoodIngredients>좋아요 수  : {menu.menuLikeCount}</FoodIngredients>
              <FoodIngredients>보유 재료 : {menu.ownedFoods ? menu.ownedFoods : "없음"}</FoodIngredients>
              <FoodIngredients>미보유 재료 : {menu.missingFoods ? menu.missingFoods : "없음"}</FoodIngredients>
            </FoodInfo>
          </FoodItem>
        );
      })}
    </ScrollableContainer>
  </MainContainer>
);

}


export default Recipe;

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


const Dropdown = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  label {
    margin-right: 10px;
    font-weight: bold;
  }

  select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
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

const TextArea = styled.input`
  flex: 1;
  border: none;
  margin-left: 10px;
  font-size: 14px;
  outline: none;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #FFF;
  width: 100%;
  height: 30px; 
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

const Label2 = styled.div`
  width: 70px;
  background-color: white;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  line-height: 30px; 
  border-right: 2px solid #2D9CDB;
  border-radius: 20px 0 0 20px;
`;