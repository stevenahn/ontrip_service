import './Home.css';
// * : library
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
// * : components
import Navbar from '../../components/Navbar';
import { BsSearch } from 'react-icons/bs';
import { FaGithub, FaInstagram } from 'react-icons/fa';
// * : helpers
import { tripInfoContext } from '../../helpers/contexts';
import { AuthContext } from '../../helpers/AuthContext';

// * : styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.defaultFont};
`;
const IntroductionContainor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.mainColor};
  padding: 50px;

  & h1 {
    font-size: 3rem;
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  & h2 {
    font-size: 2rem;
  }
  & h3 {
    font-size: 1.5rem;
    color: #828282;
  }
`;
const AreaContainor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  & h1 {
    font-size: 2rem;
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  & .areaInput {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #dbdbdb;
    width: 400px;
    height: 40px;
    padding: 3px;
    margin-bottom: 15px;

    & #magnifyingIcon {
      margin-left: 5px;
      margin-right: 5px;
    }

    & input {
      width: 100%;
      border: none;
      font-size: 1.2rem;
      &:focus {
        outline: none;
      }
    }
  }
`;

const AreaCardContainor = styled.div`
  padding: 20px;
  display: flex;
  height: 500px;
  justify-content: center;
  flex-wrap: wrap;
  overflow: auto;
`;
const AreaCard = styled.div`
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
const DateContainor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background-color: #afd7ff;
  & h1 {
    font-size: 2rem;
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

const now = new Date();
const yesterdayBegin = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1,
);
const todayEnd = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  23,
  59,
  59,
  999,
);

const BtnContainor = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  & input {
    margin: 40px;
    width: 90px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-color: #fff7cd;
    box-shadow: 0px 0px 5px 2px #f0f0f0;
    font-family: ${(props) => props.theme.defaultFont};
    font-size: 1.3rem;
    font-weight: ${(props) => (props.clicked ? 'bold' : '')};
    &:active {
      box-shadow: 0px 0px 5px 2px #f0f0f0 inset;
    }
  }
`;
const Footer = styled.div`
  background-color: #f5f5f5;
  padding: 10px;
  & .footer_icon {
    margin: 10px;
  }
  & a:hover {
    color: rgb(65, 139, 189);
  }
  & a:active {
    color: rgb(42, 109, 153);
  }
