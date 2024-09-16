import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

const BoardAdd = () => {
  // 사용자가 입력한 값을 상태로 관리
  const [title, setTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [foodContent, setFoodContent] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [menuCategory, setMenuCategory] = useState('밑 반찬'); // 기본값을 '전체'로 설정
  const [difficulty, setDifficulty] = useState(1); // 기본 난이도는 '보통'
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지 상태 관리
  const [selectedImageView, setSelectedImageView] = useState(null); // 선택한 이미지 출력 상태 관리
  const navigate = useNavigate(); // useNavigate 훅 사용


  /**
   * 이미지 선택 핸들러
   * 임시저장이라 npm restart하게 되면 기존 이미지.. 다 날라갑니다..!! AWS S3를 연동을 안했기에 어쩔수 없는 상황..
   * 이로 인해 GET blob:http://localhost:3000/d4ce75f4-39d1-42e1-a35a-41f6c980644f net::ERR_FILE_NOT_FOUND 
   * 가 계속 Web F12 Console에 뜰꺼에요 참고하세요
   * 
   * @return : 파일을 선택했을 때 URL로 변환해서 이미지 미리보기가능하게 선택된이미지 임시 저장
   * 
   * @Author : 신민준
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSelectedImageView(URL.createObjectURL(file))
    }
  };

  
  /**
   * 선택한 MenuCategory 저장 메서드
   * 
   * @return : 선택한 MenuCategory 저장
   * 
   * @Author : 신민준
   */
  const handleSelectCategoryChange = (e) => {
    setMenuCategory(e.target.value); // 사용자가 선택한 값을 상태에 저장
  };


  /**
   * 선택한 Difficulty 저장 메서드
   * 
   * @return : 선택한 Difficulty 저장
   * 
   * @Author : 신민준
   */
  const handleDifficultyChange = (value) => {
    setDifficulty(value);
  };


  /**
   * 게시판 수정 및 추가 창에서 난이도 그래프를 선택했을 때, axios에 난이도 정보를 보내주기 위한 
   * difficulty.Enum에 맞춰 변환
   * 
   * @return : difficulty integer 값을 difficulty.Enum(type=String)으로 변환된 값 반환
   * 
   * @Author : 신민준
   */
  const handleGetDifficulty = (difficulty) => {
    switch(difficulty){
      case 1:
        return 'DIFFICULTY_EASY'; 
      case 2:
        return 'DIFFICULTY_MEDIUM'; 
      default:
        return 'DIFFICULTY_HARD'; 
    }
  }

  /**
   * 선택한 MenuCategory를 axios를 통해 body값에 보낼 수 있는 유효한 명칭으로 보내기 위해
   * 변환해주는 메서드
   * 
   * @return : 한글로 적힌 MenuCategory를 BE의 MenuCategory.Enum에 맞게 변환
   * 
   * @Author : 신민준
   */
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

  /**
   * 작성된 게시글 또는 수정된 게시글의 정보를 axios로 BE에 전송하기 위한 메서드
   * 
   * @return : 결과를 alert로 반환
   * 
   * @Author : 신민준
   */
  const handleSubmit = async () => {
    const formData = new FormData();
  
    // formData에 텍스트 필드 추가
    formData.append('title', title);
    formData.append('boardContent', boardContent);
    formData.append('foodContent', foodContent);
    formData.append('recipeContent', recipeContent);
    formData.append('cookingTime', cookingTime);
    formData.append('servingSize', servingSize);
    formData.append('difficulty', handleGetDifficulty(difficulty));
    formData.append('menuCategory', handleGetMenuCategory(menuCategory));
    // 이미지 파일 추가
    if (selectedImage) {
      formData.append('imageFile', selectedImage); // 이미지 파일 객체 자체를 formData에 추가
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + 'boards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // form-data 형식으로 전송
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log('데이터 전송 성공:', response.data);
      alert('게시글 업로드 성공 했습니다.');
      navigate('/board');
    } catch (error) {
      console.error('데이터 전송 실패:', error);
      alert('게시글 업로드 실패 했습니다.');
    }
  };

  return (
    <Container>
      <TextContainer>
        <SectionTitle>요리 정보</SectionTitle>
        <Divider />
        <Title>메뉴 종류</Title>
        <InputGroup2_1thLine>
          <Select value={menuCategory} onChange={handleSelectCategoryChange}>
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
            {selectedImageView ? (
              <PreviewImage src={selectedImageView} alt="Selected" />
            ) : (
              'image'
            )}
          </ImagePlaceholder>
        </ImageContainer>

        <Title>메뉴 이름</Title>
        <Input
          type="text"
          placeholder="메뉴 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 입력값 상태로 저장
        />

        <Title>메뉴 설명</Title>
        <TextArea
          placeholder="메뉴 설명"
          value={boardContent}
          onChange={(e) => setBoardContent(e.target.value)} // 입력값 상태로 저장
        />

        <InfoRow>
          <InfoInputContainer>
            <Title>음식양 (인분)</Title>
            <SmallInput
              type="text"
              placeholder="숫자로만 작성해 주세요"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)} // 입력값 상태로 저장
            />
          </InfoInputContainer>
          <InfoInputContainer>
            <Title>소요 시간 (분)</Title>
            <SmallInput
              type="text"
              placeholder="분 단위로 작성해주세요"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)} // 입력값 상태로 저장
            />
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
        <TextArea
          placeholder="재료"
          value={foodContent}
          onChange={(e) => setFoodContent(e.target.value)} // 입력값 상태로 저장
        />

        <SectionTitle>레시피</SectionTitle>
        <Divider />
        <TextArea
          placeholder="레시피"
          value={recipeContent}
          onChange={(e) => setRecipeContent(e.target.value)} // 입력값 상태로 저장
        />

        <SubmitButton onClick={handleSubmit}>올리기</SubmitButton> {/* 제출 핸들러 연결 */}
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

const InputGroup2_1thLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #2D9CDB;
  border-radius: 5px;
  background-color: #f5f5f5;
  width: 40vh; /* 각 InputGroup의 너비 */
  height: 30px;
  justify-content: center; /* 가운데 정렬 */
  margin-right: 10px; /* 두 그룹 사이에 간격 추가 */
`;
const Select = styled.select`
  flex: 1;
  padding: 0 20px;
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
  padding-right: 30px; 
`;

export default BoardAdd;
