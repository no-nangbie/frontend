// components/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    
    // 이메일이 없으면 /login으로 리다이렉트
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);

  return <h1>Welcome to the Home Page</h1>;
}

export default Home;
