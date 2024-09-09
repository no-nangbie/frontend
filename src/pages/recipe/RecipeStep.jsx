import React, { useState } from 'react';
import styled from 'styled-components';
import menu_1 from '../../resources/sample/menu_1.png';
import micro_1 from '../../resources/icon/microphone.png';
import micro_2 from '../../resources/icon/microphone_onclick.png';


const RecipeSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [micActive, setMicActive] = useState(false); // 마이크 상태를 관리하는 상태 추가

  const steps = [
    "1. 돼지고기는 분량의 양념을 넣어 조물조물 해주신 후 30분 이상 재워둡니다.",
    "2. 냄비에 썰어둔 김치와 밑간한 돼지고기, 김칫국물 5큰술, 참기름 1작은술을 넣어 약불에서 3~5분간 충분히 볶아줍니다.",
    "3. 물을 부어 끓이기 시작하고, 강한 불에서 팔팔 끓여줍니다.",
    "4. 맛있게 먹어줍니다.",
  ];

  const ingredients = [
    { name: '물', amount: '250ml' },
    { name: '돼지고기 [찌개용]', amount: '250g' },
    { name: '김치', amount: '200g' },
    { name: '양파', amount: '반 개' },
    { name: '고추', amount: '2개' }
  ];

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
        <Title>돼지고기 김치찌개</Title>
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
          <BackgroundImage src={menu_1} alt="돼지고기 김치찌개" />
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
              <IngredientItem key={ingredient.name}>
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.name)}
                  onChange={() => handleIngredientCheck(ingredient.name)}
                />
                <span>{ingredient.name}</span>
                <span>{ingredient.amount}</span>
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
  position: relative; /* FinalStepSection을 기준으로 하는 컨테이너 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* 화면 전체 높이를 사용 */
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
  background-image: url(${() => menu_1});
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
  position: relative; /* 혹은 absolute로 변경 가능 */
  padding: 40px; /* 패딩을 조정하여 상하 여백을 줄임 */
  top: -120px; /* top 값을 음수로 설정해 위로 올림 */
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
  max-height: 200px; /* 리스트의 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤을 활성화 */
  padding-right: 10px; /* 스크롤바가 나타날 때 글자가 가려지지 않게 여유 공간 설정 */
  border: 1px solid #007bff; /* 테두리 설정 */
  border-radius: 10px; /* 테두리를 둥글게 설정 */
`;


const IngredientsTitle = styled.h2`
  color: #007bff; /* 파란색 */
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
    margin-right: 10px; /* 체크박스와 이름 사이 여백 */
  }

  span {
    flex: 1;
    text-align: left;
  }

  span:last-child {
    text-align: right; /* 수량을 오른쪽으로 정렬 */
    width: 100px; /* 수량 텍스트의 고정 너비를 설정해서 정렬을 맞춤 */
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
  padding: 0;  /* 패딩을 0으로 설정하여 이미지가 버튼을 꽉 채우도록 */
  width: 70px;  /* 버튼의 너비 */
  height: 70px; /* 버튼의 높이 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  img {
    width: 100%;  /* 이미지가 버튼 너비에 맞게 설정 */
    height: 100%; /* 이미지가 버튼 높이에 맞게 설정 */
    object-fit: cover; /* 이미지가 버튼 안에서 비율이 유지되면서 꽉 차도록 설정 */
    border-radius: 50%; /* 이미지 모서리를 둥글게 설정 */
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

