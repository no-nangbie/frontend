import React from 'react';
import styled from 'styled-components';
import Search_img from '../../resources/icon/search_3917754.png'

// Data
const RecipeItems = [
  {
    id: 1,
    name: "돼지고기 김치찌개1",
    image: "image_url_1",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 2,
    name: "돼지고기 김치찌개2",
    image: "image_url_2",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 3,
    name: "돼지고기 김치찌개3",
    image: "image_url_3",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 4,
    name: "돼지고기 김치찌개4",
    image: "image_url_4",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 5,
    name: "돼지고기 김치찌개1",
    image: "image_url_1",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 6,
    name: "돼지고기 김치찌개2",
    image: "image_url_2",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 7,
    name: "돼지고기 김치찌개3",
    image: "image_url_3",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 8,
    name: "돼지고기 김치찌개4",
    image: "image_url_4",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 9,
    name: "돼지고기 김치찌개4",
    image: "image_url_4",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
  {
    id: 10,
    name: "돼지고기 김치찌개4",
    image: "image_url_4",  // 실제 이미지 URL로 교체 필요
    availableIngredients: "보유 재료 : ",  // 보유 재료 입력
    missingIngredients: "미보유 재료 : ",  // 미보유 재료 입력
  },
];

// Main Component
function Recipe() {
  return (
    <MainContainer>
      <Header>
        <InputGroup>
          <Label>메인 메뉴</Label>
            <Select>
              <option>전체</option>
              <option>채소</option>
              <option>고기</option>
            </Select>
        </InputGroup>
        <FilterSection>
          <InputGroup2_1thLine>
                <Label>식재료종류</Label>
                <Select>
                  <option>전체</option>
                  <option>채소</option>
                  <option>고기</option>
                </Select>
            </InputGroup2_1thLine>
            <InputGroup2_2thLine>
                <Label>정렬</Label>
                <Select>
                  <option>전체</option>
                  <option>날짜순</option>
                  <option>이름순</option>
                </Select>
          </InputGroup2_2thLine>
        </FilterSection>
        <SearchBar>
          <TextArea type="text" placeholder="메뉴이름 검색" />
          <SearchIcon src={Search_img} alt="search icon" /> 
        </SearchBar>
      </Header>

      <ScrollableContainer>
      {RecipeItems.map((item) => (
        <FoodItem key={item.id}>
          <FoodImage src={item.image} alt={item.name} />
          <FoodInfo>
            <FoodName>{item.name}</FoodName>
            <FoodIngredients>{item.availableIngredients}</FoodIngredients>
            <FoodIngredients>{item.missingIngredients}</FoodIngredients>
          </FoodInfo>
        </FoodItem>
      ))}
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