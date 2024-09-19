import styled from 'styled-components';
import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

//아이콘 이미지
import user_icon from '../../resources/icon/user.png';
import timer_icon from '../../resources/icon/timer.png';
import cook_icon from '../../resources/icon/cook.png';
import like_icon from '../../resources/icon/heart_red.png';
import like_fill_icon from '../../resources/icon/heart_red_FillIn.png';
import menu_1 from '../../resources/sample/menu_1.png';

//난이도 이미지
import difficulty1_icon from '../../resources/icon/difficulty_1.png';
import difficulty2_icon from '../../resources/icon/difficulty_2.png';
import difficulty3_icon from '../../resources/icon/difficulty_3.png';


const RecipeDetails = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 변수 선언
  const { menuId } = useParams(); // 메뉴 ID를 URL에서 가져옴
  const queryClient = useQueryClient();
  const [userFoodInventory, setUserFoodInventory] = useState([]); // 사용자의 보유 식재료 상태 관리

  const categoryMap = {
    'MENU_CATEGORY_SIDE': '밑 반찬',
    'MENU_CATEGORY_SOUP': '국/찌개',
    'MENU_CATEGORY_DESSERT': '디저트',
    'MENU_CATEGORY_NOODLE': '면',
    'MENU_CATEGORY_RICE': '밥/죽/떡',
    'MENU_CATEGORY_KIMCHI': '김치',
    'MENU_CATEGORY_FUSION': '퓨전',
    'MENU_CATEGORY_SEASONING': '양념',
    'MENU_CATEGORY_WESTERN': '양식',
    'MENU_CATEGORY_ETC': '기타',
  };

  const difficultyMap = {
    'DIFFICULTY_EASY': '쉬움',
    'DIFFICULTY_MEDIUM': '보통',
    'DIFFICULTY_HARD': '어려움',
  };

  // 버튼 클릭 시 이동하는 함수 정의
  const handleRecipeStep = () => {
    navigate(`/recipe/details/${menuId}/step`); // 메뉴 ID와 함께 RecipeStep 페이지로 이동
  };

   // 난이도에 따른 이미지 매핑 함수
   const getDifficultyImage = (difficulty) => {
    switch (difficulty) {
      case 'DIFFICULTY_EASY':
        return difficulty1_icon;
      case 'DIFFICULTY_MEDIUM':
        return difficulty2_icon;
      case 'DIFFICULTY_HARD':
        return difficulty3_icon;
      default:
        return null; // 기본값 처리 (없을 때)
    }
  };

  // 보유 식재료 이름 가져오기
  const getFoodName = async() => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
        params: { page: 1, size: 700, sort: "foodName_asc" },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const foodList = response.data.data.map(food => food.foodName); // 보유한 식재료 이름만 추출
      setUserFoodInventory(foodList); // 상태에 저장
    } catch(error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFoodName();
  }, []);

  // 보유 식재료인지 확인
  const isOwnedIngredient = (ingredientName) => {
    return userFoodInventory.includes(ingredientName);
  };


  // 메뉴 데이터를 불러오는 함수
  const fetchMenu = async () => {
    if (!menuId) {
      throw new Error('잘못된 메뉴 ID 입니다.');
    }
    try {
      const response = await axios.get(`http://localhost:8080/menus/${menuId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 토큰 사용
        },
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  // React Query를 사용하여 메뉴 데이터를 불러옴
  const {
    data: menu,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['menu', menuId],
    queryFn: fetchMenu,
    enabled: !!menuId,
    retry: 1,
  });

  /**
   * 좋아요 이미지 처리 메서드
   * 
   * @return : post.LikeCheck를 인자로 받는데 이게 'T'면은 채워진 하트, 아니면 비워진 하트
   * 
   * @Author : 신민준
   */
  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleLikeImg = (likeCheck) => {
    return likeCheck === 'T' ? like_fill_icon : like_icon;
  };

  /**
   * 좋아요 처리 메서드. 
   * 
   * @return : 성공하면 queryClient.invalidateQueries를 통해 React Query의 queryKey를 이용하여 Refresh진행!!
   *          하트가 채워지는 것을 보여주기 위해서 Refresh하는 것
   *          실패하면은 ERR alert 반환
   * 
   * @Author : 신민준
   */
  const likeMutation = useMutation({
    mutationFn: () => {
      return axios.post(process.env.REACT_APP_API_URL+`menus/${menuId}/like`,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menuId]);
    },
    onError: () => {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    },
  });

  // 로딩 중 처리
  if (isLoading) return (
    <Container>
      <ClipLoader color="#007bff" loading={isLoading} size={50} />
    </Container>
  );

  // 에러 처리
  if (isError) {
    return <div>메뉴를 불러오는데 오류가 발생했습니다: {error.message}</div>;
  }

  if (!menu) {
    return <div>메뉴를 찾을 수 없습니다.</div>;
  }


  // 카테고리 매핑된 값
  const menuCategory = categoryMap[menu.menuCategory] || '카테고리 없음';
  // 난이도 매핑된 값
  const difficultyText = difficultyMap[menu.difficulty] || '난이도 없음';
  // 난이도 이미지
  const difficultyImage = getDifficultyImage(menu.difficulty);


  // 추후에 menu_1 => menu 이미지 변경
  return (
    <Container>
        <ImageContainer>
          <Image src={menu.imageUrl || '/images/default.png'} alt="이미지 없음" /> 
          <LikeButton onClick={handleLike}>
            <LikeButtonImage src={handleLikeImg(menu.likeCheck)} alt="Button Icon" />
          </LikeButton>
        </ImageContainer>
        <TextContainer>
        <Title>[ {menuCategory} ] {menu.menuTitle}</Title>
        <Dividers />
        <Description>{menu.menuDescription}</Description>
        <InfoContainer>
          <InfoItem>
            <Icon src={user_icon} alt="관리자" />
            관리자
          </InfoItem>
          <InfoItem>
            <Icon src={cook_icon} alt="인분" />
            {menu.servingSize}인분
          </InfoItem>
        </InfoContainer>
        <InfoContainer>
          <InfoItem>
            <Icon src={timer_icon} alt="시간" />
            {menu.cookingTime}분
          </InfoItem>
          <InfoItem>
            <Icon src={difficultyImage} alt="난이도" />
            {difficultyText}
          </InfoItem>
        </InfoContainer>
        <Ingredients>
        <Title>재료</Title>
        <Dividers />
          {menu.foodMenuQuantityList.map((ingredient, index) => (
            <React.Fragment key={index}>
              <li>
                <Span style={{ color: isOwnedIngredient(ingredient.foodName) ? 'black' : 'red' }}>
                  {ingredient.foodName}</Span>
                <Span>{ingredient.foodQuantity}</Span>
              </li>
              {index < menu.foodMenuQuantityList.length - 1 && <Uldividers />} {/* 마지막 항목 뒤에는 Divider가 없음 */}
            </React.Fragment>
          ))}
        </Ingredients>
        <ButtonContainer>
          <ActionButton onClick={handleRecipeStep}>레시피 보기</ActionButton>
        </ButtonContainer>
      </TextContainer>
    </Container>
  );
};
// Styled Components
const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;
// Uldividers styled-component 정의
const Uldividers = styled.div`
  border: 0;
  height: 1px;
  background-color: #D9D9D9;
  margin: 0 0;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 0 0 30px 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 450px;
  border-radius: 10px;
  display: block;
`;

const LikeButton = styled.button`
  position: absolute;
  bottom: 0px; /* 이미지 아래쪽에서 0px 위치 */
  right: 0px; /* 이미지 오른쪽에서 0px 위치 */
  width: 50px; /* 버튼 너비 */
  height: 50px; /* 버튼 높이 */
  background-color: white; /* 버튼 배경색 */
  border: none;
  border-radius: 20px 0 0; /* 모서리를 둥글게 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* 이미지가 중앙에 오도록 설정 */
  opacity: 0.6; /* 20% 투명도 */
`;

const LikeButtonImage = styled.img`
  width: 30px;
  height: 30px;
`;

const TextContainer = styled.div`
  width: 90%;
  padding-top: 20px;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #2D9CDB;
`;

const Dividers = styled.div`
  border: 0;
  height: 2px;
  background-color: #2D9CDB;
  margin: 0 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: #333;
  width: 300px;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Ingredients = styled.ul`
  list-style: none;
  padding-left: 0; /* 패딩 제거 */
  margin-left: 0;  /* 마진 제거 */
  text-align: left; /* 텍스트 왼쪽 정렬 */

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 17px;
    color: #000000;

    span:first-child {
      flex: 1;
      text-align: left;
    }

    span:last-child {
      width: 60px;
      text-align: right;
    }
  }
`;

const Span = styled.span`
  font-size: 14px;
  margin: 5px 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40px;
`;



const ActionButton = styled.button`
  background-color: #2D9CDB;
  color: #FFFFFF;
  width: 100%;
  height: 50px;
  padding: 10px 40px;
  border: 2px solid #2D9CDB;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;


export default RecipeDetails;
