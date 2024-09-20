import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import VEGETABLES_FRUITS_ICON  from '../../resources/icon/VEGETABLES_FRUITS.png';
import MEAT_ICON  from '../../resources/icon/MEAT.png';
import FISH_SEAFOOD_ICON from '../../resources/icon/FISH_SEAFOOD.png';
import EGGS_DAIRY_ICON from '../../resources/icon/EGGS_DAIRY.png';
import SAUCES_ICON from '../../resources/icon/SAUCES.png';
import OTHERS_ICON from '../../resources/icon/OTHERS.png';
import { useNavigate } from 'react-router-dom'; 


const AllergyFoodsAdd = () => {
    const [filterCategory, setFilterCategory] = useState("VEGETABLES_FRUITS");
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedFoodName, setSelectedFoodName] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchFoodItems = async (category) => {
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + 'foods', {
            params: { page: 1, size: 700, sort: 'foodName_asc', category }, 
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          return response.data.data || []; 
        } catch (error) {
          console.error("Error fetching food items: ", error);
          return [];
        }
      };
    
      const getCategoryLabel = (category) => {
        switch (category) {
          case "VEGETABLES_FRUITS":
            return "채소 및 과일";
          case "MEAT":
            return "육류";
          case "FISH_SEAFOOD":
            return "생선 및 해산물";
          case "EGGS_DAIRY":
            return "달걀 및 유제품";
          case "SAUCES":
            return "소스류";
          case "OTHERS":
            return "기타";
          default:
            return "";
        }
      };
    
    
      const handleIconClick = (category) => {
        // 항상 데이터를 불러오도록 수정
        setFilterCategory(category);
        setSelectedFoodName(""); // 식료품 이름 초기화 ("선택하세요"로 표시됨)
      
        const updateFoodItems = async () => {
          const items = await fetchFoodItems(category);
          setFoodItems(items); 
          setFilteredItems(items); // 초기 필터링
        };
      
        updateFoodItems(); // 같은 카테고리여도 데이터를 새로 불러옴
      };
      
      // useEffect는 filterCategory가 변경될 때만 호출됩니다.
      useEffect(() => {
        const updateFoodItems = async () => {
          const items = await fetchFoodItems(filterCategory);
          setFoodItems(items); 
          setFilteredItems(items); // 초기 필터링
        };
      
        updateFoodItems(); 
      }, [filterCategory]);
      
      const handleFoodNameClick = () => {
        setIsDropdownOpen(prevState => !prevState); // 드롭다운 토글
      };  
    
      const handleFoodNameChange = (event) => {
        setSelectedFoodName(event.target.value);
        setIsDropdownOpen(false); // 아이템 선택 후 드롭다운 닫기
      };
    
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false); // 드롭다운 외부 클릭 시 닫기
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const handleFormSubmit = async () => {
    
        if (!selectedFoodName) {
          alert("식료품 이름을 입력해주세요.");
          return;
        }
    
        try {
          await axios.post(process.env.REACT_APP_API_URL + 'allergy-foods', {
            foodName: selectedFoodName, foodCategory: filterCategory, 
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          alert("알레르기 음식이 성공적으로 저장되었습니다.");
          setSelectedFoodName("");
          navigate(`/menu/allergy-foods`);
        } catch (error) {
          console.error("알레르기 음식 저장 오류:", error.response ? error.response.data : error.message);
        alert("알레르기 음식 저장에 실패했습니다.");
        }
      };
    
      return (
        <MainContainer>
          <FilterSection>
            <Label>식료품 카테고리 - {getCategoryLabel(filterCategory)} </Label>
            <FoodIcons>
              <IconButton onClick={() => handleIconClick("VEGETABLES_FRUITS")}><img src={VEGETABLES_FRUITS_ICON} alt="Vegetables and Fruits" width="40" height="40" /></IconButton>
              <IconButton onClick={() => handleIconClick("MEAT")}><img src={MEAT_ICON} alt="Meats" width="40" height="40" /></IconButton>
              <IconButton onClick={() => handleIconClick("FISH_SEAFOOD")}><img src={FISH_SEAFOOD_ICON} alt="Fishs and Seafoods" width="40" height="40" /></IconButton>
              <IconButton onClick={() => handleIconClick("EGGS_DAIRY")}><img src={EGGS_DAIRY_ICON} alt="Egges and Dairy" width="40" height="40" /></IconButton>
              <IconButton onClick={() => handleIconClick("SAUCES")}><img src={SAUCES_ICON} alt="Sauces" width="40" height="40" /></IconButton>
              <IconButton onClick={() => handleIconClick("OTHERS")}><img src={OTHERS_ICON} alt="Others" width="40" height="40" /></IconButton>
            </FoodIcons>
          </FilterSection>
          <FoodNameDropdown>
            <Label>식료품 이름</Label>
            <DropdownButton onClick={handleFoodNameClick}>
              {selectedFoodName || "식료품 이름 선택"}
            </DropdownButton>
            {isDropdownOpen && (
              <DropdownMenu ref={dropdownRef}>
                <select size="20" onChange={handleFoodNameChange} value={selectedFoodName}>
                  <option value="">선택하세요</option>
                  {filteredItems.map((item, index) => (
                    <option key={index} value={item.foodName}>{item.foodName}</option>
                  ))}
                </select>
              </DropdownMenu>
            )}
          </FoodNameDropdown>
          <InputSection>
        <UploadButton onClick={handleFormSubmit}>저장</UploadButton>
      </InputSection>
        </MainContainer>
      );
    }
export default AllergyFoodsAdd;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
   padding: 100px 0; /* 상하 여백 추가 */

`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 50px;
  margin-bottom: 20px;
  label {
    font-weight: bold; /* 글씨를 굵게 설정 */
    margin-bottom: 5px;
  }
`;

const FoodIcons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 20px;
  
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
`;


const InputSection = styled.div`
  width: 70%;
  margin-top: 20px;
  margin-bottom: 20px;
`;


const UploadButton = styled.button`
  background-color: #2D9CDB; /* 배경색을 테두리 색으로 변경 */
  color: white; /* 글씨를 하얀색으로 변경 */
  border: 2px solid #2D9CDB; /* 테두리 색은 동일하게 유지 */
  border-radius: 20px;   
  padding: 10px 20px;   
  cursor: pointer;   
  width: 100%; /* 가운데에 길게 위치 */
  margin-top: 50px;
  font-weight: bold; /* 글씨를 굵게 설정 */
  font-size: 18px; /* 글자 크기 키움 */

  &:hover {
    background-color: #e7f1ff;
  }
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 100%; /* 부모 요소의 너비를 차지하도록 설정 */
  max-width: 500px; /* 최대 너비 설정 */
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  top: 100%; /* DropdownButton 바로 아래에 위치하도록 설정 */
  left: 0; /* 부모 요소에 대해 좌측 정렬 */
  display: flex;
  flex-direction: column;

  select {
    padding: 5px; /* 옵션 간격 줄이기 */
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    max-height: 300px; /* 셀렉트 박스의 최대 높이를 제한 */
    overflow-y: auto;  /* 스크롤을 가능하게 설정 */
    font-size: 15px; /* 글자 크기 조정 (조금만 키우기) */
    line-height: 1.2; /* 줄 간격을 조정하여 글자 간격 줄이기 */
    margin: 0; /* margin이 있을 경우 간격 조정 */
  }

  /* 옵션 요소에 대한 스타일 추가 */
  select option {
    padding: 5px; /* 옵션 주위에 여백 추가 */
    line-height: 1.2; /* 줄 간격을 조정하여 글자 간격 줄이기 */
    margin: 0; /* margin이 있을 경우 간격 조정 */
    font-size: 15px; /* 글자 크기 조정 (조금만 키우기) */
    padding-left: 10px; /* 왼쪽 여백 추가 */
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 2px solid #2D9CDB;
  border-radius: 5px;
  background-color: #ffffff;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  margin-top: 10px;
`;

const FoodNameDropdown = styled.div`
  position: relative; /* DropdownMenu의 절대 위치를 부모 요소에 상대적으로 설정 */
  display: flex;
  flex-direction: column;
  width: 70%;
  margin-bottom: 20px;
`;
