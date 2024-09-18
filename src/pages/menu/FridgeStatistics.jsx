import styled from 'styled-components';
import React from 'react';

const FridgeStatistics = () => {
  const score = 100; // 점수 값 (0 ~ 100)

  const radius = 90;
  const strokeWidth = 20;
  const centerX = 100;
  const centerY = 120;

  // 아치형 경로 생성 (각도를 조절하여 아치를 더 아래로 확장)
  const pathData = getArcPath(centerX, centerY, radius);

  // 경로의 전체 길이
  const totalLength = calculateArcLength(radius, -230, 40);

  // 점수에 따른 strokeDashoffset 계산
  const offset = totalLength * (1 - score / 100);

  return (
    <MainContainer>
      {/* Search Section */}
      <Header>
        <ActionButtons>
          <ActionButton isFirst>냉장고 통계</ActionButton>
          <ActionButton>요리 통계</ActionButton>
        </ActionButtons>
      </Header>

      {/* Score Section */}
      <ScoreContainer>
        <div style={{ position: 'relative' }}>
          <CircularProgressBar width={200} height={200} viewBox="0 0 200 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00b4db" />
                <stop offset="100%" stopColor="#8a2be2" />
              </linearGradient>
            </defs>
            {/* 배경 아치 */}
            <path
              d={pathData}
              stroke="#e6e6e6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* 프로그레스 바 */}
            <path
              d={pathData}
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={totalLength}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </CircularProgressBar>
          <div
            style={{
              position: 'absolute',
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <ScoreText>{score}점</ScoreText>
            <ScoreLabel>관리점수</ScoreLabel>
          </div>
        </div>
      </ScoreContainer>

      {/* Category Section */}
      <CategoryGrid>
        <CategoryItem>
          거처간 식료품
          <SmallText>12개</SmallText>
        </CategoryItem>
        <CategoryItem>
          만료된 식료품
          <SmallText>5개</SmallText>
        </CategoryItem>
        <CategoryItem />
        <CategoryItem />
      </CategoryGrid>
    </MainContainer>
  );
};

export default FridgeStatistics;

// 아치형 경로 생성 함수 (각도를 조절)
const getArcPath = (cx, cy, r) => {
  // 시작 각도와 종료 각도 (단위: 도)
  const startAngle = -220;
  const endAngle = 40;

  // 각도를 라디안으로 변환
  const start = (Math.PI / 180) * startAngle;
  const end = (Math.PI / 180) * endAngle;

  // 시작점 계산
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);

  // 종료점 계산
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

  // 큰 호(large-arc-flag)와 방향(sweep-flag) 설정
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const sweepFlag = '1';

  return `M ${x1},${y1} A ${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${x2},${y2}`;
};

// 아치형 길이 계산 함수
const calculateArcLength = (r, startAngle, endAngle) => {
  const angle = ((endAngle - startAngle) * Math.PI) / 180;
  return r * angle;
};

// Styled Components
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

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const CategoryItem = styled.div`
  border: 2px solid #00a3ff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  color: #00a3ff;
  font-size: 18px;
`;

const SmallText = styled.div`
  font-size: 12px;
  color: #00a3ff;
  margin-top: 10px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
`;

const CircularProgressBar = styled.svg`
  width: 200px;
  height: 200px;
`;

const ScoreText = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
`;

const ScoreLabel = styled.div`
  font-size: 18px;
  color: #666;
`;
