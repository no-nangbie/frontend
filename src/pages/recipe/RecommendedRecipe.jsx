import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Search_img from '../../resources/icon/search_3917754.png';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

// Main Component
function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainFoodCategory, setMainFoodCategory] = useState([]);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("전체"); 
  const [menuCategory, setMenuCategory] = useState("전체");
  const [sortOption, setsortOption] = useState("missingFoodsCount_asc");
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 여부
  const [isModalOpen, setIsModalOpen] = useState(true); // 처음에 모달이 열려 있도록 설정
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false); // 두번째 모달
  const [recentFoods, setRecentFoods] = useState(Array(3).fill("")); // 최근 먹었던 음식 리스트
  const [fetchData, setFetchData] = useState(null);
  const [menuCategories, setMenuCategories] =  useState(""); // 자주 요리하는 음식 카테고리

 // 데이터를 가져오는 함수 정의
 const fetchStatistics = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}statistics`, {
    params: { page: 'recipe' },
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data.data; // 데이터를 반환
};

useEffect(() => {
  const getData = async () => {
    const data = await fetchStatistics();
    setFetchData(data); // fetchData 상태에 저장
  };
  getData();
}, []);


const ChangeTextToKorean = (e) => {
  switch(e){
    case "menuCategorySide":
      return "밑 반찬"
    case "menuCategorySoup":
      return "국/찌개"
    case "menuCategoryDessert":
      return "디저트"
    case "menuCategoryNoodle":
      return "면"
    case "menuCategoryRice":
      return "밥/죽/떡"
    case "menuCategoryKimchi":
      return "김치"
    case "menuCategoryFusion":
      return "퓨전"
    case "menuCategorySeasoning":
      return "양념"
    case "menuCategoryWestern":
      return "양식"
    case "menuCategoryEtc":
      return "기타"
    default:
      return e;
  }
}

// API 응답 데이터 중 "menuCategory..." 필드만 추출하여 파이 차트 데이터로 변환
const menuCategoryData = fetchData
  ? Object.entries(fetchData)
      .filter(([key, value]) => key.startsWith('menuCategory') && value > 0)
      .map(([key, value]) => {
        const name = ChangeTextToKorean(key);
        return { name, value };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 3) // 상위 3개 카테고리
  : []; // fetchData가 없을 경우 빈 배열 반환



  const Modal = ({ onClose, isSecondModal }) => {
    const [inputValues, setInputValues] = useState(Array(3).fill("")); // 3개의 입력값 상태 관리
    const [radioValues, setRadioValues] = useState(Array(3).fill("포함")); // 3개의 라디오 버튼 상태 관리

    const handleInputChange = (index, value) => {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    };
  
    const handleRadioChange = (index, value) => {
      const newRadioValues = [...radioValues];
      newRadioValues[index] = value;
      setRadioValues(newRadioValues);
    };
    
    const handleConfirm = () => {
      if (isSecondModal) {
        // 두 번째 모달의 확인 버튼 클릭 시 로직 추가
        const excludedCategories = menuCategoryData.filter((_, index) => radioValues[index] === "미포함")
          .map(item => item.name); // 체크된 카테고리 이름 가져오기

          const excludedCategoriesEnglish = excludedCategories.map(category => {
            switch (category) {
              case "밑 반찬":
                return "menuCategorySide";
              case "국/찌개":
                return "menuCategorySoup";
              case "디저트":
                return "menuCategoryDessert";
              case "면":
                return "menuCategoryNoodle";
              case "밥/죽/떡":
                return "menuCategoryRice";
              case "김치":
                return "menuCategoryKimchi";
              case "퓨전":
                return "menuCategoryFusion";
              case "양념":
                return "menuCategorySeasoning";
              case "양식":
                return "menuCategoryWestern";
              case "기타":
                return "menuCategoryEtc";
              default:
                return category;
            }
          });

         // excludedCategoriesEnglish가 2개 이상일 때 -로 연결
         const formattedExcludedCategories = excludedCategoriesEnglish.length > 1 
         ? excludedCategoriesEnglish.join('-') 
         : excludedCategoriesEnglish[0]; 
  
         // setMenuCategories에 미포함 카테고리 저장
         setMenuCategories(formattedExcludedCategories);
         fetchRecipes(1);

  
        // 콘솔에 확인
    console.log('Excluded Categories:', formattedExcludedCategories);
  
        onClose();
      } else {
        // "미포함" 체크된 음식 이름만 필터링
        const excludedFoods = inputValues.filter((_, index) => radioValues[index] === "미포함");

        // excludedFoods가 2개 이상일 때 단어 사이에 '-' 추가
        const formattedExcludedFoods = excludedFoods.length > 1 ? excludedFoods.join('-') : excludedFoods;
  
        // recentFoods 상태에 저장
        setRecentFoods(formattedExcludedFoods);
        

        console.log('Excluded Foods:', formattedExcludedFoods);
  
        // 모달 상태 업데이트
        setIsModalOpen(false);
        setIsSecondModalOpen(true);
      }
    };
    
    return (
      <ModalOverlay>
        <ModalContent>
          {!isSecondModal ? (
            <>
              <ModalText>
                최근 먹었던 음식을 입력해주세요
              </ModalText>
              <ModalText2>
                (미포함을 선택할 시 추천에서 제외됩니다.)
              </ModalText2>
              {inputValues.map((inputValue, index) => (
                <InputContainer key={index}>
                  <input
                    type="text"
                    placeholder={`음식 이름 ${index + 1}`}
                    value={inputValue}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ height: '40px' }} // 높이 조정
                  />
                  <RadioContainer>
                    <div>
                      <input
                        type="checkbox"
                        checked={radioValues[index] === "포함"}
                        onChange={() => handleRadioChange(index, "포함")}
                        id={`switch-include-${index}`}
                      />
                      <label className="switch" htmlFor={`switch-include-${index}`}>
                        <span className="slider"></span>
                      </label>
                      <span>포함</span>
  
                      <input
                        type="checkbox"
                        checked={radioValues[index] === "미포함"}
                        onChange={() => handleRadioChange(index, "미포함")}
                        id={`switch-exclude-${index}`}
                      />
                      <label className="switch" htmlFor={`switch-exclude-${index}`}>
                        <span className="slider"></span>
                      </label>
                      <span>미포함</span>
                    </div>
                  </RadioContainer>
                </InputContainer>
              ))}
            </>
          ) : (
            <>
              <ModalText>
                자주 요리하는 레시피 카테고리입니다. 
              </ModalText>
              <ModalText2>
                (미포함을 선택할 시 추천에서 제외됩니다.)
              </ModalText2>
              {menuCategoryData.map((item, index) => (
                <InputContainer key={index}>
                  <span2 style={{ height: '40px' }}>{item.name}</span2>
                  <RadioContainer>
                    <div>
                      <input
                        type="checkbox"
                        checked={radioValues[index] === "포함"}
                        onChange={() => handleRadioChange(index, "포함")}
                        id={`second-switch-include-${index}`}
                      />
                      <label className="switch" htmlFor={`second-switch-include-${index}`}>
                        <span className="slider"></span>
                      </label>
                      <span>포함</span>
  
                      <input
                        type="checkbox"
                        checked={radioValues[index] === "미포함"}
                        onChange={() => handleRadioChange(index, "미포함")}
                        id={`second-switch-exclude-${index}`}
                      />
                      <label className="switch" htmlFor={`second-switch-exclude-${index}`}>
                        <span className="slider"></span>
                      </label>
                      <span>미포함</span>
                    </div>
                  </RadioContainer>
                </InputContainer>
              ))}
            </>
          )}
          <ModalButtonContainer>
            <ModalButton onClick={handleConfirm}>확인</ModalButton>
            <ModalButton onClick={onClose}>취소</ModalButton>
          </ModalButtonContainer>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  const handleCloseFirstModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleClick = (menuId) => {
    navigate(`/recipe/details/${menuId}`); 
};

  const fetchRecipes = async (pageNumber, reset = false) => {
    if (reset) {
      setRecipes([]); // 기존 데이터를 비웁니다.
    }
    
    setLoading(true);
    try {
      const params = { page: pageNumber, size: 20, ateMenus: recentFoods,
                        menuCategories:menuCategories  }; // keyword 추가
      const response = await axios.get(process.env.REACT_APP_API_URL + 'menus/recommendations', {
            params: { ...params},
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });    
  
      let menuList = response.data.data;
  
       setRecipes(prevRecipes => {
      const uniqueRecipes = [...prevRecipes, ...menuList].reduce((acc, curr) => {
        if (!acc.some(item => item.menuId === curr.menuId)) {
          acc.push(curr);
        }
        return acc;
      }, []);
      return uniqueRecipes;
    });

    setLoading(false);
  } catch (error) {
    console.error('Error:', error);
    setError(error);
    setLoading(false);
  }
};
// 페이지를 업데이트할 때 첫 페이지에서 데이터를 새로 불러오기
const handleSortChange = (e) => {
  const value = e.target.value;
  setsortOption(value);
  setPage(1); // 페이지를 1로 초기화
};

// 페이지가 변경될 때 데이터를 불러오는 useEffect 추가
useEffect(() => {
  if (isSearching) {
    searchMenu(page); // 검색 중일 경우 검색 함수 실행
  } else {
    fetchRecipes(page); // 그 외 경우 레시피 목록 불러오기
  }
}, [page]);

  useEffect(() => {
  fetchRecipes(page, true); // 선택된 값에 따라 데이터 로드 (기존 데이터 지우고 새로 로드)
}, [selectedFoodCategory, menuCategory, sortOption]);
  
useEffect(() => {
  console.log('Main Food Category:', mainFoodCategory);
}, [mainFoodCategory]);

const handleFoodCategoryChange = (e) => {
  console.warn(e.target.value);
  const selectedFoodName = e.target.value;
  setSelectedFoodCategory(selectedFoodName); // 여기서 foodId 값을 설정함
  setRecipes([]); // 기존 데이터를 비우고
  setPage(1); // 페이지 초기화
  const selectedFood = mainFoodCategory.find(food => food.foodName === selectedFoodName);
  const selectedFoodId = selectedFood ? selectedFood.memberFoodId : null;
  console.log('Selected Food ID:', selectedFoodId);
};

  const searchMenu = async (pageNumber) => {
    setLoading(true);
    try {
      const params = { page: pageNumber, size: 700, sort: sortOption, keyword: searchKeyword.trim(), foodName:"" , menuCategory:handleGetMenuCategory(menuCategory)  }; // keyword 추가
      const response = await axios.get(process.env.REACT_APP_API_URL + 'menus/test', {
            params: { ...params},
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });
  
      const menuList = response.data.data;

      // 검색 결과를 상태에 반영
      setRecipes(menuList); // 검색된 데이터로 상태를 업데이트
      setLoading(false);
      if (menuList.length === 0) {
        // 만약 새로 가져온 음식 목록이 비어 있으면,
        // 즉, 더 이상 새로운 음식이 없으면,
        setHasMore(false); // 더 이상 음식이 없다는 것을 알려줍니다.
      }
    } catch (error) {
      console.error("Failed to fetch recipes: ", error);
      setError(error);
      setLoading(false);
    }
  };
  
  
  const getFoodName = async() => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
        params: { page: 1, size: 700, sort: "foodName_asc" },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setMainFoodCategory(response.data.data);
    } catch(error) {
    }
  };

  const handleSelectCategoryChange = (e) => {
    setMenuCategory(e.target.value);
    setRecipes([]);
    setPage(1);
  };

  const handleSearchClick = () => {
    const trimmedKeyword = searchKeyword.trim();
    setRecipes([]); // 검색할 때마다 기존 데이터를 리셋
    setPage(1); // 페이지 초기화
  
    if (trimmedKeyword === "") {
      // 검색어가 빈칸일 때, 전체 레시피 조회
      setIsSearching(false);
      fetchRecipes(1); // 1페이지부터 전체 레시피 조회
    } else {
      // 검색어가 있을 때, 검색 실행
      setIsSearching(true);
      searchMenu(1); // 검색 함수 실행
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick(); // 엔터키를 누르면 handleSearchClick 호출
    }
  };

  const handleGetMenuCategory = (menuCategory) => {
    switch (menuCategory) {
      case "전체":
        return "ALL";
      case "밑 반찬":
        return "MENU_CATEGORY_SIDE";
      case "국/찌개":
        return "MENU_CATEGORY_SOUP";
      case "디저트":
        return "MENU_CATEGORY_DESSERT";
      case "면":
        return "MENU_CATEGORY_NOODLE";
      case "밥/죽/떡":
        return "MENU_CATEGORY_RICE";
      case "김치":
        return "MENU_CATEGORY_KIMCHI";
      case "퓨전":
        return "MENU_CATEGORY_FUSION";
      case "양념":
        return "MENU_CATEGORY_SEASONING";
      case "양식":
        return "MENU_CATEGORY_WESTERN";
      default:
        return "MENU_CATEGORY_ETC"; 
    }
  };

  const handleScroll = () => {
    const container = document.getElementById('scrollable-container');
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      if (!loading && hasMore) {
        setPage(prevPage => {
          const newPage = prevPage + 1;
          if (searchKeyword.trim()) {
            searchMenu(newPage); 
          } else {
            fetchRecipes(newPage);
          }
          return newPage;
        });
      }
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [sortOption, menuCategory, page]);

  useEffect(() => {
    const container = document.getElementById('scrollable-container');
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    getFoodName();
  }, []);

return (
  <MainContainer>
     {isModalOpen && <Modal onClose={handleCloseFirstModal} isSecondModal={false} />}
     {isSecondModalOpen && <Modal onClose={handleCloseSecondModal} isSecondModal={true} />}
    <Header>
      <InputGroup>
        <Label>메인 식재료</Label>
        <Select onChange={handleFoodCategoryChange}>
          <option value="">전체</option>
          {mainFoodCategory.map((food, index) => (
            <option key={food.foodId} value={food.foodId}>
              {food.foodName}
            </option>
          ))}
        </Select>
      </InputGroup>

      <FilterSection>
        <InputGroup2_1thLine>
          <Label2>메뉴 종류</Label2>
          <Select value={menuCategory} onChange={handleSelectCategoryChange}>
            <option>전체</option>
            <option>밑 반찬</option>
            <option>국/찌개</option>
            <option>디저트</option>
            <option>면</option>
            <option>밥/죽/떡</option>
            <option>김치</option>
            <option>퓨전</option>
            <option>양념</option>
            <option>양식</option>
            <option>기타</option>
          </Select>
        </InputGroup2_1thLine>
        <InputGroup2_2thLine>
          <Label2>정렬</Label2>
          <Select onChange={handleSortChange} value={sortOption}>
            <option value="missingFoodsCount_asc">추천순 ▼</option>
            <option value="menuLikeCount_desc">좋아요 ▼</option>
            <option value="menuLikeCount_asc">좋아요 ▲</option>
            <option value="likeList">좋아요 목록</option>
          </Select>
        </InputGroup2_2thLine>
      </FilterSection>

      <SearchBar>
        <TextArea
          type="text"
          placeholder="메뉴이름 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress} // Enter 키 입력 감지
        />
        <SearchIcon src={Search_img} alt="search icon" onClick={handleSearchClick} />
      </SearchBar>
    </Header>

    <ScrollableContainer id="scrollable-container">
      {recipes.map((menu, index) => {
        return (
          <FoodItem key={`${menu.menuId}_${index}`} onClick={() => handleClick(menu.menuId)}>
            <FoodImage src={menu.imageUrl} alt={menu.title} />
            <FoodInfo>
              <FoodName>{menu.menuTitle}</FoodName>
              <FoodIngredients>좋아요 수  : {menu.menuLikeCount}</FoodIngredients>
              <FoodIngredients>보유 재료 : {menu.ownedFoods ? menu.ownedFoods : "없음"}</FoodIngredients>
              <FoodIngredients>미보유 재료 : {menu.missingFoods ? menu.missingFoods : "없음"}</FoodIngredients>
            </FoodInfo>
          </FoodItem>
        );
      })}
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

const TextArea = styled.input`
  flex: 1;
  border: none;
  margin-left: 10px;
  font-size: 14px;
  outline: none;
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

