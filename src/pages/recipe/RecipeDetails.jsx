import React from 'react';
import styled from 'styled-components';
import menu_1 from '../../resources/sample/menu_1.png';
import user_icon from '../../resources/icon/user.png';
import timer_icon from '../../resources/icon/timer.png';
import cook_icon from '../../resources/icon/cook.png';
import like_icon from '../../resources/icon/heart_red.png'; 

import difficulty1_icon from '../../resources/icon/difficulty_1.png';
import difficulty2_icon from '../../resources/icon/difficulty_2.png';
import difficulty3_icon from '../../resources/icon/difficulty_3.png';

const RecipeDetails = () => {
  return (
    <Container>
      <ImageContainer>
        <Image src={menu_1} alt="돼지고기 김치찌개" />
        <LikeButton onClick={() => alert('초록 버튼 클릭됨!')}>
          <LikeButtonImage src={like_icon} alt="Button Icon" /> 
        </LikeButton> {/* 초록색 버튼 */}
      </ImageContainer>
      <TextContainer>
        <Title>돼지고기 김치찌개</Title>
        <Dividers/>
        <Description>진한 국물이 맛있는 돼지고기 김치찌개 입니다.</Description>
        <InfoContainer>
            <InfoItem>
              <Icon src={user_icon} alt="관리자" />
              관리자
            </InfoItem>
            <InfoItem>
              <Icon src={cook_icon} alt="3인분" />
              3인분
            </InfoItem>
          </InfoContainer>
          <InfoContainer>
            <InfoItem>
              <Icon src={timer_icon} alt="30분" />
              30분
            </InfoItem>
            <InfoItem>
              <Icon src={difficulty1_icon} alt="쉬움" />
              쉬움
            </InfoItem>
        </InfoContainer>
        <Ingredients>
          <Title>재료</Title>
          <Dividers/>
          <ul>
            <li><Span>물</Span><Span>250ml</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
            <Uldividers/>
            <li><Span>돼지고기 [찌개용]</Span><Span>250g</Span></li>
            <Uldividers/>
            <li><Span>김치</Span><Span>200g</Span></li>
            <Uldividers/>
            <li><Span>양파</Span><Span>반 개</Span></li>
            <Uldividers/>
            <li><Span>고추</Span><Span>2개</Span></li>
          </ul>
        </Ingredients>
        <ButtonContainer>
          <ActionButton>레시피 보기</ActionButton>
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
  height: 100%; /* Limit height of the scrollable area */
  overflow-y: auto; /* 세로 스크롤 가능하게 설정 */
  overflow-x: hidden;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative; /* 자식 요소가 절대 위치를 가질 수 있도록 설정 */
  height: 50vh; /* 이미지 높이를 뷰포트 높이의 50%로 설정 */
  border-radius: 0 0 30px 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const LikeButton = styled.button`
  position: absolute;
  bottom: 0px; /* 이미지 아래쪽에서 0px 위치 */
  right: 0px; /* 이미지 오른쪽에서 0px 위치 */
  width: 60px; /* 버튼 너비 */
  height: 60px; /* 버튼 높이 */
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
  width: 30px; /* 이미지 너비 */
  height: 30px; /* 이미지 높이 */
`;

const Span = styled.div`
  margin: 0 30px 0px 30px;
`
const Dividers = styled.div`
  border: 0;
  height: 2px;
  background-color: #2D9CDB; /* 원하는 색상으로 변경 */
  margin: 0 0; /* 위아래 여백 조정 */
`;
const Uldividers = styled.div`
  border: 0;
  height: 1px;
  background-color: #D9D9D9; /* 원하는 색상으로 변경 */
  margin: 0 0; /* 위아래 여백 조정 */
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
  flex-direction: row; /* 아이콘과 텍스트를 위아래로 배치 */
  align-items: center; /* 텍스트 길이와 상관없이 아이콘 중앙에 위치 */
  font-size: 12px;
  color: #333;
  width: 300px; /* 고정된 너비로 아이템의 위치 고정 */
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px; /* 아이콘과 텍스트 사이에 간격 추가 */
`;

const Ingredients = styled.div`
  text-align: left;
  margin: 20px 0;

  h2 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between; /* 재료와 양을 양쪽 끝에 배치 */
    }
  }
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
  padding: 10px 40px; /* 버튼이 길어지도록 padding 설정 */
  border: 2px solid #2D9CDB; /* 파란색 테두리 */
  border-radius: 10px; /* 둥근 모서리 */
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  
  &:hover {
    background-color: #f0f0f0; /* hover 시 배경색 변경 */
  }
`;

export default RecipeDetails;