`;
const areas = [
  {
    area: '서울',
    img: 'https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/6emG/image/ricOCxnz_i_AJbRNyQv7krfaoug',
    areaLoc: [37.566535,126.9779692]
  },
  {
    area: '인천',
    img: 'https://www.ito.or.kr/images/bbs/galleryko/2021/middle/yeonsugu_songdosenteulealpakeu_gongwon_(2).jpg',
    areaLoc: [37.4562557,126.7052062]
  },
  {
    area: '대구',
    img: 'https://t1.daumcdn.net/cfile/tistory/230F83505472EBDB22',
    areaLoc: [35.8714354,128.601445]
  },
  {
    area: '경주',
    img: 'https://t1.daumcdn.net/cfile/tistory/999CF54B5D97530B10',
    areaLoc: [35.8561719,129.2247477]
  },
  {
    area: '안동',
    img: 'https://www.tourandong.com/_cs_/thumb.cshtml/tour/1178/19%EC%9E%85%EC%84%A0%20%EA%B9%80%EA%B2%BD%EC%88%99%20%EC%9B%94%EC%98%81%EA%B5%90%EC%9D%98%20%EB%B4%84.jpg?size=1200x1200',
    areaLoc: [36.5683543,128.729357]
  },
  
  {
    area: '부산',
    img: 'https://www.busan.go.kr/resource/img/geopark/sub/busantour/busantour1.jpg',
    areaLoc: [35.1795543,129.0756416]
  },
  {
    area: '통영',
    img: 'https://file.mk.co.kr/meet/neds/2019/05/image_readtop_2019_311767_15589178283745416.jpg',
    areaLoc: [34.8544227,128.433182]
  },
  {
    area: '강릉',
    img: 'https://www.gtdc.or.kr/dzSmart/upfiles/Tours/2018June/25/0ed417274081bfc2724596f96a1200fc_1529310659.jpg',
    areaLoc: [37.751853,128.8760574]
  },
  {
    area: '제주',
    img: 'https://a.cdn-hotels.com/gdcs/production69/d1911/913619a9-f618-47db-b2a2-3ca277ad2226.jpg',
    areaLoc: [33.38544662494779, 126.5550319629174]
  },
];
function Home() {
  const [value, onChange] = useState([yesterdayBegin, todayEnd]);
  const [searchArea, setSearchArea] = useState('');
  const { authState, tripInfo, setTripInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const onCardClick = (area) => {
    setSearchArea(area.area);
    setTripInfo({ ...tripInfo, area: area.area ,areaLoc: area.areaLoc});
  };
  const onMapHome = () => {
    if (!localStorage.getItem('username')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    if (!tripInfo.area) {
      alert('여행지를 선택해주세요');
      return;
    }
    localStorage.setItem('area', tripInfo.area);
    localStorage.setItem('startDate', tripInfo.startDate);
    localStorage.setItem('endDate', tripInfo.endDate);
    localStorage.setItem('area_lat', tripInfo.areaLoc[0]);
    localStorage.setItem('area_lng', tripInfo.areaLoc[1]);
    navigate(`/mapHome/${localStorage.getItem('username')}`);
  };
  const onInit = () => {
    setTripInfo({ area: '', areaLoc: [], startDate: '', endDate: '' });
  };
  useEffect(() => {
    setTripInfo({ ...tripInfo, startDate: value[0], endDate: value[1] });
  }, [value]);

  return (
    <HomeContainer>
      <Navbar menus={['마이페이지']} />
      <IntroductionContainor>
        <h1>여행가자</h1>
        <h2>여행 일정 작성 도우미</h2>
        <h3>{`"여행 가자"와 함께 여행 일정을 작성해 보아요`}</h3>
      </IntroductionContainor>
      <AreaContainor>
        <h1>여행지를 선택해주세요</h1>
        <div className="areaInput">
          <BsSearch id="magnifyingIcon" size="23" />
          <input
            value={searchArea}
            onChange={(e) => {
              setTripInfo({...tripInfo,area:''});
              setSearchArea(e.target.value);
            }}
          />
        </div>
        <AreaCardContainor>
          {areas.map((area) => {
            if (searchArea === '') {
              return (
                <AreaCard key={area.area} onClick={() => onCardClick(area)}>
                  <img src={area.img} />
                  <div>{area.area}</div>
                </AreaCard>
              );
            }
            if (area.area.indexOf(searchArea) > -1) {
              return (
                <AreaCard key={area.area} onClick={() => onCardClick(area)}>
                  <img src={area.img} />
                  <div>{area.area}</div>
                </AreaCard>
              );
            }
          })}
        </AreaCardContainor>
      </AreaContainor>
      <DateContainor>
        <h1>날짜를 선택하세요</h1>
        <DateRangePicker
          calendarAriaLabel="Toggle calendar"
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          monthAriaLabel="Month"
          nativeInputAriaLabel="Date"
          onChange={onChange}
          value={value}
          yearAriaLabel="Year"
        />
      </DateContainor>
      <BtnContainor>
        <input type="button" value="초기화" onClick={onInit} />
        <input type="button" value="일정 생성" onClick={onMapHome} />
      </BtnContainor>
      <Footer>
        <center>
          <a href="https://github.com/KNU-gr-project/finalIdea">
            <FaGithub className="footer_icon" />
          </a>
          <a href="https://www.instagram.com/">
            <FaInstagram className="footer_icon" />
          </a>
          <div>KNU Graduation Project</div>
        </center>
      </Footer>
    </HomeContainer>
  );
}

export default Home;
