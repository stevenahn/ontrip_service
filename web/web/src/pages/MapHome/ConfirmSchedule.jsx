// * : library
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// * : helpers
import { AuthContext } from '../../helpers/AuthContext';
// * : components
import { ImArrowRight } from 'react-icons/im';
/* ------------------------------------------------------------------------------------------------------------ */
// * : styled Components
const ConfirmBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;
const ConfirmContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80vh;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
`;
const DescriptionContainer = styled.div`
  width: 100%;
  height: 20%;
`;
const DescriptionContents = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-around;
`;
const DescriptionInputContainer = styled.div`
  flex: 1;
  display: flex;
  margin-left: -1px;
  & .description{
    text-align: left;
    padding-left: 10px;
  }
  
`;
const DescriptionTitle = styled.div`
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.grayBGColor};
  background-color: ${(props) => props.theme.mainColor};
  font-weight: bold;
`;
const DescriptionInput = styled.input`
font-family: ${(props=>props.theme.defaultFont)};
  box-sizing: border-box;
  border: 1px solid #cccccc;
  border-left: none;
  border-radius: 3px;
  &:focus {
    outline: none;
  }
  width: 80%;
  height: 40px;
  font-size: 1rem;
  text-align: center;
`;
const ScheduleContainer = styled.div`
  flex: auto;
  overflow: auto;
`;
const DayContainer = styled.div`
  padding: 10px;
`;
const Day = styled.div`
  margin-bottom: 10px;
`;
const DayCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 5px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 15px;
`;
const Places = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CardContainer = styled.div`
  display: flex;
`;
const PlacesCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  & img {
    width: 100%;
    height: 95px;
  }
  & div {
    flex: 1;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    margin: 0%;
    padding: 0.5px;
  }
`;
const ArrowCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 100px;
`;
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 200px;
  justify-content: space-between;
  & input {
    width: 80px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-color: #fff7cd;
    box-shadow: 0px 0px 5px 2px #ebebeb;
    &:hover{
      box-shadow: 0px 0px 3px 1.5px #f0f0f0 ;
      font-size: 0.8rem;
    }
    &:active {
      box-shadow: none;
    }
  }
`;

// * : Main Function
function ConfirmSchedule({ setIsConfirmScheduleOpen, scheduleInfo }) {
  // * : states
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  // * : hooks
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  // * : functions
  const onSubmit = async () => {
    if (!title) {
      alert('일지 제목을 작성해주세요');
      return;
    }
    // submit하기 전에 token 갱신
    try{
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
        alert('로그인이 끊겼습니다. 재 로그인 부탁드립니다.');
        navigate('/login');
        return;
      }
      console.log('token is refreshed');
      localStorage.setItem('accessToken',newAccessToken.data.accessToken);
    }catch(e){
      console.log(e);
    }
    // console.log({
    //   username: authState.username,
    //   area: scheduleInfo.area,
    //   startDate: scheduleInfo.startDateStr,
    //   thumbnail: scheduleInfo.days[0].places[0].img,
    //   endDate: scheduleInfo.endDateStr,
    //   tripTitle: title,
    //   description,
    //   days: scheduleInfo.days,
    // });
    await axios
      .post(
        'http://13.124.152.197:3001/users/trip-schedule',
        {
          username: authState.username,
          area: scheduleInfo.area,
          startDate: scheduleInfo.startDateStr,
          thumbnail: scheduleInfo.days[0].places[0].img,
          endDate: scheduleInfo.endDateStr,
          tripTitle: title,
          description,
          days: scheduleInfo.days,
        },
        { headers: { 'x-auth-token': localStorage.getItem('accessToken') } },
      )
      .then((res) => {
        alert('저장 되었습니다.');
        localStorage.removeItem('area');
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        localStorage.removeItem('area_lat');
        localStorage.removeItem('area_lng');
        navigate(`/myPage/${authState.username}`);
      })
      .catch((e) => {
        alert('저장 실패 : error 발생');
        console.log(e);
      });
  };
  useEffect(()=>{
    setAuthState({...authState, username: localStorage.getItem('username')});
  },[])
  return (
    <ConfirmBackground onClick={() => setIsConfirmScheduleOpen(false)}>
      <ConfirmContainer onClick={(e) => e.stopPropagation()}>
        <DescriptionContainer>
          <DescriptionContents>
            <DescriptionInputContainer>
              <DescriptionTitle>{scheduleInfo.area}</DescriptionTitle>
              <DescriptionInput
                value={`${scheduleInfo.startDateStr} ~ ${scheduleInfo.endDateStr}`}
                readOnly
              />
            </DescriptionInputContainer>
            <DescriptionInputContainer>
              <DescriptionTitle>Title</DescriptionTitle>
              <DescriptionInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </DescriptionInputContainer>
          </DescriptionContents>
          <DescriptionContents>
            <DescriptionInputContainer>
              <DescriptionTitle>Description</DescriptionTitle>
              <DescriptionInput
              className='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </DescriptionInputContainer>
          </DescriptionContents>
        </DescriptionContainer>

        <ScheduleContainer>
          <DayContainer>
            {scheduleInfo.days.map((day, i) => (
              <div key={i}>
                <Day>
                  <DayCard>{`Day ${day.day}`}</DayCard>
                </Day>
                <Places>
                  {day.places.map((place, i) => (
                    <CardContainer key={i}>
                      <PlacesCard>
                        <img src={place.img} />
                        <div>{place.name}</div>
                      </PlacesCard>
                      {day.places.length !== i + 1 && (
                        <ArrowCard>
                          <ImArrowRight />
                        </ArrowCard>
                      )}
                    </CardContainer>
                  ))}
                </Places>
              </div>
            ))}
          </DayContainer>
        </ScheduleContainer>
        <ButtonContainer>
          <input type="button" value="수정" />
          <input type="button" value="저장" onClick={onSubmit} />
        </ButtonContainer>
      </ConfirmContainer>
    </ConfirmBackground>
  );
}

// * : prop Validation
ConfirmSchedule.propTypes = {
  setIsConfirmScheduleOpen: PropTypes.func.isRequired,
  scheduleInfo: PropTypes.object.isRequired,
};

export {
  ConfirmBackground,
  ConfirmContainer,
  DescriptionContainer,
  DescriptionContents,
  DescriptionInputContainer,
  DescriptionTitle,
  DescriptionInput,
  ScheduleContainer,
  DayContainer,
  Day,
  DayCard,
  Places,
  CardContainer,
  PlacesCard,
  ArrowCard,
  ButtonContainer,
};
export default ConfirmSchedule;
