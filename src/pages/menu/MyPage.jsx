import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 회원 탈퇴 모달 상태 추가


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

    // 회원탈퇴 핸들러 함수
    const handleDeleteAccount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                alert('로그인 상태가 아닙니다.');
                navigate('/login');
                return;
            }

            // 회원탈퇴 요청
            await axios.delete(`${process.env.REACT_APP_API_URL}members`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 회원탈퇴 성공 시 로컬 스토리지에서 토큰 및 이메일 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');
            localStorage.removeItem('nickname');

            alert('회원탈퇴가 완료되었습니다.');
            navigate('/login'); // 탈퇴 후 로그인 페이지로 이동

        } catch (error) {
            console.error('회원탈퇴 실패:', error.response?.data || error.message);
            alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 유저 정보 가져오기
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedNickname = localStorage.getItem('nickname');
        if (storedEmail) setEmail(storedEmail);
        if (storedNickname) setNickname(storedNickname);
    }, []);


      // 냉장고 초기화 함수
      const initialFoodItems = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}my-foods/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            alert('냉장고가 초기화되었습니다.');
        } catch (error) {
            console.error('냉장고 초기화 실패:', error.response?.data || error.message);
            alert('냉장고 초기화 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };
    
    // 모달 확인 버튼 클릭 시 실행
    const handleConfirm = () => {
        initialFoodItems();
        setIsModalOpen(false);
    };

    // 모달 취소 버튼 클릭 시 실행
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 회원 탈퇴 확인 모달의 확인 버튼 클릭 시 실행
    const handleDeleteConfirm = () => {
        handleDeleteAccount();
        setIsDeleteModalOpen(false);
    };

    // 회원 탈퇴 확인 모달 취소 버튼 클릭 시 실행
    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    // 비밀번호 변경 페이지로 이동하는 함수
    const handlePasswordChange = () => {
        console.log("Password change clicked");  // 이 로그가 출력되는지 확인합니다.
        navigate('/menu/change-password');  // 비밀번호 변경 페이지로 이동
    };

    return (
        <Container>
            <Content>
                <InfoCard>
                    <InfoText>{email}</InfoText>
                    <InfoText>{nickname}</InfoText>
                </InfoCard>
                <ActionButton>닉네임 변경</ActionButton>
                <ActionButton onClick={handlePasswordChange}>비밀번호 변경</ActionButton>  {/* 버튼 수정 */}
                <ActionButton>선호 음식 변경</ActionButton>
                <ActionButton>통계</ActionButton>
                <ActionButton onClick={handleLogout}>로그아웃</ActionButton>
                <RedButton onClick={() => setIsModalOpen(true)}>냉장고 초기화</RedButton>
                <RedButton>통계 초기화</RedButton>
                <RedButton onClick={() => setIsDeleteModalOpen(true)}>회원 탈퇴</RedButton>
            </Content>
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalText>냉장고 속 모든 식재료를 삭제하겠습니까?</ModalText>
                        <ModalButtonContainer>
                            <ModalButton onClick={handleConfirm}>확인</ModalButton>
                            <ModalButton onClick={handleCancel}>취소</ModalButton>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* 회원 탈퇴 확인 모달 */}
            {isDeleteModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalText>
                            회원 탈퇴를 진행하겠습니까?<br />
                            회원 탈퇴 시 모든 정보가 삭제됩니다.
                        </ModalText>
                        <ModalButtonContainer>
                            <ModalButton onClick={handleDeleteConfirm}>확인</ModalButton>
                            <ModalButton onClick={handleDeleteCancel}>취소</ModalButton>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
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

// const Header = styled.header`
//   background-color: #2d9cdb;
//   height: 50px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
// `;
//
// const Heading = styled.h1`
//     font-size: 24px;
//     margin: 0;
// `;

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

// 모달 스타일
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContent = styled.div`
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
`;

const ModalText = styled.p`
    font-size: 16px;
    color: black;
    margin-bottom: 20px;
`;

const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const ModalButton = styled.button`
    background-color: #2d9cdb;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
        background-color: #1a7ab8;
    }
`;
