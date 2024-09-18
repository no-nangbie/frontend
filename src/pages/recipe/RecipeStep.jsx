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
  const [menuImage, setMenuImage] = useState([]);
  const [transcript, setTranscript] = useState(''); // 인식된 텍스트 상태


   // 페이지, 사이즈, 정렬 파라미터 기본값 설정
   const page = 1;
   const size = 100;  // 충분히 큰 값을 설정하여 모든 재료를 가져옴
   const sort = 'foodName_asc';  // 정렬 기준
   
   // 메뉴 데이터를 가져오는 함수
   useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const menuData = response.data.data;
        setSteps(menuData.recipes);
        setIngredients(menuData.foodMenuQuantityList);
        setMenuImage(menuData.imageUrl);
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
          params: { page, size, sort },
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
  }, [page, size, sort]);

  // Web Speech API 초기화 및 currentStep 변경 감지
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.lang = 'ko-KR';
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
          setCurrentStep((prevStep) => {
            // 마지막 단계이면 더 이상 넘어가지 않도록 함
            if (prevStep < steps.length) {
              return prevStep + 1;
            }
            console.log('마지막 단계입니다.');
            return prevStep;
          });
        }

        // "이전"이라는 단어를 인식하면 이전 페이지로 이동
        if (cleanedTranscript.includes('이전')) {
          setCurrentStep((prevStep) => {
            // 첫 번째 단계이면 더 이상 뒤로 가지 않도록 함
            if (prevStep > 0) {
              return prevStep - 1;
            }
            console.log('첫 번째 단계입니다.');
            return prevStep;
          });
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionInstance.onend = () => {
        setTimeout(() => {
          if (micActive) {
            console.log('음성 인식 재시작됨');
            recognitionInstance.start();
          } else {
            console.log('음성 인식 종료됨');
          }
        }, 100); // 딜레이를 주어 상태 업데이트가 반영되도록 함
      };

      setRecognition(recognitionInstance);
    }
  }, [micActive, steps]); // micActive와 steps 의존성 추가

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
    console.log('Mic active before toggle:', micActive);

    if (!micActive && recognition) {
      recognition.start(); // 마이크 활성화 시 음성 인식 시작
      console.log('음성 인식 시작됨');
    } else if (micActive && recognition) {
      recognition.stop(); // 마이크 비활성화 시 음성 인식 종료
      console.log('음성 인식 강제 종료됨');
    }

    setMicActive((prevState) => {
      console.log('Toggling mic active:', !prevState); // 상태가 변경되는 부분 확인
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
        await axios.patch(process.env.REACT_APP_API_URL + 'statistics/'+menuId,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const response = await axios.get(process.env.REACT_APP_API_URL + 'my-foods', {
        params: { page, size, sort },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const memberFoods = response.data.data;

      // 사용자가 선택한 재료의 foodName과 일치하는 MemberFood ID 찾기
      const memberFoodIdsToDelete = memberFoods
        .filter((memberFood) =>
          selectedIngredients.includes(memberFood.foodName)
        )
        .map((memberFood) => memberFood.memberFoodId);

      if (memberFoodIdsToDelete.length > 0) {
        await axios.delete(process.env.REACT_APP_API_URL + 'my-foods', {
          data: memberFoodIdsToDelete,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      }

      navigate('/recipe');
    } catch (error) {
      console.error('Error removing ingredients from MemberFood:', error);
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
          <BackgroundImage src={menuImage} alt="레시피 이미지" />
           {/* 이전 단계 설명을 흐릿하게 표시 */}
           {currentStep > 0 && (
            <PreviousStepDescription>{steps[currentStep - 1]}</PreviousStepDescription>
          )}
          
          {/* 현재 단계 설명 */}
          <StepDescription>{steps[currentStep]}</StepDescription>

          {/* 다음 단계 설명을 흐릿하게 표시 */}
          {currentStep + 1 < steps.length && (
            <NextStepDescription>{steps[currentStep + 1]}</NextStepDescription>
          )}

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

// 스타일 추가
const NextStepDescription = styled.p`
  margin-top: 30px;  // 여유 공간을 위로 줌
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.441);  // 흐릿한 색상 적용
  text-align: center;
  position: absolute;
  bottom: 300px;  // 현재 단계 아래에 위치하도록 조정
  width: 100%;
`;

// 스타일 추가
const PreviousStepDescription = styled.p`
  margin-bottom: 30px;  // 여유 공간을 아래로 줌
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.441);  // 흐릿한 색상 적용
  text-align: center;
  position: absolute;
  top: 150px;  // 현재 단계 위에 위치하도록 조정
  width: 100%;
`;

const StepDescription = styled.p`
  line-height: 1.5;
  font-size: 27px;
  font-weight: bold;
  color: #333;
  padding: 20px;
  background-color: rgba(250, 205, 205, 0.021);
  border-radius: 10px;
  position: relative;
  z-index: 2;  // 앞에 보이게 하기 위해 z-index 추가
  margin-bottom: 160px;  // 여유 공간을 아래로 줌
`;
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
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  opacity: 0.15;
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
