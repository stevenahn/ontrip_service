// * : library
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
// * : helpers
import { AuthContext } from '../../helpers/AuthContext';
// * : components
import Navbar from '../../components/Navbar';
import { MapHomeRightTopBtn } from '../../components/MapHomeStyles/MapHomeRight.styles';
import MyPageDetail from './MyPageDetail';
/* ------------------------------------------------------------------------------------------------------------ */
// * : styled Components
const MyPageContainer = styled.div`
  font-family: ${(props) => props.theme.defaultFont};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
const MyPageContent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const MyPageHeader = styled.div`
  box-sizing: border-box;
  padding: 50px;
  display: flex;
  align-items: center;
  height: 100px;
  position: relative;
  & h1 {
    font-size: 2rem;
  }
  & button {
    position: relative;
    top: 5px;
    left: 15px;
    width: 100px;
    margin-left: 15px;
  }
`;
const MyPageBody = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: auto;
`;
const ScheduleCard = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 20px;
  width: 200px;
  height: 240px;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25), 0 5px 18px rgba(0, 0, 0, 0.2);
  }
  & img {
    height: 180px;
  }
  & div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
  }
  & .tripDate {
    font-size: 0.8rem;
    color: ${(props) => props.theme.grayBgColor};
  }
`;
// * : Main Function
function MyPage() {
  // * : states
  const [myPageHistory, setMyPageHistory] = useState([]);
  const [isConfirmScheduleOpen, setIsConfirmScheduleOpen] = useState(false);
  const [historyDetailInfo, setHistoryDetailInfo] = useState({
    area: '',
    startDay: '',
    endDay: '',
    title: '',
    description: '',
    places: [],
  });
  // * : hooks
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username, id } = useParams();

  // * : functions
  const onLogout = () => {
    alert('???????????? ???????????????.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');


    setAuthState({ username: '', email: '', status: false });
    navigate('/');
  };
  const onUpdateUser = () => {
    navigate('/updateUser');
  }
  const onDetail =async (historyId) => {
    if (historyId) {
      try {
        const historyDetail = await axios.get(
          `http://13.124.152.197:3001/users/trip-schedule/${authState.username}/${historyId}`,
          { headers: { 'x-auth-token': localStorage.getItem('accessToken') } },
        );
        myPageHistory.map((history) => {
          if (history.id.toString() === historyId) {
            const tempDetail = {
              area: history.area,
              title: history.tripTitle,
              description: history.description,
              startDay: history.startDay,
              endDay: history.endDay,
              places: historyDetail.data,
              page_id: history.id,
            };
            setHistoryDetailInfo(tempDetail);
            return;
          }else{
          }
        });
        setIsConfirmScheduleOpen(true);
        // console.log(historyDetail.data);
      } catch (e) {
        setIsConfirmScheduleOpen(false);
        console.log(e);
      }
    }
     navigate(`./${historyId}`);
  };

  // login ?????????????????? ??????
  useEffect(()=>{
    if (!localStorage.getItem('username')) {
      navigate('/login');
    }
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    if(id && !isConfirmScheduleOpen){
      navigate(`/myPage/${localStorage.getItem('username')}`);
    }
  },[isConfirmScheduleOpen])
  //  ??????????????? ?????? ????????????
  useEffect(async () => {
    console.log("myPage is started");
    // user ?????? ?????? by accessToken
    let basicInfo;
    const username = localStorage.getItem('username');
    try {
      basicInfo = await axios.get(
        `http://13.124.152.197:3001/users/basicInfo/${username}`,
      );
      setAuthState({
        username: basicInfo.data.username,
        email: basicInfo.data.email,
        status: true,
      });
    } catch (e) {
      console.log('Error in MyPage 166', e);
      console.log(e);
    }
    // ????????? ????????????
    try {
      const myPageHistory = await axios.get(
        `http://13.124.152.197:3001/users/mypage-trip-history/${basicInfo.data.username}`,
        { headers: { 'x-auth-token': localStorage.getItem('accessToken') } },
      );
      if (myPageHistory.data.error) {
        try {
          const newAccessToken = await axios.post(
            `http://13.124.152.197:3001/users/token`,
            {
              username: localStorage.getItem('username'),
            },
            {
              headers: { 'x-auth-token': localStorage.getItem('accessToken') },
            },
          );
          if(newAccessToken.errors){
            navigate('/login');
            return;
          }
         localStorage.setItem('accessToken',newAccessToken.data.accessToken);
         window.location.reload();
        } catch (e) {console.log(e)}
      } else {
        setMyPageHistory(myPageHistory.data);
      }
    } catch (e) {
      console.log('Error in MyPage 196', e);
    }
  }, [isConfirmScheduleOpen]);
 // detail ?????? ??????
  // useEffect(async () => {
  //   console.log(id);
  //   if (id) {
  //     try {
  //       const historyDetail = await axios.get(
  //         `http://13.124.152.197:3001/users/trip-schedule/${authState.username}/${id}`,
  //         { headers: { 'x-auth-token': localStorage.getItem('accessToken') } },
  //       );
  //       myPageHistory.map((history) => {
  //         if (history.id.toString() === id) {
  //           const tempDetail = {
  //             area: history.area,
  //             title: history.tripTitle,
  //             description: history.description,
  //             startDay: history.startDay,
  //             endDay: history.endDay,
  //             places: historyDetail.data,
  //             page_id: history.id,
  //           };
  //           setHistoryDetailInfo(tempDetail);
  //           return;
  //         }
  //       });
  //       setIsConfirmScheduleOpen(true);
  //       // console.log(historyDetail.data);
  //     } catch (e) {
  //       setIsConfirmScheduleOpen(true);
  //       console.log(e);
  //     }
  //   }
  // }, [id]);
  return (
    <MyPageContainer>
      <Navbar menus={['????????????', '???????????????']} />
      <MyPageContent>
        <MyPageHeader>
          <h1>{`${authState.username}??? ????????????`}</h1>
          <MapHomeRightTopBtn clicked={true} onClick={onUpdateUser}>??????????????????</MapHomeRightTopBtn>
          <MapHomeRightTopBtn clicked={true} onClick={onLogout}>
            ????????????
          </MapHomeRightTopBtn>
        </MyPageHeader>
        <MyPageBody>
          {myPageHistory.map((history) => {
            return (
              <ScheduleCard
                key={history.id}
                onClick={() => onDetail(history.id)}
              >
                <img src={history.thumbnail} />
                <div>{history.tripTitle}</div>
                <div className="tripDate">{`${history.startDay} ~ ${history.endDay}`}</div>
              </ScheduleCard>
            );
          })}
        </MyPageBody>
      </MyPageContent>
      {isConfirmScheduleOpen && (
        <MyPageDetail
          setIsConfirmScheduleOpen={setIsConfirmScheduleOpen}
          scheduleInfo={historyDetailInfo}
        />
      )}
    </MyPageContainer>
  );
}

export default MyPage;
