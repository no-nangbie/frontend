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
  

  return (
    <MainContainer>
      <ScrollableContainer>
        {loading ? (
          <div>로딩중</div>
        ) : (
          foodItems.map((item) => (
            <FoodItem key={item.id}>
            {getFoodIcon(item.foodCategory)}
                <FoodName>
                    {item.foodName}
                </FoodName>
            </FoodItem>
          ))
        )}
      </ScrollableContainer>
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
  flex-direction: column; /* 세로로 정렬 */
  width: 100%;
  height: calc(100vh - 20px); /* 뷰포트 높이에서 상단 바 및 여백을 제외한 높이 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  overflow-x: hidden;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const FoodItem = styled.div`
  display: flex; /* 수평 배치를 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 350px; /* 원하는 고정 넓이 */
  min-height: 80px; /* 고정 높이로 변경 */
  border-radius: 5px; /* 둥글기 */
  padding: 10px;
  background-color: #fff; /* 흰색으로 변경 */
  color: #000;
  border: 1px solid gray;
  box-sizing: border-box;
  margin: 5px auto; /* 수평 중앙 정렬을 위해 auto 사용 */
  position: relative; /* 아이콘 위치를 조정하기 위한 relative 위치 지정 */
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

