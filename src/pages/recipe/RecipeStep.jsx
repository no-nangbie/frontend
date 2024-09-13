import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import menu_1 from '../../resources/sample/menu_1.png';
import micro_1 from '../../resources/icon/microphone.png';
import micro_2 from '../../resources/icon/microphone_onclick.png';
import axios from 'axios';

const RecipeSteps = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();  // useNavigate 호출
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [micActive, setMicActive] = useState(false); 
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState(''); // 인식된 텍스트 상태


   // 페이지, 사이즈, 정렬 파라미터 기본값 설정
   const page = 1;
   const size = 100;  // 충분히 큰 값을 설정하여 모든 재료를 가져옴
   const sort = 'foodName_asc';  // 정렬 기준
   
  // 메뉴 데이터를 가져오는 함수
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/menus/${menuId}`, {  // 백틱(``)을 사용하여 템플릿 리터럴 적용
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,  // 백틱(``)을 사용하여 문자열 템플릿 적용
          },
        });
    
        const menuData = response.data.data;
        setSteps(menuData.recipes);
        setIngredients(menuData.foodMenuQuantityList);
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    };

    fetchRecipeData();
  }, [menuId]);


  // MemberFood 데이터를 가져오는 함수
  useEffect(() => {
    const fetchMemberFoods = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/my-foods`, {
          params: { page, size, sort },  // page, size, sort를 추가
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const memberFoods = response.data.data;
        // 여기에 memberFoods 데이터를 처리하는 로직 추가 가능
      } catch (error) {
        console.error('Error fetching member foods:', error);
      }
    };

    fetchMemberFoods();
  }, [page, size, sort]);  // page, size, sort를 의존성에 추가

  
// Web Speech API 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.lang = "ko-KR";
      recognitionInstance.continuous = true; 
      recognitionInstance.interimResults = false; // 최종 결과만 처리

      recognitionInstance.onresult = (event) => {
        let transcriptText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcriptText += event.results[i][0].transcript;
        }
        console.log('Recognized text:', transcriptText);

        const cleanedTranscript = transcriptText.trim().replace(/[.,\s]/g, '');
        
        // "다음"이라는 단어를 인식하면 페이지 넘김
        if (cleanedTranscript.includes('다음')) {
          handleNext();
        }

        // "이전"이라는 단어를 인식하면 이전 페이지로 이동
        if (cleanedTranscript.includes('이전')) {
          handlePrev();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionInstance.onend = () => {
        setTimeout(() => {
          if (micActive) {
            console.log("음성 인식 재시작됨");
            recognitionInstance.start();
          } else {
            console.log("음성 인식 종료됨");
          }
        }, 100); // 딜레이를 주어 상태 업데이트가 반영되도록 함
      };

      setRecognition(recognitionInstance);
    }
  }, [micActive]); // micActive 상태에 따라 음성 인식 제어

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prevStep) => prevStep + 1);
      setTranscript('');  // 인식된 텍스트 초기화
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // 마이크 상태를 토글하여 음성 인식 시작/종료 제어
  const toggleMic = () => {
    console.log("Mic active before toggle:", micActive);

    if (!micActive && recognition) {
      recognition.start(); // 마이크 활성화 시 음성 인식 시작
      console.log("음성 인식 시작됨");
    } else if (micActive && recognition) {
      recognition.stop(); // 마이크 비활성화 시 음성 인식 종료
      console.log("음성 인식 강제 종료됨");
    }
    
    setMicActive((prevState) => {
      console.log("Toggling mic active:", !prevState); // 상태가 변경되는 부분 확인
      return !prevState;
    });
  };


  const handleIngredientCheck = (ingredientName) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientName)
        ? prevSelected.filter((name) => name !== ingredientName)
        : [...prevSelected, ingredientName]
    );
  };

  const handleFinishCooking = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/my-foods`, {
        params: { page, size, sort },  // page, size, sort를 추가
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const memberFoods = response.data.data;

      // 사용자가 선택한 재료의 foodName과 일치하는 MemberFood ID 찾기
      const memberFoodIdsToDelete = memberFoods
        .filter(memberFood =>
          selectedIngredients.includes(memberFood.foodName))  // foodName 비교
        .map(memberFood => memberFood.memberFoodId);  // memberFoodId 추출

      if (memberFoodIdsToDelete.length > 0) {
        // 선택된 MemberFood들을 삭제
        await axios.delete(`http://localhost:8080/my-foods`, {
          data: memberFoodIdsToDelete,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      }

      // 성공 시 /recipe 페이지로 이동
      navigate('/recipe');
    } catch (error) {
      console.error('Error removing ingredients from MemberFood:', error);
      // 오류 발생 시에도 /recipe 페이지로 이동
      navigate('/recipe');
    }
  };

  return (
    <Container>
      <Header>
        <Title>레시피 단계</Title>
        <Controls>
          <ButtonWrapper>
            <Button onClick={handlePrev} disabled={currentStep === 0}>
              이전
            </Button>
            <StepIndicator>{currentStep + 1} / {steps.length + 1}</StepIndicator>
            <Button onClick={handleNext} disabled={currentStep === steps.length}>
              다음
            </Button>
          </ButtonWrapper>
        </Controls>
      </Header>

      {currentStep < steps.length ? (
        <RecipeSection>
          <BackgroundImage src={menu_1} alt="레시피 이미지" />
          <StepDescription>{steps[currentStep]}</StepDescription>
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
          <FinishButton onClick={handleFinishCooking}>요리 완료</FinishButton>
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
