import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../resources/icon/logo.png';

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 로그인 상태 확인 및 로그인 페이지로 리다이렉트
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');  // 로그인 페이지로 리다이렉트
        }
    }, [navigate]);

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인 상태가 아닙니다.');
                navigate('/login');
                return;
            }

            await axios.patch(`${process.env.REACT_APP_API_URL}members/password`, {
                currentPassword,
                newPassword,
                confirmNewPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true  // 이 옵션 추가
            });

            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/menu'); // 비밀번호 변경 후 마이페이지로 이동
        } catch (error) {
            console.error('비밀번호 변경 실패:', error.response?.data || error.message);
            alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 키보드에서 "Enter" 키가 눌렸을 때 로그인 함수 호출
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleChangePassword(); // 엔터키를 눌렀을 때 로그인 함수 실행
        }
    };

    return (
        <Container>
            <Form>
                <Icon src={logo} alt="logo" /> {/* 아이콘 경로는 실제 경로로 수정 */}
                <Label>기존 비밀번호</Label>
                <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="비밀번호"
                    onKeyPress={handleKeyPress} // Enter 키 입력 감지
                />
                <Label>변경할 비밀번호</Label>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    onKeyPress={handleKeyPress} // Enter 키 입력 감지
                />
                <Label>비밀번호 확인</Label>
                <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    onKeyPress={handleKeyPress} // Enter 키 입력 감지
                />
                <SubmitButton onClick={handleChangePassword}>변경하기</SubmitButton>
            </Form>
        </Container>
    );
}

export default ChangePassword;

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 0px;
    background-color: #f2f2f2;
    height: 85vh;
`;
const Form = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 70%;
    max-width: 400px;
`;

const Icon = styled.img`
    width: 80px;
    height: 50px;
    margin-bottom: 20px;
`;

const Label = styled.label`
    font-size: 14px;
    color: #2d9cdb;
    align-self: flex-start;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 30px;
    background-color: #f2f2f2;
    color: black;
    text-indent: 10px;
    outline: none;
    &:focus {
        border-color: #2d9cdb;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 15px;
    font-size: 16px;
    background-color: #2d9cdb;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        background-color: #1a7ab8;
    }
`;
