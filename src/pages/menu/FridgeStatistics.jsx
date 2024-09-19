import React from 'react';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import styled from 'styled-components';

// 데이터를 가져오는 함수 정의
const fetchStatistics = async () => {
  const response = await axios.get(process.env.REACT_APP_API_URL + 'statistics', {
    params: { page: 'a' },
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data.data;
};

// React Query 클라이언트 생성
const queryClient = new QueryClient();

const FridgeStatistics = () => {
  const { data, isLoading, isError, error } = useQuery('statistics', fetchStatistics);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  // 서버에서 받은 데이터를 사용
  const score = data.foodManagerScore; // 점수 값 (0 ~ 100)
  const expiredItems = data.expireFoodCount; // 만료된 식료품 개수
  const inputItems = data.inputFoodCount; // 거처간 식료품 개수
  const outputItems = data.outputFoodCount;

  const radius = 90;
  const strokeWidth = 20;
  const centerX = 100;
  const centerY = 120;

  const pathData = getArcPath(centerX, centerY, radius);
  const totalLength = calculateArcLength(radius, -220, 40);
  const offset = totalLength * (1 - score / 100);

  return (
    <MainContainer>
      {/* Header Section */}
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
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
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
          <CategoryLabel>거처간 식료품</CategoryLabel>
          <ItemCount>{inputItems}개</ItemCount>
        </CategoryItem>
        <CategoryItem>
          <CategoryLabel>사용된 식료품</CategoryLabel>
          <ItemCount>{outputItems}개</ItemCount>
        </CategoryItem>
        <CategoryItem>
          <CategoryLabel>만료된 식료품</CategoryLabel>
          <ItemCount>{expiredItems}개</ItemCount>
        </CategoryItem>
      </CategoryGrid>
    </MainContainer>
  );
};

// 최상위 컴포넌트에서 QueryClientProvider로 감싸기
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FridgeStatistics />
    </QueryClientProvider>
  );
};

export default App;

// 아치형 경로 생성 함수 (각도를 조절)
const getArcPath = (cx, cy, r) => {
  const startAngle = -220;
  const endAngle = 40;

  const start = (Math.PI / 180) * startAngle;
  const end = (Math.PI / 180) * endAngle;

  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

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
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
`;

const Header = styled.header`
  background-color: #d9d9d9;
  padding: 20px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 15px 15px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 105%;
  max-width: 600px;
`;

const ActionButton = styled.button`
  background-color: #ffffff;
  color: black;
  border: 2px solid #2d9cdb;
  border-radius: ${(props) => (props.isFirst ? '20px 0 0 20px' : '0 20px 20px 0')};
  padding: 10px 40px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 320px;
  height: 50px;
  font-size: 16px;
  text-align: center;
  overflow: hidden;
  font-weight: bold;
  white-space: nowrap;
  padding-left: 15px;

  &:hover {
    background-color: #e7f1ff;
  }

  &:not(:last-child) {
    margin-right: 0;
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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

const CategoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 90%;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #00a3ff;
  border-radius: 10px;
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  color: #00a3ff;
  font-size: 18px;
  text-align: left;
`;

const CategoryLabel = styled.div`
  font-size: 18px;
  color: #00a3ff;
`;

const ItemCount = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #00a3ff;
`;

