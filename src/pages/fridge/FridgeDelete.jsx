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
      return <img src={VEGETABLES_FRUITS_ICON} alt="Vegetables and Fruits" width="40" height="40" />; // Example icon for vegetables and fruits
    case "MEAT":
      return <img src={MEAT_ICON} alt="Meats" width="40" height="40" />; // Example icon for meat
    case "FISH_SEAFOOD":
      return  <img src={FISH_SEAFOOD_ICON} alt="Fishs and Seafoods" width="40" height="40" />;
    case "EGGS_DAIRY":
      return  <img src={EGGS_DAIRY_ICON} alt="Egges and Dairy" width="40" height="40" />;
    case "SAUCES":
      return  <img src={SAUCES_ICON} alt="Sauces" width="40" height="40" />;
    default:
      return  <img src={OTHERS_ICON} alt="Others" width="40" height="40" />; // Default icon for unknown categories
  }
};

const getStatusColor = (memberFoodStatus) => {
  switch (memberFoodStatus) {
    case "Approaching_Expiry":
      return "#bd0a04"; // Tomato red for approaching expiry
    case "Near_Expiry":
      return "#A6A6A6"; // Light gray for near expiry
    case "Fresh":
    default:
      return "#FFFFFF"; // Light green for fresh items
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "VEGETABLES_FRUITS":
      return "#4CAF50"; // Green
    case "MEAT":
      return "#F44336"; // Red
    case "FISH_SEAFOOD":
      return "#FF9800"; // Orange
    case "EGGS_DAIRY":
      return "#03A9F4"; // Sky Blue
    case "SAUCES":
      return "#795548"; // Brown
    default:
      return "#9C27B0"; // Purple for others
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

  const formatDate = (dateString) => {
    
    // yyyyMMdd 형식을 yyyy-MM-dd 형식으로 변환
    const formattedDateString = `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
    
    // 변환된 문자열을 사용하여 Date 객체 생성
    const date = new Date(formattedDateString);
    
    if (isNaN(date.getTime())) {
      console.error("Invalid Date format:", formattedDateString);
      return "Invalid Date";
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 포맷팅
    const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 포맷팅
    
    return `${year}-${month}-${day}`;
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
          filteredItems.map((item) => (
            <FoodItem key={item.id} color={getStatusColor(item.memberFoodStatus)}
            isSelected={selectedItems.includes(item.memberFoodId)}
            onClick={handleItemClick(item.memberFoodId)}
            >
              <FoodIcon>{getFoodIcon(item.foodCategory)}</FoodIcon>
              <FoodName color={getCategoryColor(item.foodCategory)} memberFoodStatus={item.memberFoodStatus}>{item.foodName}</FoodName>
              {item.memo ? (
                <FoodMemo memberFoodStatus={item.memberFoodStatus}>[{item.memo}]</FoodMemo>
              ) : null}
              <FoodDate memberFoodStatus={item.memberFoodStatus}>{formatDate(item.expirationDate)}</FoodDate>
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
  height: 100%; /* Full viewport height */
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
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
  /* ScrollableContainer의 아래쪽 여백을 버튼 높이만큼 추가 */
  margin-bottom: 90px; /* 식재료 삭제 버튼과의 여백 */
`;


const FoodItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: calc(50% - 20px); /* 두 개씩 배치 */
  height: 120px;
  border-radius: 5px; /* 둥글기 */
  padding: 10px;
  background-color: ${(props) => props.isSelected ? '#A0D1FB' : props.color}; /* 선택된 경우 배경색 변경 */
  border: ${(props) => props.isSelected ? '2px solid #007BFF' : '1px solid gray'}; /* 선택된 경우 테두리 변경 */
  color: #000;
  box-sizing: border-box;
  margin: 10px;
  position: relative; /* 아이콘 위치를 조정하기 위한 relative 위치 지정 */

  &:nth-child(2n) { /* 각 두 번째 아이템에 대해 오른쪽 마진 0 설정 */
    margin-right: 0;
  }
`;

const FoodIcon = styled.div`
  position: absolute;
  right: 10px; /* 우측에서 10px 떨어진 위치 */
  top: 50%; /* 상단에서 중앙 위치 */
  transform: translateY(-50%); /* 중앙 정렬을 위한 변환 */
  font-size: 30px;
`;


const FoodName = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-top: 5px;
  align-self: flex-start;
  text-align: left;
   color: ${(props) => 
    props.memberFoodStatus === "Approaching_Expiry" ? "#FFFFFF" :
    props.memberFoodStatus === "Near_Expiry" ? "#000000" : 
    props.color || '#000'};
`;

const FoodMemo = styled.div`
  font-size: 12px;
  margin-top: 3px;
  text-align: left;
  align-self: flex-start;
  color: ${(props) => props.memberFoodStatus === "Approaching_Expiry" ? "#FFFFFF" : '#555'};
`;

const FoodDate = styled.div`
  position: absolute;
  bottom: 10px; /* 하단에서 10px 위치 */
  left: 50%; /* 수평 중앙 정렬 */
  transform: translateX(-50%); /* 수평 중앙 정렬 */
  font-size: 13px; /* 글자 크기 증가 */
  font-weight: bold; /* 글자 굵게 설정 */
  margin-top: 5px;
  letter-spacing: 1px; /* 글자 간격 */
  color: ${(props) => 
    props.memberFoodStatus === "Approaching_Expiry" ? "#FFFFFF" : '#000000'}; /* 상태에 따라 글자색 변경 */
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
  position: fixed; /* 고정 위치 설정 */
  bottom: 80px; /* 화면 하단에서 20px 떨어진 위치 */
  left: 50%; /* 화면 중앙에 위치 */
  transform: translateX(-50%); /* 화면 중앙 정렬을 위한 변환 */
  text-align: center;

  &:hover {
    background-color: #e7f1ff;
  }
`;


const NoDataMessage = styled.div`
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  height: 100%; /* 부모 요소의 높이 전체를 차지 */
  width: 100%; /* 부모 요소의 너비 전체를 차지 */
  font-size: 18px;
  color: #888; /* 회색 텍스트 색상 */
  font-weight: bold;
  text-align: center;
  position: absolute; /* 부모 요소에 상대적인 위치 지정 */
  top: 45%; /* 상단에서 50% 위치 */
  left: 50%; /* 왼쪽에서 50% 위치 */
  transform: translate(-50%, -40%); /* 중앙 정렬 및 약간 아래로 이동 */
`;