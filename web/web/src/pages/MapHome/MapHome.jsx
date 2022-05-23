// * : libraries
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useBeforeunload } from "react-beforeunload";
// * : helpers
import { contexts, tripInfoContext } from '../../helpers/contexts';
import { AuthContext } from '../../helpers/AuthContext';
// * : components
import {
  MapHomeDiv,
  MapHomeContainer,
  MapHomeRightContainer,
  MapHomeCenterContainer,
  MapHomeLeftContainer,
} from '../../components/MapHomeStyles/MapHomeContainer.styles';
import Navbar from '../../components/Navbar';
import NaverMap from './NaverMap';
import MapHomeRight from './MapHomeRight';
import MapHomeLeft from './MapHomeLeft';
import { useNavigate } from 'react-router-dom';

function MapHome() {
  const { authState, setAuthState, tripInfo, setTripInfo } =
    useContext(AuthContext);
  const navigate = useNavigate();
  // 지도위에 찍혀 있는 마커들 배열
  const [markers, setMarkers] = useState([]);
  // 날짜 클릭시 해당하는 날짜 정보
  const [clickedDay, setClickedDay] = useState({ day: 0, places: [], img: '' });
  const { username } = useParams();

  useBeforeunload((event) => { 
    event.preventDefault();
  });
  useEffect(async () => {
    if (!username) {
      console.log('id가 없음');
      navigate('/login');
    }
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }

    if (
      !localStorage.getItem('area') ||
      !localStorage.getItem('area_lng') ||
      !localStorage.getItem('area_lat') ||
      !localStorage.getItem('startDate' || !localStorage.getItem('endDate'))
    ) {
      navigate('../');
    }

    let basicInfo;
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
      console.log(e);
    }
  }, []);
  return (
    <MapHomeDiv>
      <contexts.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          markers,
          setMarkers,
          clickedDay,
          setClickedDay,
        }}
      >
        <Navbar menus={['Home', '마이페이지']} />
        <MapHomeContainer>
          <MapHomeLeftContainer>
            <MapHomeLeft />
          </MapHomeLeftContainer>
          <MapHomeCenterContainer>
            <NaverMap __placesAll={[]} />
          </MapHomeCenterContainer>
          <MapHomeRightContainer>
            <MapHomeRight />
          </MapHomeRightContainer>
        </MapHomeContainer>
      </contexts.Provider>
    </MapHomeDiv>
  );
}

export default MapHome;
