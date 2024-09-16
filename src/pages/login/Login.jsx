import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from "../../resources/icon/logo.png";

function Login() {
  // 이메일과 비밀번호를 상태로 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    console.log("로그인 버튼이 클릭되었습니다."); // 버튼 클릭 확인을 위한 로그
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        const accessToken = response.headers['authorization'];
        // const refreshToken = response.headers['refresh'];
  
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('email', email);
        // localStorage.setItem('refreshToken', refreshToken);
  
        alert('로그인 성공!');
        window.location.href = '/';
      }
    } catch (error) {
      console.error("로그인 실패: ", error);
      setErrorMessage('로그인 실패: 이메일이나 비밀번호를 확인해주세요.');
    }
  };
  

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
          <LogoImg src={logo} alt="logo" />
        </Logo>

        {/* 이메일 입력 */}
        <InputGroup>
          <Label>이메일</Label>
          <TextArea
            type="text"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 입력 시 상태 업데이트
          />
        </InputGroup>

        {/* 비밀번호 입력 */}
        <InputGroup>
          <Label>비밀번호</Label>
          <TextArea
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 시 상태 업데이트
          />
        </InputGroup>

        {/* 로그인 버튼 */}
        <LoginButton onClick={handleLogin}>로그인</LoginButton>

        {/* 에러 메시지 출력 */}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #dfdfdf;
  border-radius: 30px;
  background-color: #f5f5f5;
`;

const Label = styled.div`
  width: 80px;
  background-color: #F3F3F3;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
  border-radius: 20px 0 0 20px;
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

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 10px;
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
