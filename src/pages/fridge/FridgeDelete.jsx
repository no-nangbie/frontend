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


function FridgeDelete() {
  const [filterCategory, setFilterCategory] = useState("전체");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("expirationDate_asc");
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchFoodItems = async() => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
        params: {
          page: 1, size: 700, sort: sortOption
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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

  useEffect(() => {
    fetchFoodItems();
  }, [sortOption]);

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  
  const filteredItems = filterCategory === '전체'? foodItems : foodItems.filter(item => item.foodCategory === filterCategory);

  const handleItemClick = (itemId) => (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter(id => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleDeleteClick = async () => {
    if (selectedItems.length === 0) {
      alert("삭제할 식재료를 선택해주세요. ");
      return;
    }

    try {
      await axios.delete(process.env.REACT_APP_API_URL + 'my-foods', {
        data: selectedItems,
          headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFoodItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.memberFoodId)));
      setSelectedItems([]); // Clear selected items
      alert('선택한 식재료가 삭제되었습니다.');
    } catch (error) {
      console.error("식재료 삭제 중 오류 발생", error);
      alert('식재료 삭제에 실패했습니다.');
    }
  };

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
      </Header>
      <ScrollableContainer hasNoData={filteredItems.length === 0}>
        {loading ? (
          <div>로딩중</div>
        ) : filteredItems.length === 0 ? (
          <NoDataMessage> 저장된 식료품이 없습니다</NoDataMessage>
        ) : (
          filteredItems.map(item => (
            <FoodItem
              key={item.memberFoodId}
              color={getStatusColor(item.memberFoodStatus)}
              onClick={handleItemClick(item.memberFoodId)}
              isSelected={selectedItems.includes(item.memberFoodId)}
            >
              <FoodIcon>{getFoodIcon(item.foodCategory)}</FoodIcon>
              <FoodName>{item.foodName}</FoodName>
              <FoodMemo>{item.memo}</FoodMemo>
              <FoodDate>{item.expirationDate}</FoodDate>
            </FoodItem>
          ))
        )}
      </ScrollableContainer>
      <DeleteButton onClick={handleDeleteClick}>선택한 식재료 삭제하기</DeleteButton>
    </MainContainer>
  );  
}

export default FridgeDelete;


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
  position: relative; /* Add relative positioning */
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

const FilterSection = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  align-items: center;
  width: 100%; /* 전체 너비 설정 */
  padding: 0 30px; /* 양쪽에 여백을 추가 */
`;

const InputGroup2_1thLine = styled.div`
  display: flex;
  align-items: center;
  margin-top : 10px;
  margin-bottom: 20px; /* 줄 간격 */
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #f5f5f5;
  width: 40vh; /* 각 InputGroup의 너비 */
  height: 30px;
  justify-content: center; /* 가운데 정렬 */
`;

const InputGroup2_2thLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 줄 간격 */
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #f5f5f5;
  width: 40vh; /* 각 InputGroup의 너비 */
  height: 30px;
  justify-content: center; /* 가운데 정렬 */
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

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 580px; /* 높이를 조정하여 DeleteButton이 보이게 함 */
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
  background-color: ${(props) => props.isSelected ? '#A0D1FB' : props.color}; /* 선택된 경우 배경색 변경 */
  color: #000;
  border: ${(props) => props.isSelected ? '2px solid #007BFF' : '1px solid gray'}; /* 선택된 경우 테두리 변경 */
  cursor: pointer;
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

const DeleteButton = styled.div`
  background-color: #2D9CDB;
  color: white;
  border: 2px solid #2D9CDB;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  width: 80%; /* 너비를 80%로 조정 */
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
  position: relative; /* z-index를 사용하기 위한 position 설정 */
  z-index: 1; /* 다른 요소보다 위에 표시 */
  text-align: center;

  &:hover {
    background-color: #e7f1ff;
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 530px;
  font-size: 18px;
  color: #888; /* 회색 텍스트 색상 */
  font-weight: bold;
  text-align: center;
  padding: 20px;
  background-color: transparent; /* 배경색을 투명하게 설정 */
  border: none; /* 테두리 제거 */
  box-shadow: none; /* 그림자 제거 */
  margin: 20px; /* 여백 추가 */
`;