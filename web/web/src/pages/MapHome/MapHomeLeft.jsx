import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import styled from 'styled-components';
// * : components
import { BiMinusCircle } from 'react-icons/bi';
import {
  Header,
  Contents,
  DayBox,
  DayTitle,
} from '../../components/MapHomeStyles/MapHomeLeft.styles';
import {
  PlaceCard,
  IconDiv,
} from '../../components/MapHomeStyles/MapHomeRight.styles';
import ConfirmSchedule from './ConfirmSchedule';
// * : helpers
import { contexts ,tripInfoContext} from '../../helpers/contexts';
import {AuthContext} from '../../helpers/AuthContext';


const tripInfoDiv = styled.div`
  font-weight: bold;
`
function MapHomeLeft() {
  const {tripInfo, setTripInfo} = useContext(AuthContext);
  // * : 임시로 만든 변수들. 차후 수정 요함
  const startDate = new Date(localStorage.getItem('startDate'));
  const endDate = new Date(localStorage.getItem('endDate'));
  const totalPeriod = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
  const startDateStr = `${startDate.getFullYear()}.${
    startDate.getMonth()+1 
  }.${startDate.getDate()}`;
  const endDateStr = `${endDate.getFullYear()}.${
    endDate.getMonth()+1
  }.${endDate.getDate()}`;

  // * : states
  // 각 날짜별 정보 (날짜, 클릭여부, 선택된 장소들)
  const [days, setDays] = useState(() => {
    const initDays = [];
    for (let i = 1; i <= totalPeriod; i += 1) {
      initDays.push({ day: i, clicked: false, places: [] });
    }
    return initDays;
  });
  // 클릭한 날짜 정보 (날짜, 선택된 장소들)
  const { clickedDay, setClickedDay } = useContext(contexts);
  const [isConfirmScheduleOpen, setIsConfirmScheduleOpen] = useState(false);
  // * : functions
  // 각 day title 클릭 시 clicked 변경 함수
  const onDayTitle = (index) => {
    const newDays = days.map((_item, _index) => {
      if (index === _index) {
        setClickedDay({ day: _item.day, places: _item.places });
        return { ..._item, clicked: true };
      }
      return { ..._item, clicked: false };
    });
    setDays(newDays);
  };
  // day외의 창 클릭 시 day clear
  const onClearDay = useCallback(() => {
    setClickedDay({ day: 0, places: [] });
    setDays((prevDays) => prevDays.map((_item, _index) => ({
      ..._item,
      clicked: false,
    })));
  }, []);
  // 카드의 - 버튼 클릭 시 해당 장소를 days에서 제거
  const removeFromDay = useCallback((day, place) => {
    const newPlaces = day.places.filter((_place) => {
      if (place === _place) {
        return false;
      }
      return true;
    });
    setDays((prevDays) => (
      prevDays.map((_item) => {
        if (_item.day === day.day) {
          return { ..._item, places: newPlaces };
        }
        return _item;
      })
    ));
    // clickedDay의 places와 days의 places와 동기화 해주기 위함
    setClickedDay((prevClickedDay) => {
      if (day.day === prevClickedDay.day) {
        return { ...prevClickedDay, places: newPlaces };
      }
      return prevClickedDay;
    });
  }, []);

  useEffect(() => {
    // NaverMap에서 클릭한 marker 정보 day에 저장
    const newDays = days.map((_item, _index) => {
      if (clickedDay.day === _item.day) {
        return { ..._item, places: clickedDay.places };
      }
      return _item;
    });
    setDays(newDays);
  }, [clickedDay]);
  return (
    <>
      <Header
        onClick={() => {
          onClearDay();
        }}
      >
        <div>{localStorage.getItem('area')}</div>
        <div>{`${startDateStr} ~ ${endDateStr}`}</div>
      </Header>
      <Contents
        onClick={() => {
          onClearDay();
        }}
      >
        {days.map((item, index) => (
          <DayBox
            key={item.day}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DayTitle
              clicked={item.clicked}
              onClick={() => {
                onDayTitle(index);
              }}
            >
              {`Day ${item.day}`}
            </DayTitle>
            {item.places.map((place) => (
              <PlaceCard key={place.name}>
                <img src={place.img} alt="이미지 안뜸" />
                <div>
                  <div>{place.name}</div>
                  <IconDiv>
                    <BiMinusCircle
                      size={20}
                      onClick={() => {
                        removeFromDay(item, place);
                      }}
                    />
                  </IconDiv>
                </div>
              </PlaceCard>
            ))}
          </DayBox>
        ))}
      </Contents>
      <CreateBtn onClick={()=>setIsConfirmScheduleOpen(true)}>일정 생성</CreateBtn>
      {isConfirmScheduleOpen && <ConfirmSchedule setIsConfirmScheduleOpen={setIsConfirmScheduleOpen} scheduleInfo={
        {
          area:localStorage.getItem('area'),
          startDateStr,
          endDateStr,
          days
        }
      }/>}
    </>
  );
}

const CreateBtn = styled.button`
  font-family: ${(props) => props.theme.defaultFont};
  font-weight: bold;
  font-size: 1rem;
  border: none;
  display: block;
  height: 50px;
  min-height: 50px;
  background-color: #dcfcfc;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 2px #ebebeb;
  &:hover{
      box-shadow: 0px 0px 3px 1.5px #f0f0f0 ;
  background-color: #dcfcfcd5;

    }
    &:active {
      box-shadow: none;
    }
`;

export default MapHomeLeft;