const Label2 = styled.div`
  width: 70px;
  background-color: white;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  line-height: 30px; 
  border-right: 2px solid #2D9CDB;
  border-radius: 20px 0 0 20px;
`;

// 모달 스타일
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContent = styled.div`
    background: #fff;
    border-radius: 10px;
    padding: 10px; /* 패딩을 늘려서 내부 공간을 키움 */
    width: 350px; /* 너비를 설정 */
    height: 430px; /* 높이를 설정 (필요에 따라 조정) */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
`;

const ModalText = styled.p`
    font-size: 20px;
    color: black;
    margin-bottom: 5px;
    margin-top: 30px;
`;

const ModalText2 = styled.p`
    font-size: 15px;
    color: black;
    margin-bottom: 35px;
     margin-top: 5px;
`;

const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px; // 버튼 간격을 늘립니다.
    margin-top: 35px; // 버튼 위쪽 간격 추가
`;

const ModalButton = styled.button`
    background-color: #2d9cdb;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px 30px; // 버튼의 세로 크기를 늘립니다.
    cursor: pointer;

    &:hover {
        background-color: #1a7ab8;
    }
`;


const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px; // 각 입력란 사이 간격
  margin-left: 20px;
  input {
    background-color: #f5f5f5; // 입력란 배경색 지정
    border: 1px solid #ccc; // 경계선 추가
    border-radius: 5px; // 둥근 모서리
    padding: 5px; // 내부 여백 추가
  }
    span2 {
    display: block; // 블록 요소로 변경
    background-color: #f5f5f5; // 배경색 지정
    border: 1px solid #ccc; // 경계선 추가
    border-radius: 5px; // 둥근 모서리
    padding: 5px; // 내부 여백 추가
    width: 177px; // 너비를 고정
    height: 40px; // 높이 설정
    line-height: 40px; // 수직 중앙 정렬 (높이에 맞춰 조정)
    font-weight: bold; // 굵은 글씨
    font-size: 15px; // 굵은 글씨
    text-align: center; // 텍스트 중앙 정렬
   
  }
`;


const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px; // 라디오 버튼과 입력란 사이 간격
`;
