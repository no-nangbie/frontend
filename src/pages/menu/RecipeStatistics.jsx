import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell } from 'recharts';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

const COLORS = ['#00C49F', '#82ca9d', '#FFBB28', '#0088FE', '#FF8042'];

// 데이터를 가져오는 함수 정의
const fetchStatistics = async () => {
  const response = await axios.get(process.env.REACT_APP_API_URL + 'statistics', {
    params: { page: 'recipe' },
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data.data; // 서버에서 받은 실제 데이터 형태에 맞춰서 수정
};

// React Query 클라이언트 생성
const queryClient = new QueryClient();

const RecipeStatistics = () => {
  // 서버에서 받아온 데이터를 fetchData로 설정
  const { data: fetchData, isLoading, isError, error } = useQuery('statistics', fetchStatistics);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  // 받아온 데이터를 이용해 파이차트에 표시
  return (
    <Container>
      <Header>
        <Title>마이페이지</Title>
        <TabContainer>
          <TabButton active>냉장고 통계</TabButton>
          <TabButton>요리 통계</TabButton>
        </TabContainer>
      </Header>

      <Content>
        <StyledPieChart width={150} height={150}>
          <Pie
            data={fetchData} // 서버에서 받아온 데이터를 사용
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {fetchData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </StyledPieChart>

        <InfoCard>
          <Label>거처간 식료품</Label>
          <Count>0개</Count>
        </InfoCard>
        <InfoCard>
          <Label>사용된 식료품</Label>
          <Count>0개</Count>
        </InfoCard>
        <InfoCard>
          <Label>만료된 식료품</Label>
          <Count>0개</Count>
        </InfoCard>
      </Content>

      <Footer>
        <FooterButton>나의 냉장고</FooterButton>
        <FooterButton>레시피</FooterButton>
        <FooterButton>게시판</FooterButton>
        <FooterButton active>마이페이지</FooterButton>
      </Footer>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  height: 100vh;
`;

const Header = styled.div`
  background-color: #4db0ff;
  width: 100%;
  padding: 16px;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 18px;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

const TabButton = styled.button`
  background-color: ${(props) => (props.active ? '#fff' : '#e0e0e0')};
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 8px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const StyledPieChart = styled(PieChart)`
  margin: 20px 0;
`;

const InfoCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #4db0ff;
  margin: 8px 0;
`;

const Label = styled.span`
  font-size: 14px;
`;

const Count = styled.span`
  font-size: 14px;
  color: #4db0ff;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: white;
  border-top: 1px solid #ccc;
  padding: 10px 0;
  width: 100%;
`;

const FooterButton = styled.button`
  border: none;
  background: none;
  font-size: 12px;
  color: ${(props) => (props.active ? '#4db0ff' : '#aaa')};
  cursor: pointer;

  &:hover {
    color: #4db0ff;
  }
`;
