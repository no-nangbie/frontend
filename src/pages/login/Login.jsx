import React from 'react';
import styled from 'styled-components';

function Login() {
  return (
    <Container>
      {/* 상단 헤더 */}
      <Header>
        <Heading>로그인</Heading>
      </Header>

      {/* 로그인 박스 */}
      <LoginBox>
        {/* 로고 아이콘 */}
        <Logo>
          <LogoImg src="/path-to-your-logo.png" alt="logo" />
        </Logo>

        {/* 아이디 입력 */}
        <InputGroup>
          <Label>아이디</Label>
          <TextArea type="text" placeholder="아이디를 입력하세요" />
        </InputGroup>

        {/* 비밀번호 입력 */}
        <InputGroup>
          <Label>비밀번호</Label>
          <TextArea type="password" placeholder="비밀번호를 입력하세요" />
        </InputGroup>

        {/* 로그인 버튼 */}
        <LoginButton>로그인</LoginButton>

        {/* 회원가입 링크 */}
        <SignupLink>
          <SignupAnchor href="/signup">회원 가입</SignupAnchor>
        </SignupLink>
      </LoginBox>
    </Container>
  );
}

export default Login;

// Styled Components 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f2f2f2;
  max-width: 730px;
  width: 100%;
  margin: 0 auto;
`;

const Header = styled.header`
  width: 100%;
  background-color: #2D9CDB;
  height: 50px;
  text-align: left;
  color: white;
  display: flex;
  align-items: center;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  text-indent: 20px;
`;

const LoginBox = styled.div`
  background-color: white;
  border: 2px solid #2D9CDB;
  border-radius: 10px;
  padding: 30px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 25vh;
`;

const Logo = styled.div`
  margin-bottom: 20px;
`;

const LogoImg = styled.img`
  width: 80px;
  height: 80px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #2D9CDB;
  border-radius: 30px;
  background-color: #f5f5f5;
`;

const Label = styled.div`
  width: 70px;
  background-color: white;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
  border-right: 2px solid #2D9CDB;
  border-radius: 20px 0 0 20px;
  border-right: 2px solid #2D9CDB;
`;

const TextArea = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  font-size: 14px;
  outline: none;
  border-radius: 0 30px 30px 0;
`;

const LoginButton = styled.button`
  background-color: #2D9CDB;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignupLink = styled.div`
  margin-top: 10px;
`;

const SignupAnchor = styled.a`
  text-decoration: none;
  font-weight: bold;
  color: #333;

  &:hover {
    color: #2D9CDB;
  }
`;
