import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import VEGETABLES_FRUITS_ICON  from '../../resources/icon/VEGETABLES_FRUITS.png';
import MEAT_ICON  from '../../resources/icon/MEAT.png';
import FISH_SEAFOOD_ICON from '../../resources/icon/FISH_SEAFOOD.png';
import EGGS_DAIRY_ICON from '../../resources/icon/EGGS_DAIRY.png';
import SAUCES_ICON from '../../resources/icon/SAUCES.png';
import OTHERS_ICON from '../../resources/icon/OTHERS.png';


const getFoodIcon = (category) => {
  switch (category) {
    case "VEGETABLES_FRUITS":
      return <img src={VEGETABLES_FRUITS_ICON} alt="Vegetables and Fruits" width="30" height="30" />; // Example icon for vegetables and fruits
    case "MEAT":
      return <img src={MEAT_ICON} alt="Meats" width="30" height="30" />; // Example icon for meat
    case "FISH_SEAFOOD":
      return  <img src={FISH_SEAFOOD_ICON} alt="Fishs and Seafoods" width="30" height="30" />;
    case "EGGS_DAIRY":
      return  <img src={EGGS_DAIRY_ICON} alt="Egges and Dairy" width="30" height="30" />;
    case "SAUCES":
      return  <img src={SAUCES_ICON} alt="Sauces" width="30" height="30" />;
    default:
      return  <img src={OTHERS_ICON} alt="Others" width="30" height="30" />; // Default icon for unknown categories
  }
};

const getStatusColor = (memberFoodStatus) => {
  switch (memberFoodStatus) {
    case "Approaching_Expiry":
      return "#FF6C6C"; // Tomato red for approaching expiry
    case "Near_Expiry":
      return "#A6A6A6"; // Light gray for near expiry
    case "Fresh":
    default:
      return "#FFFFFF"; // Light green for fresh items
  }
};

// Main Component
function Fridge() {
  const [filterCategory, setFilterCategory] = useState("전체");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("expirationDate_asc");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

    const fetchFoodItems = async() => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
          params: {
            page: 1, size: 700, sort: sortOption
          }
        });
        console.log("data : ", response.data);

        if (response.data && response.data.data) {
          setFoodItems(response.data.data);
        } else {
          console.error("예상과 다른 응답 데이터 형식:", response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("보유한 식재료 데이터를 가져오는데 실패했습니다.", error);
        setLoading(false);
      }
    };

    const searchFoods = async() => {
      try {
        let response;

        if(searchKeyword.trim() === "") {
          setSortOption("expirationDate_asc");
        }

        if(filterCategory === "전체") {
          response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods/search', {
            params: {
              page: 1, size: 700,  
              sort: searchKeyword.trim() === "" ? "expirationDate_asc" : sortOption, keyword: searchKeyword.trim(),
            }, 
        });
        } else {
          response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods/search_by_category', {
          params: {
            page: 1, size: 700,  sort: searchKeyword.trim() === "" ? "expirationDate_asc" : sortOption,
            category: filterCategory, keyword: searchKeyword.trim(),
          },
      });
    }

      if (response !== undefined) {
        setFoodItems(response.data.data);
      } else {
        console.error("예상과 다른 응답 데이터 형식 : ", response.data);
      }
      setLoading(false);
      } catch (error) {
        console.error("검색된 식재료 데이터를 가져오는데 실패했습니다." , error);
        setLoading(false);
      }
    };

 useEffect(() => {
    fetchFoodItems();
  }, [sortOption]);

  const handleSearchClick = () => {
    if (searchKeyword.trim() === "") {
      setSortOption("expirationDate_asc")
    }
    setIsSearching(true);
    searchFoods();
    setSearchKeyword("");
  }

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  
  const filteredItems = filterCategory === '전체'? foodItems : foodItems.filter(item => item.foodCategory === filterCategory);


  return (
    <MainContainer>
      <Header>
        <FilterSection>
          <InputGroup2_1thLine>
            <Label>식재료종류</Label>
            <Select onChange={handleCategoryChange}>
              <option value="전체">전체</option>
              <option value="VEGETABLES_FRUITS">채소 및 과일류</option>
              <option value="MEAT">육류</option>
              <option value="FISH_SEAFOOD">어류 및 해산물</option>
              <option value="EGGS_DAIRY">달걀 및 유제품</option>
              <option value="SAUCES">소스류</option>
              <option value="OTHERS">기타</option>
            </Select>
          </InputGroup2_1thLine>
          <InputGroup2_2thLine>
            <Label>정렬</Label>
            <Select onChange={handleSortChange} value={sortOption}>
              <option value="expirationDate_asc">소비기한 빠른 순</option>
              <option value="expirationDate_desc">소비기한 느린 순</option>
              <option value="memberFoodId_desc">최근 추가 순</option>
              <option value="memberFoodId_asc">과거 등록 순</option>
            </Select>
          </InputGroup2_2thLine>
        </FilterSection>
        <SearchBar>
          <input type="text" placeholder="검색" 
          value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
          <SearchIcon onClick={handleSearchClick}>🔍</SearchIcon>
        </SearchBar>
      </Header>

      <ScrollableContainer>
        {loading ? (
          <div>로딩중</div>
        ) : (
          filteredItems.map((item) => (
          <FoodItem key={item.id} color={getStatusColor(item.memberFoodStatus)}>
            <FoodIcon>{getFoodIcon(item.foodCategory)}</FoodIcon>
            <FoodName>{item.foodName}</FoodName>
            <FoodMemo>{item.memo}</FoodMemo>
            <FoodDate>{item.expirationDate}</FoodDate>
          </FoodItem>
        ))
        )}
      </ScrollableContainer>
    </MainContainer>
  );
}

export default Fridge;

// Styled Components

// Styled Components

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
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
  padding: 0 20px;
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
  padding-right: 30px; 
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #2D9CDB; /* Same color as dropdown border */
  border-radius: 10px;
  padding: 5px;
  background-color: white;
  width: 70%;
  
  input {
    border: none; /* 검색 입력 칸 테두리 제거 */
    outline: none; /* 선택 시 생기는 기본 아웃라인 제거 */
    width: 100%; /* 전체 공간 채우기 */
    padding: 5px;
  }
`;

const SearchIcon = styled.div`
  margin-left: 5px;
`;

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  height: 100vh; /* Limit height of the scrollable area */
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const FoodItem = styled.div`
  display: inline-block;
  margin: 10px;
  text-align: center;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) => props.color};
  color: #000;
  border: 1px solid gray;

  &:nth-child(3n) { /* 각 세 번째 아이템의 마진을 0으로 설정 */
    margin-right: 0;
  }
`;

const FoodIcon = styled.div`
  font-size: 30px;
`;

const FoodName = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

const FoodMemo = styled.div`
  font-size: 12px;
  margin-top: 3px;
`;

const FoodDate = styled.div`
  font-size: 10px;
  margin-top: 5px;
`;
