import React, { useState } from 'react';
import styled from 'styled-components';

// Data
const foodItems = [
  { id: 1, name: '상추', category: '채소 및 과일류', memo: '전남상추', date: '24.08.25 ~ 24.09.01', icon: '🥬', color: '#A0A0A0' },
  { id: 2, name: '돼지고기', category: '육류', memo: '삼겹살', date: '24.08.25 ~ 24.09.02', icon: '🥩', color: '#D9534F' },
  { id: 3, name: '고등어', category: '어류 및 해산물', memo: '자반고등어', date: '24.06.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 4, name: '굴비', category: '어류 및 해산물', memo: '굴비', date: '24.08.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 5, name: '고추장', category: '소스류', memo: '멸매옴', date: '24.08.25 ~ 25.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 6, name: '김치', category: '기타', memo: '배추김치', date: '24.08.25 ~ 25.09.01', icon: '🥗', color: '#FFFFFF' },
  { id: 7, name: '고추', category: '채소 및 과일류', memo: '청양고추', date: '24.08.25 ~ 26.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 8, name: '소고기', category: '육류', memo: '채끝', date: '24.08.25 ~ 29.09.02', icon: '🥩', color: '#FFFFFF' },
  { id: 9, name: '상추', category: '채소 및 과일류', memo: '전남상추', date: '24.08.25 ~ 24.09.01', icon: '🥬', color: '#A0A0A0' },
  { id: 10, name: '돼지고기', category: '육류', memo: '삼겹살', date: '24.08.25 ~ 24.09.02', icon: '🥩', color: '#D9534F' },
  { id: 11, name: '고등어', category: '어류 및 해산물', memo: '자반고등어', date: '24.06.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 12, name: '굴비', category: '어류 및 해산물', memo: '굴비', date: '24.08.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 13, name: '고추장', category: '소스류', memo: '멸매옴', date: '24.08.25 ~ 25.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 14, name: '김치', category: '소스류', memo: '배추김치', date: '24.08.25 ~ 25.09.01', icon: '🥗', color: '#FFFFFF' },
  { id: 15, name: '고추', category: '채소 및 과일류', memo: '청양고추', date: '24.08.25 ~ 26.09.01', icon: '🌶️', color: '#FFFFFF' },
  // Add more food items as needed to test scrolling
];

// Main Component
function Fridge() {
  const [filterCategory, setFilterCategory] = useState("전체");

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const filteredItems = filterCategory === '전체'? foodItems : foodItems.filter(item => item.category === filterCategory);


  return (
    <MainContainer>
      <Header>
        <FilterSection>
          <Dropdown>
            <label>식재료 종류</label>
            <select onChange={handleCategoryChange}>
              <option value="전체">전체</option>
              <option value="채소 및 과일류">채소 및 과일류</option>
              <option value="육류">육류</option>
              <option value="어류 및 해산물">어류 및 해산물</option>
              <option value="달걀 및 유제품">달걀 및 유제품</option>
              <option value="소스류">소스류</option>
              <option value="기타">기타</option>
            </select>
          </Dropdown>
          <Dropdown>
            <label>정렬</label>
            <select>
              <option value="memberFoodId_desc">최근 추가 순</option>
              <option value="memberFoodId_asc">과거 등록 순</option>
              <option value="expirationDate_desc">소비기한 빠른 순</option>
              <option value="expirationDate_asc">소비기한 느린 순</option>
            </select>
          </Dropdown>
        </FilterSection>
        <SearchBar>
          <input type="text" placeholder="검색" />
          <SearchIcon>🔍</SearchIcon>
        </SearchBar>
      </Header>

      <ScrollableContainer>
        {filteredItems.map((item) => (
          <FoodItem key={item.id} color={item.color}>
            <FoodIcon>{item.icon}</FoodIcon>
            <FoodName>{item.name}</FoodName>
            <FoodMemo>{item.memo}</FoodMemo>
            <FoodDate>{item.date}</FoodDate>
          </FoodItem>
        ))}
      </ScrollableContainer>
    </MainContainer>
  );
}

export default Fridge;

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
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin-bottom: 10px; /* Space between dropdowns and search bar */
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
  border: 1px solid #007bff;
  border-radius: 10px;
  padding: 5px;
  background-color: white;
  width: 70%; /* Make the search bar span the same width as dropdowns */
`;

const SearchIcon = styled.div`
  margin-left: 5px;
`;

const ScrollableContainer = styled.div`
  display: ruby; /* 고정된 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
  padding: 20px;
  background-color: #f4f4f4;
  width: 100%;
  height: 100vh; /* 스크롤 가능 영역 */
  overflow-y: auto;
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

