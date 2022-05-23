// * : library
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// * : helpers
import { AuthContext } from '../../helpers/AuthContext';
// * : components
import { ImArrowRight } from 'react-icons/im';
import {
  ConfirmBackground,
  ConfirmContainer,
  DescriptionContainer,
  DescriptionContents,
  DescriptionTitle,
  DescriptionInputContainer,
  DescriptionInput,
  ScheduleContainer,
  DayContainer,
  Day,
  DayCard,
  Places,
  CardContainer,
  PlacesCard,
  ArrowCard,
} from '../MapHome/ConfirmSchedule';

const DeleteSchedule = styled.input`
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 80px;
  height: 30px;
  border: none;
  border-radius: 10px;
  background-color: #fff7cd;
  box-shadow: 0px 0px 5px 2px #ebebeb;
  &:hover {
    box-shadow: 0px 0px 3px 1.5px #f0f0f0;
    font-size: 0.8rem;
  }
  &:active {
    box-shadow: none;
  }
`;

const placesConvertor = (places) => {
  let days = [];
  let transforedPlaces = [];
  places.map((place) => {
    if (!days.includes(place.day)) {
      days.push(place.day);
    }
  });
  days.map((day) => {
    transforedPlaces.push({
      day,
      places: places.filter((place) => place.day === day),
    });
  });
  return transforedPlaces;
};
function MyPageDetail({ setIsConfirmScheduleOpen, scheduleInfo }) {
  // unmount시에 setIsCon.. false로 변경
  const [formedPlaces, setFormedPlaces] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id, username } = useParams();


  const onDeleteSchedule = async () => {
    try {
      const newAccessToken = await axios.post(
        `http://127.0.0.1:3001/users/token`,
        {
          username: localStorage.getItem('username'),
        },
        {
          headers: { 'x-auth-token': localStorage.getItem('accessToken') },
        },
      );
      if (newAccessToken.errors) {
        alert('로그인이 끊겼습니다. 재 로그인 부탁드립니다.');
        navigate('/login');
        return;
      }
      console.log('token is refreshed');
      localStorage.setItem('accessToken', newAccessToken.data.accessToken);
    } catch (e) {
      console.log(e);
    }

    try {
      const isDeleted = await axios.delete(`http://13.124.152.197:3001/users/mypage-trip-history/${username}/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('accessToken') },
      });
      alert('삭제 되었습니다.');
      console.log(isDeleted);
      setIsConfirmScheduleOpen(false);
      // 에러 없을 시
      // alert('삭제 되었습니다.)
      // isConfirm false;
      // mypage로 이동
      // 에러 있을 시
      // isConfirm false;
      // 에러 메세지 띄우고 mypage로 이동
    } catch (e) {}

    // pageId로 스케쥴 삭제
  };
  useEffect(() => {
    if(!scheduleInfo.area){
      setIsConfirmScheduleOpen(false);
      navigate(`/myPage/${authState.username}`);
    };
    const tempPlaces = placesConvertor(scheduleInfo.places);
    setFormedPlaces(tempPlaces);
  }, []);
  return (
    <ConfirmBackground
      onClick={() => {
        setIsConfirmScheduleOpen(false);
        navigate(`/myPage/${authState.username}`);
      }}
    >
      <ConfirmContainer onClick={(e) => e.stopPropagation()}>
        <DescriptionContainer>
          <DescriptionContents>
            <DescriptionInputContainer>
              <DescriptionTitle>{scheduleInfo.area}</DescriptionTitle>
              <DescriptionInput
                value={`${scheduleInfo.startDay} ~ ${scheduleInfo.endDay}`}
                readOnly
              />
            </DescriptionInputContainer>
            <DescriptionInputContainer>
              <DescriptionTitle>Title</DescriptionTitle>
              <DescriptionInput value={scheduleInfo.title} readOnly />
            </DescriptionInputContainer>
          </DescriptionContents>
          <DescriptionContents>
            <DescriptionInputContainer>
              <DescriptionTitle>Description</DescriptionTitle>
              <DescriptionInput
                className="description"
                value={scheduleInfo.description}
                readOnly
              />
            </DescriptionInputContainer>
          </DescriptionContents>
        </DescriptionContainer>
        <ScheduleContainer>
          <DayContainer>
            {formedPlaces.map((day, i) => (
              <div key={i}>
                <Day>
                  <DayCard>{`Day ${day.day}`}</DayCard>
                </Day>
                <Places>
                  {day.places.map((place, i) => (
                    <CardContainer key={i}>
                      <PlacesCard>
                        <img src={place.placeImage} />
                        <div>{place.placeTitle}</div>
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
        <DeleteSchedule
          type="button"
          value="일정 삭제"
          onClick={onDeleteSchedule}
        />
      </ConfirmContainer>
    </ConfirmBackground>
  );
}

// * : prop Validation
MyPageDetail.propTypes = {
  setIsConfirmScheduleOpen: PropTypes.func.isRequired,
  scheduleInfo: PropTypes.object.isRequired,
};
export default MyPageDetail;
