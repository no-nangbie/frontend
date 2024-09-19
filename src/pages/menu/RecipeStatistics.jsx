import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useNavigate } from 'react-router-dom';

// React Query 클라이언트 생성
const queryClient = new QueryClient();

// 파이 차트에 사용할 색상 배열
const COLORS = [
  '#00C49F', '#82ca9d', '#FFBB28', '#0088FE', '#FF8042',
  '#A020F0', '#FF6347', '#FFD700', '#40E0D0', '#FF69B4'
];

// 데이터를 가져오는 함수 정의
const fetchStatistics = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}statistics`, {
    params: { page: 'recipe' },
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data.data;
};

const RecipeStatistics = () => {
  const navigate = useNavigate();
  // 서버에서 받아온 데이터를 fetchData로 설정
  const { data: fetchData, isLoading, isError, error } = useQuery(
    'statistics',
    fetchStatistics,
    {
      staleTime: Infinity, // 데이터가 변경되지 않는다고 가정
      cacheTime: Infinity, // 캐시 유지 시간 설정
    }
  );

  if (isLoading) {
    return <Loading>로딩 중...</Loading>;
  }

  if (isError) {
    return <Error>에러 발생: {error.message}</Error>;
  }
  const ChangeTextToKorean = (e) => {
    switch(e){
      case "menuCategorySide":
        return "밑 반찬"
      case "menuCategorySoup":
        return "국/찌개"
      case "menuCategoryDessert":
        return "디저트"
      case "menuCategoryNoodle":
        return "면"
      case "menuCategoryRice":
        return "밥/죽/떡"
      case "menuCategoryKimchi":
        return "김치"
      case "menuCategoryFusion":
        return "퓨전"
      case "menuCategorySeasoning":
        return "양념"
      case "menuCategoryWestern":
        return "양식"
      case "menuCategoryEtc":
        return "기타"
      case "menuDifficultyEasy":
        return "쉬움"
      case "menuDifficultyMedium":
        return "보통"
      case "menuDifficultyHard":
        return "어려움"
      case "menuCookTime0To1Hours":
        return "1시간 미만"
      case "menuCookTime1HoursTo2Hours":
        return "1시간~2시간"
      case "menuCookTime2HoursTo4Hours":
        return "2시간~4시간"
      case "menuCookTime4HoursOver":
        return "4시간 이상"
    }
  }


  // API 응답 데이터 중 "menuCategory..." 필드만 추출하여 파이 차트 데이터로 변환
  const menuCategoryData = Object.entries(fetchData)
    .filter(([key, value]) => key.startsWith('menuCategory') && value > 0)
    .map(([key, value]) => {
      // 키를 사람이 읽기 쉬운 형식으로 변환 (예: menuCategorySoup -> Soup)
      const name = ChangeTextToKorean(key)
      // 대소문자 변환 및 공백 추가 (예: menuCategoryNoodle -> Noodle)
      const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
      return { name: formattedName, value };
    })
    .sort((a, b) => b.value - a.value); // value가 큰 순서대로 정렬

  // API 응답 데이터 중 "menuDifficulty..." 필드만 추출하여 파이 차트 데이터로 변환
  const menuDifficultyData = Object.entries(fetchData)
  .filter(([key, value]) => key.startsWith('menuDifficulty') && value >= 0)
  .map(([key, value]) => {
    // 키를 사람이 읽기 쉬운 형식으로 변환 (예: menuCategorySoup -> Soup)
      const name = ChangeTextToKorean(key)
    // 대소문자 변환 및 공백 추가 (예: menuCategoryNoodle -> Noodle)
    const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
    return { name: formattedName, value };
  })
  .sort((a, b) => b.value - a.value); // value가 큰 순서대로 정렬

  // API 응답 데이터 중 "menuCookTime..." 필드만 추출하여 파이 차트 데이터로 변환
  const menuCookTimeData = Object.entries(fetchData)
  .filter(([key, value]) => key.startsWith('menuCookTime') && value >= 0)
  .map(([key, value]) => {
    // 키를 사람이 읽기 쉬운 형식으로 변환 (예: menuCategorySoup -> Soup)
      const name = ChangeTextToKorean(key)
    // 대소문자 변환 및 공백 추가 (예: menuCategoryNoodle -> Noodle)
    const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
    return { name: formattedName, value };
  })
  .sort((a, b) => b.value - a.value); // value가 큰 순서대로 정렬

  // 상위 3개의 menuCategory만 추출
  const topThreePieData = menuCategoryData.slice(0, 3);

  return (
    <Container>
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

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip />
            <Pie
              data={menuCategoryData} // 전체 데이터를 파이 차트에 사용
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {menuCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <CategoryGrid>
          <SectionTitle>통계</SectionTitle>
          <Dividers />
          <AdditionalInfo>
            <LeftLabel>가장 많이 요리한 Category</LeftLabel>
          </AdditionalInfo>
        </CategoryGrid>
        
        <InfoContainer>
          {topThreePieData.map((item, index) => (
            <InfoCard key={index}>
              <ColorBox color={COLORS[index % COLORS.length]} />
              <Label>{index+1}등 : {item.name}</Label>
              <Count>{item.value}개</Count>
            </InfoCard>
          ))}
        </InfoContainer>

        <CategoryGrid>
        <AdditionalInfo>
            <LeftLabel>이용한 레시피 난이도 통계</LeftLabel>
          </AdditionalInfo>
        </CategoryGrid>

        <InfoContainer>
          {menuDifficultyData.map((item, index) => (
            <InfoCard key={index}>
              <Label>{index+1}등 : {item.name}</Label>
              <Count>{item.value}회</Count>
            </InfoCard>
          ))}
        </InfoContainer>

        <CategoryGrid>
        <AdditionalInfo>
            <LeftLabel>이용한 레시피 조리시간 통계</LeftLabel>
          </AdditionalInfo>
        </CategoryGrid>

        <InfoContainer>
          {menuCookTimeData.map((item, index) => (
            <InfoCard key={index}>
              <Label>{index+1}등 : {item.name}</Label>
              <Count>{item.value}회</Count>
            </InfoCard>
          ))}
        </InfoContainer>


    </Container>
  );
};

// React Query 클라이언트 프로바이더로 감싸기
const App = () => (
  <QueryClientProvider client={queryClient}>
    <RecipeStatistics />
  </QueryClientProvider>
);

export default App;

// Styled Components
const Container = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 105%;
  max-width: 600px;
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
const CategoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: ${(props) => (props.noMargin ? '0px' : '20px')};
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

// 수정된 AdditionalInfo와 Label 컴포넌트
const AdditionalInfo = styled.div`
  display: grid;
  // grid-template-columns: 2fr 1fr 1fr; /* 첫 번째 열을 두 배 넓게 설정 */
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  gap: 10px; /* 요소 간 간격 조정 */
`;

const InfoContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #4db0ff;
  margin: 5px 0;
  font-family: 'Pretendard', sans-serif; /* 폰트 패밀리 지정 */
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  margin-right: 12px;
`;

const Label = styled.span`
  flex-grow: 1;
  font-size: 16px;
  color: #333;
  font-family: 'Pretendard', sans-serif; /* 폰트 패밀리 지정 */
`;

const Count = styled.span`
  font-size: 16px;
  color: #4db0ff;
  font-family: 'Pretendard', sans-serif; /* 폰트 패밀리 지정 */
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
