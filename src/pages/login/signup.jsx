import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../../resources/icon/logo.png';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const requestAuthCode = async () => {
    try {
      await axios.post('http://localhost:8080/auth-code', { email });
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      setErrorMessage('인증 코드 요청 실패: 이메일을 확인해주세요.');
    }
  };

  const verifyAuthCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/verify-auth-code', {
        email,
        authCode,
      });

      if (response.status === 200) {
        setEmailVerified(true);
        alert('이메일 인증이 완료되었습니다.');
      }
    } catch (error) {
      setErrorMessage('인증 코드가 올바르지 않습니다.');
    }
  };

  const checkNickname = async () => {
    try {
      const response = await axios.get('http://localhost:8080/nickname-check', {
        params: { nickname },
      });

      if (response.data === 'NickName available') {
        setNicknameAvailable(true);
        alert('사용 가능한 닉네임입니다.');
      } else {
        setNicknameAvailable(false);
        setErrorMessage('이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      setNicknameAvailable(false);
      setErrorMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!emailVerified) {
      setErrorMessage('이메일 인증이 필요합니다.');
      return;
    }

    if (!nicknameAvailable) {
      setErrorMessage('닉네임 중복 확인이 필요합니다.');
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setErrorMessage('비밀번호는 8자에서 15자 사이여야 합니다.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 8) {
      setErrorMessage('닉네임은 2자 이상 8자 이하로 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/signup', {
        email,
        password,
        confirmPassword,
        nickname,
      });

      if (response.status === 201) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
          setErrorMessage(
              error.response.data.map((err) => err.defaultMessage || err.message).join(', ')
          );
        } else if (error.response.data.errors) {
          setErrorMessage(
              error.response.data.errors.map((err) => err.defaultMessage || err.message).join(', ')
          );
        } else {
          setErrorMessage(
              error.response.data.message || '회원가입에 실패했습니다. 입력 내용을 확인해주세요.'
          );
        }
      } else {
        setErrorMessage('회원가입에 실패했습니다. 입력 내용을 확인해주세요.');
      }
    }
  };

  return (
      <Container>
        <Header>
          <Heading>회원가입</Heading>
        </Header>

        <SignupBox>
          <Logo>
            <LogoImg src={logo} alt="logo" />
          </Logo>

          <SectionTitle>이메일 & 아이디</SectionTitle>
          <InputGroup>
            <Label>이메일</Label>
            <TextArea
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label>인증 키</Label>
            <TextArea
                type="text"
                placeholder="인증 키를 입력하세요"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
            />
          </InputGroup>
          <ButtonGroup>
            <SmallButton onClick={requestAuthCode}>인증 요청</SmallButton>
            <SmallButton onClick={verifyAuthCode}>인증 확인</SmallButton>
          </ButtonGroup>

          <SectionDivider />

          <SectionTitle>비밀번호</SectionTitle>
          <InputGroup>
            <Label>비밀번호</Label>
            <TextArea
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label>비밀번호 확인</Label>
            <TextArea
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputGroup>

          <SectionDivider />

          <SectionTitle>닉네임</SectionTitle>
          <InputGroup>
            <Label>닉네임</Label>
            <TextArea
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
          </InputGroup>
          <ButtonGroup>
            <SmallButton onClick={checkNickname}>중복 확인</SmallButton>
          </ButtonGroup>

          {nicknameAvailable === false && (
              <ErrorMessage>이미 사용 중인 닉네임입니다.</ErrorMessage>
          )}
          {nicknameAvailable === true && (
              <SuccessMessage>사용 가능한 닉네임입니다.</SuccessMessage>
          )}

          <SignupButton onClick={handleSignup}>회원 가입 하기</SignupButton>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </SignupBox>
      </Container>
  );
}

export default Signup;

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
  background-color: #2d9cdb;
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

const SignupBox = styled.div`
  background-color: white;
  border: 2px solid #2d9cdb;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5vh;
`;

const Logo = styled.div`
  margin-bottom: 20px;
`;

const LogoImg = styled.img`
  width: 120px;
  height: 70px;
`;

const SectionTitle = styled.h3`
  text-align: left;
  color: #2d9cdb;
  font-size: 14px;
  margin-bottom: 10px;
  border-bottom: 2px solid #2d9cdb;
  padding-bottom: 5px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: 2px solid #2d9cdb;
  border-radius: 30px;
  background-color: #f5f5f5;
`;

const Label = styled.div`
  width: 90px;
  background-color: white;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
  border-right: 2px solid #2d9cdb;
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

const SectionDivider = styled.div`
  border-top: 1px solid #ddd;
  margin: 20px 0;
`;

const SignupButton = styled.button`
  background-color: #2d9cdb;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SmallButton = styled.button`
  background-color: #2d9cdb;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 20px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 20px;
`;
