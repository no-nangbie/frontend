import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import menu_1 from '../../resources/sample/menu_1.png';
import micro_1 from '../../resources/icon/microphone.png';
import micro_2 from '../../resources/icon/microphone_onclick.png';
import axios from 'axios';

const RecipeSteps = () => {
  const { menuId } = useParams(); // URL에서 menuId를 가져옴
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [micActive, setMicActive] = useState(false); // 마이크 상태를 관리하는 상태 추가
  const [steps, setSteps] = useState([]); // 레시피 단계를 위한 상태
  const [ingredients, setIngredients] = useState([]); // 재료 리스트를 위한 상태

  // menuId를 사용하여 해당 메뉴의 레시피 데이터를 가져옴
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 추가
          },
        });

        const menuData = response.data.data;
        setSteps(menuData.recipes); // 레시피 단계를 설정
        setIngredients(menuData.foodMenuQuantityList); // 재료 리스트 설정
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    };

    fetchRecipeData();
  }, [menuId]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleMic = () => {
    setMicActive((prevState) => !prevState); // 클릭 시 마이크 상태 토글
  };

  const handleIngredientCheck = (ingredientName) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientName)
        ? prevSelected.filter((name) => name !== ingredientName)
        : [...prevSelected, ingredientName]
    );
  };

  return (
    <Container>
      <Header>
        <Title>레시피 단계</Title>
        <Controls>
          <ButtonWrapper>
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              이전
            </Button>
            <StepIndicator>{currentStep + 1} / {steps.length + 1}</StepIndicator>
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
            >
              다음
            </Button>
          </ButtonWrapper>
        </Controls>
      </Header>
  
      {/* 레시피 단계가 마지막 단계일 때와 아닐 때를 구분 */}
      {currentStep < steps.length ? (
        <RecipeSection>
          <BackgroundImage src={menu_1} alt="레시피 이미지" />
          <StepDescription>{steps[currentStep]}</StepDescription>
          {/* 마이크 버튼은 마지막 단계가 아닐 때만 표시 */}
          <MicButton onClick={toggleMic}>
            <img src={micActive ? micro_2 : micro_1} alt="mic" />
          </MicButton>
        </RecipeSection>
      ) : (
        <FinalStepSection>
          <WarningText>이번 요리로 인해 소진된 식재료를 선택해 주세요</WarningText>
          <IngredientsTitle>사용된 재료</IngredientsTitle>
          <IngredientsList>
            {ingredients.map((ingredient) => (
              <IngredientItem key={ingredient.foodName}>
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.foodName)}
                  onChange={() => handleIngredientCheck(ingredient.foodName)}
                />
                <span>{ingredient.foodName}</span>
                <span>{ingredient.foodQuantity}</span>
              </IngredientItem>
            ))}
          </IngredientsList>
          <FinishButton>요리 완료</FinishButton>
        </FinalStepSection>
      )}
    </Container>
  );
};

export default RecipeSteps;

// styled-components
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  font-size: 12px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 10px 10px 0 0;
`;

const Title = styled.h1`
  margin-bottom: 5px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  padding: 10px;
  border: 2px solid #007bff;
  border-radius: 50px;
  background-color: #f8f9fa;
  box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.1);
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StepIndicator = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const RecipeSection = styled.div`
  position: relative;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  background-image: url(${menu_1});
  background-size: cover;
  background-position: center;
  opacity: 0.15;
`;

const StepDescription = styled.p`
  line-height: 1.5;
  font-size: 25px;
  font-weight: bold;
  color: #333;
  padding: 20px;
  position: relative;
  background-color: rgba(250, 205, 205, 0.021);
  border-radius: 10px;
  margin-top: -150px;
`;

const FinalStepSection = styled.div`
  position: relative;
  padding: 40px;
  top: -120px;
  text-align: center;
  font-size: 18px;
`;

const WarningText = styled.p`
  color: red;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const IngredientsList = styled.div`
  margin-bottom: 20px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 10px;
  border: 1px solid #007bff;
  border-radius: 10px;
`;

const IngredientsTitle = styled.h2`
  color: #007bff;
  font-size: 20px;
  text-align: left;
  margin-bottom: 10px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const IngredientItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  input {
    margin-right: 10px;
  }

  span {
    flex: 1;
    text-align: left;
  }

  span:last-child {
    text-align: right;
    width: 100px;
  }
`;

const MicButton = styled.button`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  padding: 0;
  width: 70px;
  height: 70px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const FinishButton = styled.button`
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
`;
