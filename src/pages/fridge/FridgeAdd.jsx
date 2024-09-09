import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const getFoodIcon = (category) => {
  switch (category) {
    case "VEGETABLES_FRUITS":
      return "🥬";
    case "MEAT":
      return "🥩";
    case "FISH_SEAFOOD":
      return "🐟";
    case "EGGS_DAIRY":
      return "🥚🥛";
    case "SAUCES":
      return "🍯";
    default:
      return "🍲";
  }
};

// Main Component
function My_foods() {
  const [filterCategory, setFilterCategory] = useState("VEGETABLES_FRUITS");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredItems, setFilteredItems] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedFoodName, setSelectedFoodName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [foodCategory, setFoodCategory] = useState(filterCategory);

  const fetchFoodNamesByCategory = async (category) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'foods', {
        params: { page: 1, size: 700, sort: 'foodName_asc', category }
      });
      console.log(response.data.data);
      return response.data.data || []; 
    } catch (error) {
      console.error("Error fetching food names by category: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'foods', {
          params: { page: 1, size: 700, sort: 'foodName_desc', category: filterCategory }
        });
        setFoodItems(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food items: ", error);
        setLoading(false);
      }
    };
  
    fetchFoodItems();
  }, [filterCategory]);

  useEffect(() => {
    const updateFoodNames = async () => {
        const names = await fetchFoodNamesByCategory(filterCategory);
        setFoodItems(names); 
    };

    updateFoodNames();
  }, [filterCategory]);

  useEffect(() => {
    let result = foodItems;
    if (searchKeyword) {
      result = result.filter(item => item.foodName.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    setFilteredItems(result);
  }, [searchKeyword, foodItems]);
  

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    setFoodCategory(event.target.value);
  };

  const handleFoodNameChange = (event) => {
    setSelectedFoodName(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchKeyword(searchKeyword.trim());
  };

  const handleFormSubmit = async () => {
    if (!selectedFoodName || !expirationDate) {
      alert("식료품 이름과 소비기한을 입력해주세요.");
      return;
    }

    try {
      await axios.post(process.env.REACT_APP_API_URL + 'my_foods', {
        foodName: selectedFoodName, expirationDate, memo, foodCategory
      });
      alert("보유 식재료가 성공적으로 저장되었습니다.");
      setSelectedFoodName("");
      setExpirationDate("");
      setMemo("");
      setFoodCategory(filterCategory);
    } catch (error) {
      console.error("Error saving food item :", error);
      alert("보유 식재료 저장에 실패했습니다.");
    }
  }

  return (
    <MainContainer>
      <Header>
        <ActionButtons>
          <ActionButton>바코드 & 사진으로 추가</ActionButton>
          <ActionButton>직접 입력</ActionButton>
        </ActionButtons>
      </Header>
      <FilterSection>
        <FoodIcons>
          <IconButton onClick={() => setFilterCategory("VEGETABLES_FRUITS")}>🥬</IconButton>
          <IconButton onClick={() => setFilterCategory("MEAT")}>🥩</IconButton>
          <IconButton onClick={() => setFilterCategory("FISH_SEAFOOD")}>🐟</IconButton>
          <IconButton onClick={() => setFilterCategory("EGGS_DAIRY")}>🥚🥛</IconButton>
          <IconButton onClick={() => setFilterCategory("SAUCES")}>🍯</IconButton>
          <IconButton onClick={() => setFilterCategory("OTHERS")}>🍲</IconButton>
        </FoodIcons>
        <Dropdown>
          <label>식료품 카테고리</label>
          <select onChange={handleCategoryChange} value={filterCategory}>
            <option value="VEGETABLES_FRUITS">채소 및 과일류</option>
            <option value="MEAT">육류</option>
            <option value="FISH_SEAFOOD">어류 및 해산물</option>
            <option value="EGGS_DAIRY">달걀 및 유제품</option>
            <option value="SAUCES">소스류</option>
            <option value="OTHERS">기타</option>
          </select>
        </Dropdown>
      </FilterSection>
      <FoodNameDropdown>
        <label>식료품 이름</label>
        <select onChange={handleFoodNameChange} value={selectedFoodName}>
          <option value="">선택하세요</option>
          {foodItems.length > 0 && foodItems.map((item, index) => (
            <option key={index} value={item.foodName}>{item.foodName}</option>
          ))}
        </select>
      </FoodNameDropdown>
      <InputSection>
        <Label>소비 기한</Label>
        <InputField type="text" value={expirationDate} 
        onChange={(e) => setExpirationDate(e.target.value)} placeholder="소비 기한 입력" />
        <Label>메모</Label>
        <MemoField value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모 입력" />
        <UploadButton onClick={handleFormSubmit}>올리기</UploadButton>
      </InputSection>
    </MainContainer>
  );
}

export default My_foods;
// Styled Components

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  background-color: white;
  color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
`;

const FoodIcons = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

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

const FoodNameDropdown = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #007bff;
  border-radius: 10px;
  padding: 5px;
  background-color: white;
  width: 70%;
  
  input {
    border: none;
    outline: none;
    width: 100%;
    padding: 5px;
  }
`;

const SearchIcon = styled.div`
  margin-left: 5px;
  cursor: pointer;
`;

const InputSection = styled.div`
  width: 70%;
  margin-top: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const MemoField = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const UploadButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
`;

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 10px;
  height: 100vh;
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

  &:nth-child(3n) {
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

