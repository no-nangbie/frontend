import styled from 'styled-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import menu_1 from '../../resources/sample/menu_1.png';
import user_icon from '../../resources/icon/user.png';
import timer_icon from '../../resources/icon/timer.png';
import cook_icon from '../../resources/icon/cook.png';
import like_icon from '../../resources/icon/heart_red.png'; 

import difficulty1_icon from '../../resources/icon/difficulty_1.png';
import difficulty2_icon from '../../resources/icon/difficulty_2.png';
import difficulty3_icon from '../../resources/icon/difficulty_3.png';

const BoardDetails = () => {
  const { boardId } = useParams();
  const queryClient = useQueryClient();

  const fetchPost = async () => {
    if (!boardId) {
      throw new Error('잘못된 게시글 ID 입니다.');
    }
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+`boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['post', boardId],
    queryFn: fetchPost,
    enabled: !!boardId,
    retry: 1
  });

  const likeMutation = useMutation({
    mutationFn: () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('token을 찾을 수 없습니다.');
      }
      return axios.post(`http://localhost:8080/likes`, {
        memberId: post.memberId,
        boardId: boardId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', boardId]);
    },
    onError: () => {
        alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  });

  const handleLike = () => {
    likeMutation.mutate();
  };
  
  if (isLoading) return (
    <Container>
      <ClipLoader color="#007bff" loading={isLoading} size={50} />
    </Container>
  );

  if (isError) {
    console.error("Error loading post:", error.message);
    return <div>게시글을 불러오는데 오류가 발생했습니다: {error.message}</div>;
  }

  if (!post) {
    console.warn("Post not found");
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <ImageContainer>
        <Image src={post.imageUrl} alt="돼지고기 김치찌개" />
        <LikeButton onClick={() => alert('초록 버튼 클릭됨!')}>
          <LikeButtonImage src={like_icon} alt="Button Icon" /> 
        </LikeButton> {/* 초록색 버튼 */}
      </ImageContainer>
      <TextContainer>
        <Title>{post.menuCategory} | {post.title}</Title>
        <Dividers/>
        <Description>{post.boardContent}</Description>
        <InfoContainer>
            <InfoItem>
              <Icon src={user_icon} alt="관리자" />
              {post.author}
            </InfoItem>
            <InfoItem>
              <Icon src={cook_icon} alt="3인분" />
              {post.servingSize}인분
            </InfoItem>
          </InfoContainer>
          <InfoContainer>
            <InfoItem>
              <Icon src={timer_icon} alt="30분" />
              {post.cookingTime}분
            </InfoItem>
            <InfoItem>
              <Icon src={difficulty1_icon} alt="쉬움" />
              {post.difficulty}
            </InfoItem>
        </InfoContainer>
        <Ingredients>
          <Title>재료</Title>
          <Dividers/>
          <ul>
            <li><Span>{post.foodContent}</Span></li>
          </ul>
        </Ingredients>
        <Ingredients>
          <Title>레시피</Title>
          <Dividers/>
          <ul>
            <li><Span>{post.recipeContent}</Span></li>
          </ul>
        </Ingredients>
      </TextContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%; /* Limit height of the scrollable area */
  overflow-y: auto; /* 세로 스크롤 가능하게 설정 */
  overflow-x: hidden;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative; /* 자식 요소가 절대 위치를 가질 수 있도록 설정 */
  height: 50vh; /* 이미지 높이를 뷰포트 높이의 50%로 설정 */
  border-radius: 0 0 30px 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const LikeButton = styled.button`
  position: absolute;
  bottom: 0px; /* 이미지 아래쪽에서 0px 위치 */
  right: 0px; /* 이미지 오른쪽에서 0px 위치 */
  width: 60px; /* 버튼 너비 */
  height: 60px; /* 버튼 높이 */
  background-color: white; /* 버튼 배경색 */
  border: none;
  border-radius: 20px 0 0; /* 모서리를 둥글게 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* 이미지가 중앙에 오도록 설정 */
  opacity: 0.6; /* 20% 투명도 */
`;

const LikeButtonImage = styled.img`
  width: 30px; /* 이미지 너비 */
  height: 30px; /* 이미지 높이 */
`;

const Span = styled.div`
  margin: 0 30px 0px 30px;
`
const Dividers = styled.div`
  border: 0;
  height: 2px;
  background-color: #2D9CDB; /* 원하는 색상으로 변경 */
  margin: 0 0; /* 위아래 여백 조정 */
`;
const Uldividers = styled.div`
  border: 0;
  height: 1px;
  background-color: #D9D9D9; /* 원하는 색상으로 변경 */
  margin: 0 0; /* 위아래 여백 조정 */
`;

const TextContainer = styled.div`
  width: 90%;
  padding-top: 20px;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #2D9CDB;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: row; /* 아이콘과 텍스트를 위아래로 배치 */
  align-items: center; /* 텍스트 길이와 상관없이 아이콘 중앙에 위치 */
  font-size: 12px;
  color: #333;
  width: 300px; /* 고정된 너비로 아이템의 위치 고정 */
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px; /* 아이콘과 텍스트 사이에 간격 추가 */
`;

const Ingredients = styled.div`
  text-align: left;
  margin: 20px 0;

  h2 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between; /* 재료와 양을 양쪽 끝에 배치 */
    }
  }
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40px;
`;

const ActionButton = styled.button`
  background-color: #2D9CDB;
  color: #FFFFFF;
  width: 100%;
  height: 50px;
  padding: 10px 40px; /* 버튼이 길어지도록 padding 설정 */
  border: 2px solid #2D9CDB; /* 파란색 테두리 */
  border-radius: 10px; /* 둥근 모서리 */
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  
  &:hover {
    background-color: #f0f0f0; /* hover 시 배경색 변경 */
  }
`;

export default BoardDetails;
