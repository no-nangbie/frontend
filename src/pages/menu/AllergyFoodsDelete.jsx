import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import VEGETABLES_FRUITS_ICON  from '../../resources/icon/VEGETABLES_FRUITS.png';
import MEAT_ICON  from '../../resources/icon/MEAT.png';
import FISH_SEAFOOD_ICON from '../../resources/icon/FISH_SEAFOOD.png';
import EGGS_DAIRY_ICON from '../../resources/icon/EGGS_DAIRY.png';
import SAUCES_ICON from '../../resources/icon/SAUCES.png';
import OTHERS_ICON from '../../resources/icon/OTHERS.png';
import { useNavigate } from 'react-router-dom'; 



const getFoodIcon = (category) => {
    switch (category) {
      case "VEGETABLES_FRUITS":
        return <img src={VEGETABLES_FRUITS_ICON} alt="Vegetables and Fruits" width="40" height="40" />;
      case "MEAT":
        return <img src={MEAT_ICON} alt="Meats" width="40" height="40" />;
      case "FISH_SEAFOOD":
        return <img src={FISH_SEAFOOD_ICON} alt="Fish and Seafoods" width="40" height="40" />;
      case "EGGS_DAIRY":
        return <img src={EGGS_DAIRY_ICON} alt="Eggs and Dairy" width="40" height="40" />;
      case "SAUCES":
        return <img src={SAUCES_ICON} alt="Sauces" width="40" height="40" />;
      default:
        return <img src={OTHERS_ICON} alt="Others" width="40" height="40" />;
    }
  };
  
const AllergyFoods = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();



    const fetchFoodItems = async() => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'allergy-foods', {
          params: {
            page: 1, size: 700
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
        console.error("보유한 알레르기 음식 데이터를 가져오는데 실패했습니다.", error);
        setLoading(false);
      }
    };


useEffect(() => {
     fetchFoodItems();
}, []); 

const handleItemClick = (itemId) => (event) => {
  event.stopPropagation(); // 이벤트 버블링 방지
  setSelectedItems((prevSelectedItems) => {
    if (prevSelectedItems.includes(itemId)) {
      // 이미 선택된 아이템을 클릭한 경우, 선택 해제
      return prevSelectedItems.filter(id => id !== itemId);
    } else {
      // 새로운 아이템을 클릭한 경우, 추가
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
    await axios.delete(process.env.REACT_APP_API_URL + 'allergy-foods', {
      data: selectedItems,
        headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    setFoodItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.allergyFoodIdFoodId)));
    setSelectedItems([]); // Clear selected items
    alert('선택한 알레르기 음식이 삭제되었습니다.');
    navigate(`/menu/allergy-foods`);
  } catch (error) {
    console.error("알레르기 음식 삭제 중 오류 발생", error);
    alert('알레르기 음식 삭제에 실패했습니다.');
  }
};

  return (
    <MainContainer>
       <ScrollableContainer hasNoData={foodItems.length === 0}>
        {loading ? (
          <div>로딩중</div>
        ) : foodItems.length === 0 ? (
          <NoDataMessage> 저장된 알레르기 음식이 없습니다</NoDataMessage>
        ) : (
          foodItems.map((item) => (
            <FoodItem key={item.allergyFoodId}
            isSelected={selectedItems.includes(item.allergyFoodId)}
            onClick={handleItemClick(item.allergyFoodId)}
            >
            {getFoodIcon(item.foodCategory)}
                <FoodName>
                    {item.foodName}
                </FoodName>
            </FoodItem>
          ))
        )}
      </ScrollableContainer>
      <DeleteButton onClick={handleDeleteClick}>선택한 식재료 삭제하기</DeleteButton>
    </MainContainer>
  );
}

export default AllergyFoods;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%; /* Full viewport height */
  position: relative; /* Add relative positioning */
   background-color: #f4f4f4;
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
  display: flex; /* 수평 배치를 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 350px; /* 원하는 고정 넓이 */
  height: 80px; /* 고정 높이로 변경 */
  border-radius: 5px; /* 둥글기 */
  padding: 10px;
  background-color: ${(props) => props.isSelected ? '#A0D1FB' : 'white'}; /* 선택된 경우 배경색 변경 */
  border: ${(props) => props.isSelected ? '2px solid #007BFF' : '1px solid gray'}; /* 선택된 경우 테두리 변경 */
  color: #000;
  box-sizing: border-box;
  margin: 5px auto; /* 수평 중앙 정렬을 위해 auto 사용 */
  position: relative; /* 아이콘 위치를 조정하기 위한 relative 위치 지정 */
  cursor: pointer; /* 마우스 포인터 커서 변경 */
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


const FoodName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-left: 15px; /* 아이콘과의 간격 조정 */
  align-self: center; /* 세로 중앙 정렬 */
  text-align: left;
  color: ${(props) => 
    props.memberFoodStatus === "Approaching_Expiry" ? "#FFFFFF" :
    props.memberFoodStatus === "Near_Expiry" ? "#000000" : 
    props.color || '#000'};
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