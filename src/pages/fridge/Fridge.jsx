import React from 'react';
import styled from 'styled-components';

// Data
const foodItems = [
  { id: 1, name: '상추', category: '전남상추', date: '24.08.25 ~ 24.09.01', icon: '🥬', color: '#A0A0A0' },
  { id: 2, name: '돼지고기', category: '삼겹살', date: '24.08.25 ~ 24.09.02', icon: '🥩', color: '#D9534F' },
  { id: 3, name: '고등어', category: '자반고등어', date: '24.06.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 4, name: '굴비', category: '굴비', date: '24.08.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 5, name: '고추장', category: '멸매옴', date: '24.08.25 ~ 25.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 6, name: '김치', category: '배추김치', date: '24.08.25 ~ 25.09.01', icon: '🥗', color: '#FFFFFF' },
  { id: 7, name: '고추', category: '청양고추', date: '24.08.25 ~ 26.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 8, name: '소고기', category: '채끝', date: '24.08.25 ~ 29.09.02', icon: '🥩', color: '#FFFFFF' },
  { id: 9, name: '상추', category: '전남상추', date: '24.08.25 ~ 24.09.01', icon: '🥬', color: '#A0A0A0' },
  { id: 10, name: '돼지고기', category: '삼겹살', date: '24.08.25 ~ 24.09.02', icon: '🥩', color: '#D9534F' },
  { id: 11, name: '고등어', category: '자반고등어', date: '24.06.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 12, name: '굴비', category: '굴비', date: '24.08.25 ~ 24.09.12', icon: '🐟', color: '#FFFFFF' },
  { id: 13, name: '고추장', category: '멸매옴', date: '24.08.25 ~ 25.09.01', icon: '🌶️', color: '#FFFFFF' },
  { id: 14, name: '김치', category: '배추김치', date: '24.08.25 ~ 25.09.01', icon: '🥗', color: '#FFFFFF' },
  { id: 15, name: '고추', category: '청양고추', date: '24.08.25 ~ 26.09.01', icon: '🌶️', color: '#FFFFFF' },
  // Add more food items as needed to test scrolling
];

// Main Component
function Fridge() {
  return (
    <MainContainer>
      <Header>
        <FilterSection>
          <Dropdown>
            <label>식재료 종류</label>
            <select>
              <option>전체</option>
              <option>채소</option>
              <option>고기</option>
            </select>
          </Dropdown>
          <Dropdown>
            <label>정렬</label>
            <select>
              <option>전체</option>
              <option>날짜순</option>
              <option>이름순</option>
            </select>
          </Dropdown>
        </FilterSection>
        <SearchBar>
          <input type="text" placeholder="검색" />
          <SearchIcon>🔍</SearchIcon>
        </SearchBar>
      </Header>

      <ScrollableContainer>
        {foodItems.map((item) => (
          <FoodItem key={item.id} color={item.color}>
            <FoodIcon>{item.icon}</FoodIcon>
            <FoodName>{item.name}</FoodName>
            <FoodCategory>{item.category}</FoodCategory>
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  background-color: #f4f4f4;
  width: 100%;
  height: 100vh; /* Limit height of the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const FoodItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 10px;
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) => props.color};
  color: #000;
  border: 1px solid gray;
`;

const FoodIcon = styled.div`
  font-size: 30px;
`;

const FoodName = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

const FoodCategory = styled.div`
  font-size: 12px;
  margin-top: 3px;
`;

const FoodDate = styled.div`
  font-size: 10px;
  margin-top: 5px;
`;

