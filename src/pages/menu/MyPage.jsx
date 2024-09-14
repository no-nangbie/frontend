import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');

    // 로그아웃 핸들러 함수
    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                alert('로그인 상태가 아닙니다.');
                navigate('/login');
                return;
            }

            await axios.post(`${process.env.REACT_APP_API_URL}auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 로그아웃 성공 시 토큰 및 이메일 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');

            // 로그인 페이지로 리다이렉트
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error.response?.data || error.message);
            alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 유저 정보 가져오기
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedNickname = localStorage.getItem('nickname');
        if (storedEmail) setEmail(storedEmail);
        if (storedNickname) setNickname(storedNickname);
    }, []);

    return (
        <Container>
            <Content>
                <InfoCard>
                    <InfoText>{email}</InfoText>
                    <InfoText>{nickname}</InfoText>
                </InfoCard>
                <ActionButton>닉네임 변경</ActionButton>
                <ActionButton>비밀번호 변경</ActionButton>
                <ActionButton>선호 음식 변경</ActionButton>
                <ActionButton>통계</ActionButton>
                <ActionButton onClick={handleLogout}>로그아웃</ActionButton>
                <RedButton>냉장고 초기화</RedButton>
                <RedButton>통계 초기화</RedButton>
                <RedButton>회원 탈퇴</RedButton>
            </Content>
        </Container>
    );
}

export default MyPage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f2f2f2;
`;

const Header = styled.header`
  background-color: #2d9cdb;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Heading = styled.h1`
    font-size: 24px;
    margin: 0;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const InfoCard = styled.div`
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoText = styled.p`
    font-size: 16px;
    color: black;
    margin: 0;
`;

const ActionButton = styled.button`
    background-color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #f5f5f5;
    }
`;

const RedButton = styled(ActionButton)`
    background-color: #ff4d4f;
    color: white;

    &:hover {
        background-color: #ff7875;
    }
`;
