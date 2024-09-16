import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import VEGETABLES_FRUITS_ICON from '../../resources/icon/VEGETABLES_FRUITS.png';
import MEAT_ICON from '../../resources/icon/MEAT.png';
import FISH_SEAFOOD_ICON from '../../resources/icon/FISH_SEAFOOD.png';
import EGGS_DAIRY_ICON from '../../resources/icon/EGGS_DAIRY.png';
import SAUCES_ICON from '../../resources/icon/SAUCES.png';
import OTHERS_ICON from '../../resources/icon/OTHERS.png';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

// Main Component
function My_foodsUpdate() {
  const [categories, setCategories] = useState([]); // 카테고리 데이터
  const [filterCategory, setFilterCategory] = useState("VEGETABLES_FRUITS");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [memo, setMemo] = useState("");
  const [selectedFoodName, setSelectedFoodName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const { memberFoodId } = useParams();
  const [foodCategory, setFoodCategory] = useState(filterCategory);
  const navigate = useNavigate();

    // 카테고리 데이터 불러오기
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(process.env.REACT_APP_API_URL + 'categories', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //         },
  //       });
  //       setCategories(response.data.data || []);
  //     } catch (error) {
  //       console.error("카테고리 가져오기 오류: ", error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);    


  // 카테고리별 식료품 이름 가져오기
  const fetchFoodNamesByCategory = async (category) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'foods', {
        params: { page: 1, size: 700, sort: 'foodName_asc', category },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error("식료품 카테고리 가져오기 오류: ", error);
      return [];
    }
  };

  // 식료품 아이템 가져오기
  useEffect(() => {
      const fetchFoodItems = async () => {
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods/' + memberFoodId, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          const foodItem = response.data.data;
    
          if (foodItem) {
            // expirationDate를 YYYYMMDD 형식에서 YYYY-MM-DD 형식으로 변환
            const formattedExpirationDate = foodItem.expirationDate
              ? `${foodItem.expirationDate.slice(0, 4)}-${foodItem.expirationDate.slice(4, 6)}-${foodItem.expirationDate.slice(6, 8)}`
              : "";
    
            setFoodItems(foodItem ? [foodItem] : []);
            setSelectedFoodName(foodItem?.foodName || "");
            setExpirationDate(formattedExpirationDate);
            setMemo(foodItem?.memo || "");
            setFilterCategory(foodItem?.foodCategory || "");
          }
          setLoading(false);
        } catch (error) {
          console.error("식료품 아이템 가져오기 오류: ", error);
          setLoading(false);
        }
      };
      fetchFoodItems();
    }, [memberFoodId]);
    

  // 카테고리가 변경될 때 이름 변경
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'foods', {
          params: { page: 1, size: 700, sort: 'foodName_desc', category: filterCategory },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
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



  // 식료품 필터링
  useEffect(() => {
    let result = foodItems;
    if (searchKeyword) {
      result = result.filter(item => item.foodName.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    setFilteredItems(result);
  }, [searchKeyword, foodItems]);

  // 식료품 이름 변경
  const handleFoodNameChange = (event) => {
    setSelectedFoodName(event.target.value);
  };

  const handleExpirationDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    setExpirationDate(formattedDate); // "YYYY-MM-DD" 형식으로 설정
  };


  // 식료품 저장
  const handleFormSubmit = async () => {

    const formattedExpirationDate = expirationDate.replace(/-/g, '');


    if (!selectedFoodName && !expirationDate) {
      alert("식료품 이름과 소비기한을 입력해주세요.");
      return;
    } else if (!expirationDate) {
      alert("식료품 소비기한을 입력해주세요.");
      return;
    } else if (!selectedFoodName) {
      alert("식료품 이름을 입력해주세요.");
      return;
    } 

    try {
      await axios.patch(process.env.REACT_APP_API_URL + 'my-foods/' + memberFoodId, {
        foodName: selectedFoodName, expirationDate: formattedExpirationDate, memo, foodCategory: filterCategory, 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      alert("보유 식재료가 성공적으로 저장되었습니다.");
      setSelectedFoodName("");
      setExpirationDate("");
      setMemo("");
      setFoodCategory(filterCategory);
      navigate(`/fridge`);
    } catch (error) {
      console.error("Error saving food item:", error);
      alert("보유 식재료 저장에 실패했습니다.");
    }
  };

  
  const getCategoryLabel = (category) => {
    switch (category) {
      case "VEGETABLES_FRUITS":
        return "채소 및 과일";
      case "MEAT":
        return "고기";
      case "FISH_SEAFOOD":
        return "생선 및 해산물";
      case "EGGS_DAIRY":
        return "계란 및 유제품";
      case "SAUCES":
        return "소스";
      case "OTHERS":
        return "기타";
      default:
        return "선택 안됨";
    }
  };

  return (
    <MainContainer>
      <Header>
        <ActionButtons>
          <ActionButton isFirst>바코드 & 사진으로 추가</ActionButton>
          <ActionButton>직접 입력</ActionButton>
        </ActionButtons>
      </Header>
      <FilterSection>
        <label>식료품 카테고리 - {getCategoryLabel(filterCategory)} </label>
        <FoodIcons>
          <IconButton onClick={() => setFilterCategory("VEGETABLES_FRUITS")}><img src={VEGETABLES_FRUITS_ICON} alt="Vegetables and Fruits" width="40" height="40" /></IconButton>
          <IconButton onClick={() => setFilterCategory("MEAT")}><img src={MEAT_ICON} alt="Meats" width="40" height="40" /></IconButton>
          <IconButton onClick={() => setFilterCategory("FISH_SEAFOOD")}><img src={FISH_SEAFOOD_ICON} alt="Fish and Seafoods" width="40" height="40" /></IconButton>
          <IconButton onClick={() => setFilterCategory("EGGS_DAIRY")}><img src={EGGS_DAIRY_ICON} alt="Eggs and Dairy" width="40" height="40" /></IconButton>
          <IconButton onClick={() => setFilterCategory("SAUCES")}><img src={SAUCES_ICON} alt="Sauces" width="40" height="40" /></IconButton>
          <IconButton onClick={() => setFilterCategory("OTHERS")}><img src={OTHERS_ICON} alt="Others" width="40" height="40" /></IconButton>
        </FoodIcons>
      </FilterSection>
      <FoodNameDropdown>
        <label>식료품 이름</label>
        <select onChange={handleFoodNameChange} value={selectedFoodName}>
          <option value="">선택하세요</option>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <option key={index} value={item.foodName}>{item.foodName}</option>
            ))
          ) : (
            <option value="">데이터가 없습니다</option>
          )}
        </select>
      </FoodNameDropdown>
      <InputSection>
      <Label>소비 기한</Label>
      <InputField type="date" value={expirationDate} onChange={handleExpirationDateChange} />
      <Label>메모</Label>
      <MemoField value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모 입력" />
      <UploadButton onClick={handleFormSubmit}>저장</UploadButton>
      </InputSection>
    </MainContainer>
  );
}

