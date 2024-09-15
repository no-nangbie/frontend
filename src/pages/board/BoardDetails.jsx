import styled from 'styled-components';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

//아이콘 이미지
import user_icon from '../../resources/icon/user.png';
import timer_icon from '../../resources/icon/timer.png';
import cook_icon from '../../resources/icon/cook.png';
import like_icon from '../../resources/icon/heart_red.png'; 
import like_fill_icon from '../../resources/icon/heart_red_FillIn.png'; 

//난이도 이미지
import difficulty1_icon from '../../resources/icon/difficulty_1.png';
import difficulty2_icon from '../../resources/icon/difficulty_2.png';
import difficulty3_icon from '../../resources/icon/difficulty_3.png';

const BoardDetails = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { actionType,setActionType } = useOutletContext();
  const { handleBoardData } = useOutletContext(); // 부모로부터 받은 함수
  const queryClient = useQueryClient();


  const performEditAction = async () => {
    try {
      const response = await axios.delete(process.env.REACT_APP_API_URL+`boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log('게시물 삭제 성공:', response.data);
      navigate('/board');
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
    }
  };
  
  const handleClick = (boardId) => {
    navigate(`/board/edit/${boardId}`); // 페이지 이동 처리
  };

  useEffect(() => {
    console.log('리시브 '+actionType)
    if (actionType === 'delete') {
      performEditAction(); // axios 요청 실행
      setActionType(''); // 요청 실행 후 actionType을 빈 문자열로 변경
    }else if (actionType === 'edit') {
      setActionType(''); // 요청 실행 후 actionType을 빈 문자열로 변경
      handleClick(boardId);
    }
  }, [actionType]);


  const sendAuthorEmailToParent = (e) =>{
    if(e === localStorage.getItem('email'))
      handleBoardData(true);
    else
      handleBoardData(false);
    console.log('authorEmail : '+ e)
  }
  /**
   * 특정 게시글(BoardId)정보 불러오는 메서드
   * 
   * @return : 성공하면 해당BoardId의 정보를 가져옴
   *          실패하면은 error 처리
   * 
   * @Author : 신민준
   */
  const fetchPost = async () => {
    console.log('refresh')
    if (!boardId) {
      throw new Error('잘못된 게시글 ID 입니다.');
    }
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+`boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      sendAuthorEmailToParent(response.data.data.authorEmail)
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * React Query를 통해 정보 불러올때 예외처리
   * fetchPost 실행결과로 받은 정보들과 재실행 키(queryKey), 그리고 상태(isLoading/isError/error)관리
   * 
   * @Author : 신민준
   */
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

  /**
   * 좋아요 처리 메서드. 
   * 
   * @return : 성공하면 queryClient.invalidateQueries를 통해 React Query의 queryKey를 이용하여 Refresh진행!!
   *          하트가 채워지는 것을 보여주기 위해서 Refresh하는 것
   *          실패하면은 ERR alert 반환
   * 
   * @Author : 신민준
   */
  const likeMutation = useMutation({
    mutationFn: () => {
      return axios.post(process.env.REACT_APP_API_URL+`boards/${boardId}/like`,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
    },
    onSuccess: () => {
      console.log('Mutation succeeded, invalidating query...');
      queryClient.invalidateQueries(['post', boardId]);
    },
    onError: () => {
        alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  });

  /**
   * 난이도에 따른 이미지 변경 메서드
   * Post.difficulty를 매개변수로 받아서 난이도에 따라 난이도이미지의 그래프 그림이 달라지게 설정
   * 
   * @return : 난이도이미지
   * 
   * @Author : 신민준
   */
  const handleDifficultyImg = (difficulty) => {
    switch(difficulty){
      case '쉬움':
        return difficulty1_icon; 
      case '보통':
        return difficulty2_icon; 
      default: //'DIFFICULTY_HARD'
        return difficulty3_icon; 
    }
  };

  /**
   * 좋아요 이미지 처리 메서드
   * 
   * @return : post.LikeCheck를 인자로 받는데 이게 'T'면은 채워진 하트, 아니면 비워진 하트
   * 
   * @Author : 신민준
   */
  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleLikeImg = (likeCheck) => {
    return likeCheck === 'T' ? like_fill_icon : like_icon;
  };

  /**
   * 로딩중일때..
   * 
   * @return : 빙글빙글 도는 이미지 
   * 
   * @Author : 신민준
   */
  if (isLoading) return (
    <Container>
      <ClipLoader color="#007bff" loading={isLoading} size={50} />
    </Container>
  );

  /**
   * 그 외 에러처리 메서드
   * 
   * @return : 게시글 불러오기 실패 / post 정보 없음
   * 
   * @Author : 신민준
   */
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
        <Image src={post.imageUrl} alt="이미지 없음" />
        <LikeButton onClick={handleLike}>
          <LikeButtonImage src={handleLikeImg(post.likeCheck)} alt="Button Icon" /> 
        </LikeButton>
      </ImageContainer>
      <TextContainer>
        <Title>[ {post.menuCategory} ] {post.title}</Title>
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
              <Icon src={handleDifficultyImg(post.difficulty)} alt="쉬움" />
              {post.difficulty}
            </InfoItem>
        </InfoContainer>
        <Ingredients>
          <Title>재료</Title>
          <Dividers/>
          <ul>
            <li>
              <Span>
                {post.foodContent.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Span>
            </li>
          </ul>
        </Ingredients>
        <Ingredients>
          <Title>레시피</Title>
          <Dividers/>
          <ul>
            <li>
              <Span>
                {post.foodContent.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Span>
            </li>
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
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 0 0 30px 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 450px;
  border-radius: 10px;
  display: block;
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

export default BoardDetails;
