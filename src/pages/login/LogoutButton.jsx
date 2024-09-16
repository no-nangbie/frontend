import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 저장된 액세스 토큰을 가져오기
      const accessToken = localStorage.getItem('accessToken');

      // 토큰이 없는 경우 경고 메시지
      if (!accessToken) {
        alert('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return;
      }

      // 서버로 로그아웃 요청 보내기 (환경 변수 사용)
      await axios.post(`${process.env.REACT_APP_API_URL}auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Bearer 토큰 형태로 전송
        }
      });

      // 로그아웃 성공 시 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');

      // 로그인 페이지로 리다이렉트
    //   navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error.response?.data || error.message);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <button onClick={handleLogout}>
      로그아웃
    </button>
  );
}

export default LogoutButton;