export default My_foodsUpdate;

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
  padding: 20px; /* 패딩을 늘려서 길이를 확장 */
  width: 100%;
  height: 100px; /* 원하는 높이로 설정 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 15px 15px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 105%; /* Increase width to fit larger buttons */
  max-width: 600px; /* Optional: Set a max width */
`;

const ActionButton = styled.button`
  background-color: #ffffff;
  color: black;
  border: 2px solid #2D9CDB;
  border-radius: ${props => props.isFirst ? '20px 0 0 20px' : '0 20px 20px 0'};
  padding: 10px 40px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 320px; /* 버튼의 너비를 고정 */
  height: 50px;
  font-size: 16px;
  text-align: center;
  overflow: hidden;
  font-weight: bold;
  white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
  padding-left: 15px; /* 왼쪽 여백을 추가하여 텍스트가 더 많이 보이도록 설정 */

  /* Hover effect */
  &:hover {
    background-color: #e7f1ff;
  }

  /* Remove margin between buttons */
  &:not(:last-child) {
    margin-right: 0;
  }
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
  margin-bottom: 20px;
  margin-top: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
`;

const FoodNameDropdown = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin-bottom: 20px;

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  select {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid #2D9CDB;
    width: 100%; /* 너비를 100%로 설정 */
    height: 40px; /* 드롭다운 높이 설정 */
    box-sizing: border-box; /* 패딩과 테두리를 포함하여 전체 너비 및 높이 계산 */
  }
`;  

const InputSection = styled.div`
  width: 70%;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #2D9CDB;
  border-radius: 5px;
  background-color: #ffffff;
  margin-bottom: 30px;
  margin-top: 5px;
  height: 40px; /* 입력 필드 높이 설정 */
  box-sizing: border-box; /* 패딩과 테두리를 포함하여 전체 너비 및 높이 계산 */
`;

const MemoField = styled.textarea`
  width: 100%;   
  height: 150px; // 메모 필드 크기 조정
  padding: 10px;   
  border: 2px solid #2D9CDB;   
  border-radius: 5px;   
  background-color: #ffffff;
  margin-bottom: 20px;
  margin-top: 5px;
  box-sizing: border-box; /* 패딩과 테두리를 포함하여 전체 너비 및 높이 계산 */
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
  margin-bottom: 5px;
`;