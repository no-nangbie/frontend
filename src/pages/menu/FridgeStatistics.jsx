// FridgeStatistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import NumberCounter from '../../component/NumberCounter'; // NumberCounter 컴포넌트 임포트

const queryClient = new QueryClient();

const FridgeStatistics = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery('fridgeStatistics', fetchStatistics, {
    staleTime: 0,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (data && typeof data.foodManagerScore === 'number') {
      let start = 0;
      const end = data.foodManagerScore;
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const currentScore = Math.round(progress * end);
          setAnimatedScore(currentScore);
          requestAnimationFrame(animate);
        } else {
          setAnimatedScore(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [data]);

  if (isLoading) {
    return <Loading>로딩 중...</Loading>;
  }

  if (isError) {
    return <Error>에러 발생: {error.message}</Error>;
  }

  const score = data.foodManagerScore;
  const expiredItems = data.expireFoodCount;
  const inputItems = data.inputFoodCount;
  const outputItems = data.outputFoodCount;

  const radius = 90;
  const strokeWidth = 20;
  const centerX = 100;
  const centerY = 120;

  const pathData = getArcPath(centerX, centerY, radius);
  const totalLength = calculateArcLength(radius, -220, 40);
  const offset = totalLength * (1 - animatedScore / 100);

  // 계산된 값들
  const adjustedInputItems = inputItems * 0.25 > 20 ? 20 : inputItems * 0.25;
  const adjustedOutputItems = outputItems > 80 ? 80 : outputItems;
  const adjustedExpiredItems = expiredItems > 0 ? Math.round((expiredItems / outputItems) * adjustedOutputItems) : 0;

  return (
    <MainContainer>
      <Header>
        <ActionButtons>
          <ActionButton isFirst onClick={() => navigate('/menu/statistics/1')}>
            냉장고 통계
          </ActionButton>
          <ActionButton onClick={() => navigate('/menu/statistics/2')}>
            요리 통계
          </ActionButton>
        </ActionButtons>
      </Header>

      <ScoreContainer>
        <div style={{ position: 'relative' }}>
          <CircularProgressBar width={200} height={200} viewBox="0 0 200 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" stopColor="#00b4db" />
                <stop offset="100%" stopColor="#8a2be2" />
              </linearGradient>
            </defs>
            <path
              d={pathData}
              stroke="#e6e6e6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedPath
              d={pathData}
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={totalLength}
              strokeDashoffset={offset}
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
            <ScoreText>{animatedScore}점</ScoreText>
            <ScoreLabel>관리점수</ScoreLabel>
          </div>
        </div>
      </ScoreContainer>

      {/* Category Section */}
      <CategoryGrid>
        <SectionTitle>통계</SectionTitle>
        <Dividers />
        <AdditionalInfo>
          <LeftLabel>추가된 총 식료품 개수</LeftLabel>
          <CenterCount><NumberCounter end={inputItems} suffix="개" /></CenterCount>
          <RightLabel>+ <NumberCounter end={adjustedInputItems}/></RightLabel>
        </AdditionalInfo>
        <AdditionalInfo>
          <LeftLabel>사용된 총 식료품 개수</LeftLabel>
          <CenterCount><NumberCounter end={outputItems} suffix="개" /></CenterCount>
          <RightLabel>+ <NumberCounter end={adjustedOutputItems}/></RightLabel>
        </AdditionalInfo>
        <AdditionalInfo>
          <LeftLabel color="red">만료된 총 식료품 개수</LeftLabel>
          <CenterCount color="red"><NumberCounter end={expiredItems} suffix="개" /></CenterCount>
          <RightLabel color="red">
            - <NumberCounter end={adjustedExpiredItems} />
          </RightLabel>
        </AdditionalInfo>
      </CategoryGrid>
    </MainContainer>
  );
};

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

// 데이터를 가져오는 함수
const fetchStatistics = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}statistics`, {
    params: { page: 'fridge' },
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data.data;
};

// React Query 클라이언트 프로바이더로 감싸기
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FridgeStatistics />
    </QueryClientProvider>
  );
};

export default App;

// Styled Components
const MainContainer = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.header`
  background-color: #d9d9d9;
  padding: 20px;
  width: 100%;
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
  width: 250px;
  height: 250px;
`;

const AnimatedPath = styled.path`
  transition: stroke-dashoffset 1s ease;
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
  width: 90%;
`;

const SectionTitle = styled.h3`
  text-align: left;
  color: #2d9cdb;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-left: -10px;
`;

const Dividers = styled.div`
  border: 0;
  height: 2px;
  background-color: #2d9cdb;
  margin-left: -30px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const AdditionalInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr; /* 첫 번째 열을 두 배 넓게 설정 */
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  gap: 10px; /* 요소 간 간격 조정 */
`;

const LeftLabel = styled.div`
  font-weight: bold;
  text-align: left;
  font-size: 16px;
  color: ${(props) => props.color || '#00a3ff'};
`;

const CenterCount = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.color || '#00a3ff'};
`;

const RightLabel = styled.div`
  font-weight: bold;
  text-align: right;
  font-size: 16px;
  color: ${(props) => props.color || '#00a3ff'};
`;

// 로딩 및 에러 상태 스타일링
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
`;

const Error = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;
