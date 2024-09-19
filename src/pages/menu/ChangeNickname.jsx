import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../resources/icon/logo.png';

function ChangeNickname() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(null); // 중복 확인 상태 관리
    const [errorMessage, setErrorMessage] = useState('');

    // 로그인 상태 확인 및 로그인 페이지로 리다이렉트
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');  // 로그인 페이지로 리다이렉트
        }
    }, [navigate]);

    // 닉네임 중복 확인 함수
    const handleCheckNickname = async () => {
        if (!nickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}nickname-check`, {
                params: { nickname },
            });

            if (response.status === 200 && response.data === "NickName available") {
                setIsNicknameValid(true); // 사용 가능한 닉네임
            } else {
                setIsNicknameValid(false); // 사용 불가한 닉네임
            }
        } catch (error) {
            console.error('닉네임 확인 실패:', error);
            setErrorMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
        }
    };

    // 닉네임 변경 함수
    const handleChangeNickname = async () => {
        if (!isNicknameValid) {
            alert('닉네임을 먼저 확인해주세요.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인 상태가 아닙니다.');
                navigate('/login');
                return;
            }

            await axios.patch(`${process.env.REACT_APP_API_URL}members/nickname`, {
                nickname,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            alert('닉네임이 성공적으로 변경되었습니다.');
            navigate('/menu'); // 닉네임 변경 후 마이페이지로 이동
        } catch (error) {
            console.error('닉네임 변경 실패:', error.response?.data || error.message);
            setErrorMessage('닉네임 변경 중 오류가 발생했습니다.');
        }
    };

    // 키보드에서 "Enter" 키가 눌렸을 때 로그인 함수 호출
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleChangeNickname(); // 엔터키를 눌렀을 때 로그인 함수 실행
        }
    };

    return (
        <Container>
            <Form>
                <Icon src={logo} alt="logo" /> {/* 로고 이미지 */}
                <Label>변경할 닉네임</Label>
                <InputGroup>
                    <Input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                        onKeyPress={handleKeyPress} // Enter 키 입력 감지
                    />
                    <CheckButton onClick={handleCheckNickname}>중복 확인</CheckButton>
                </InputGroup>
                {isNicknameValid === false && (
                    <ErrorMessage>현재 사용중인 닉네임입니다.</ErrorMessage>
                )}
                {isNicknameValid === true && (
                    <SuccessMessage>사용 가능한 닉네임입니다.</SuccessMessage>
                )}
                <SubmitButton onClick={handleChangeNickname}>변경하기</SubmitButton>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </Form>
        </Container>
    );
}

export default ChangeNickname;

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
    margin-bottom: 10px;
    font-weight: bold;
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    border: 1px solid #dfdfdf;
    border-radius: 30px;
    background-color: #f5f5f5;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: none;
    border-radius: 30px 0 0 30px;
    background-color: #f5f5f5;
    outline: none;
`;

const CheckButton = styled.button`
    background-color: #2d9cdb;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 0 30px 30px 0;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background-color: #1a7ab8;
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

const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 10px;
    font-size: 14px;
`;

const SuccessMessage = styled.p`
    color: green;
    margin-bottom: 10px;
    font-size: 14px;
`;
