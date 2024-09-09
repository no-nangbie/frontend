import React, { useState } from 'react';
import styled from 'styled-components';

const BoardEdit = () => {
  const [difficulty, setDifficulty] = useState(2); // 기본 난이도는 '보통'
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지 상태 관리

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
  };

  // 이미지 선택 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일을 선택했을 때 URL로 변환해서 이미지 미리보기
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Container>
      <TextContainer>
        <SectionTitle>요리 정보</SectionTitle>
        <Divider />

        <Title>이미지</Title>
        <ImageContainer>
          <ImageButton htmlFor="imageUpload">이미지 가져오기</ImageButton>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <ImagePlaceholder>
            {selectedImage ? (
              <PreviewImage src={selectedImage} alt="Selected" />
            ) : (
              'image'
            )}
          </ImagePlaceholder>
        </ImageContainer>

        <Title>메뉴 이름</Title>
        <Input type="text" placeholder="메뉴 이름" />

        <Title>메뉴 설명</Title>
        <TextArea placeholder="메뉴 설명" />

        <InfoRow>
          <InfoInputContainer>
            <Title>음식양</Title>
            <SmallInput type="text" placeholder="음식양" />
          </InfoInputContainer>
          <InfoInputContainer>
            <Title>소요 시간</Title>
            <SmallInput type="text" placeholder="소요 시간" />
          </InfoInputContainer>
        </InfoRow>

        <Title>난이도</Title>
        <DifficultySlider>
          <SliderContainer>
            <Line />
            <FilledLine width={`${(difficulty - 1) * 50}%`} />
            <Circle
              onClick={() => handleDifficultyChange(1)}
              active={difficulty >= 1}
              position="0%"
            />
            <Circle
              onClick={() => handleDifficultyChange(2)}
              active={difficulty >= 2}
              position="50%"
            />
            <Circle
              onClick={() => handleDifficultyChange(3)}
              active={difficulty === 3}
              position="100%"
            />
          </SliderContainer>
          <Labels>
            <Label>쉬움</Label>
            <Label>보통</Label>
            <Label>어려움</Label>
          </Labels>
        </DifficultySlider>

        <SectionTitle>재료</SectionTitle>
        <Divider />
        <TextArea placeholder="재료" />

        <SectionTitle>레시피</SectionTitle>
        <Divider />
        <TextArea placeholder="레시피" />

        <SubmitButton>올리기</SubmitButton>
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
  height: 100%; /* Limit height of the scrollable area */
  overflow-y: auto; /* 세로 스크롤 가능하게 설정 */
  overflow-x: hidden;
`;

const TextContainer = styled.div`
  width: 90%;
  padding-top: 20px;
  text-align: left;
`;

const SectionTitle = styled.h2`
  width: 100%;
  font-size: 20px;
  color: #2d9cdb;
  text-align: left;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #2d9cdb;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  width: 100%;
  font-weight: bold;
  margin: 0;
  color: #000;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ImageButton = styled.label`
  background-color: white;
  border: 2px solid #2d9cdb;
  padding: 10px;
  color: #2d9cdb;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  border-radius: 10px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border: 2px solid #2d9cdb;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 2px solid #2d9cdb;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const InfoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const SmallInput = styled.input`
  width: 100%;
  border: 2px solid #2d9cdb;
  height: 30px;
  border-radius: 5px;
`;

const DifficultySlider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Line = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #e0e0e0;
  z-index: 1; /* 라인이 점 뒤에 가리지 않도록 조정 */
`;

const FilledLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background-color: #2d9cdb;
  width: ${(props) => props.width};
  transform: translateY(-50%);
  z-index: 2; /* 파란색 라인이 점 뒤에 가리지 않도록 조정 */
`;

const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: ${(props) => props.position};
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.active ? '#2d9cdb' : '#ccc')};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 3; /* 점이 항상 라인 위에 보이도록 설정 */
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.span`
  font-size: 14px;
  color: #333;
`;

const SubmitButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;  /* 수평 중앙 정렬 */
  align-items: center;      /* 수직 중앙 정렬 */
  background-color: #2d9cdb;
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #228ac6;
  }
`;

export default BoardEdit;
