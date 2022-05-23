import React, {
  useEffect,
  useContext,
  useCallback,
  useState,
  useRef,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';
// * : helpers
import { contexts } from '../../helpers/contexts';
import hotelIcon from '../../img/lodging.png';
import eventIcon from '../../img/event.png';
import normalIcon from '../../img/normal.png';
import airportIcon from '../../img/airport.png';


const MileStone = (distance, time) => `
<div style=
"display:inline-block;
padding:0px;
text-align:center;
font-size:15px;
border:none;">
<div>${distance || '? '}km</div>
<div>${time || '? '}</div>
</div>`;

function NaverMap() {
  // * : 변수들
  const { markers, clickedDay, setClickedDay } = useContext(contexts);
  // const polyLines = useRef([]);
  // const mileStones = useRef([]);
  const [mileStones, setMileStones] = useState([]);
  const [polyLines, setPolyLines] = useState([]);
  const [dayPolyLines, setDayPolyLines] = useState([]);
  const [centerLoc, setCenterLoc] = useState([]);

  // 첫 우클릭 체크 용
  // const count = useRef(-1);
  // 중심좌표
  // 지도 기본 설정
  const mapOptions = {
    center: new window.naver.maps.LatLng(centerLoc[0], centerLoc[1]),
    zoom: 11,
  };
  const centerPoint = useRef({ point: null, title: '' });
  let map;
  // * : 함수
  // 마커 클릭 이벤트 함수
  const getClickHandler = useCallback(
    (marker, infoWindow) => {
      // 왼쪽 사이드바 day가 클릭이 안되어 있을 경우 정보 표시
      // !: clickedDay가 바뀌면 무한으로 함수 렌더링 됨
      if (clickedDay.day) {
        setClickedDay({
          ...clickedDay,
          places: clickedDay.places.concat({
            name: marker.title,
            img: marker.img,
            position: marker.position,
          }),
        });
      } else if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    },
    [clickedDay],
  );
  const getInfoFromCenterPoint = (point) => {
    return axios.post('http://13.124.152.197:3001/compare-distance', {
      start: [
        centerPoint.current.point['_lng'],
        centerPoint.current.point['_lat'],
      ],
      goal: [point['_lng'], point['_lat']],
    });
  };

  const milliToTime = (milliSec) => {
    const hour = Math.floor((milliSec / (1000 * 60 * 60)) % 24);
    const minute = Math.floor(
      (milliSec - hour * (1000 * 60 * 60)) / (1000 * 60),
    );
    if (hour >= 1) {
      return `${hour}시간${minute}분`;
    }
    return `${minute}분`;
  };

  // 중심 좌표 설정
  useEffect(() => {
    setCenterLoc([
      localStorage.getItem('area_lat'),
      localStorage.getItem('area_lng'),
    ]);
  }, []);
  // day 변경되었을 경우 dayPolyline 변경
  useEffect(() => {
    setDayPolyLines({
      map,
      path: clickedDay.places.map((place) => place.position),
      strokeColor: '#FF8282',
      strokeWeight: 2,
      // startIcon: window.naver.maps.PointingIcon.CIRCLE,
      // endIcon: window.naver.maps.PointingIcon.OPEN_ARROW,
      startIconSize: 10,
      endIconSize: 15,
    });
    // 거리 비교 polyline 초기화
    centerPoint.current = { point: null, title: null };
    setMileStones([]);
    setPolyLines([]);
  }, [clickedDay]);
  useEffect(() => {
    // 지도 생성
    map = new window.naver.maps.Map('map', mapOptions);
    // 마커 + 이벤트 생성기
    for (let i = 0; i < markers.length; i += 1) {
      let iconSrc = normalIcon;
      if (markers[i].tag === 'stay') {
        iconSrc = hotelIcon;
      } else if (markers[i].tag === 'place') {
        iconSrc = eventIcon;
      } else if(markers[i].name.indexOf('공항')>-1){
        iconSrc = airportIcon;
      }
      // 지도에 마커 하나 그리기
      const marker = new window.naver.maps.Marker({
        map,
        title: markers[i].name,
        img: markers[i].img,
        position: new window.naver.maps.LatLng(markers[i].lat, markers[i].lng),
        icon: {
          content: `<img src=${iconSrc} style="width:40px;"/>`,
          size: new window.naver.maps.Size(10, 12),
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(20, 37),
        },
        zIndex: 100,
      });
      // 마커에 달릴 정보
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="width:300px;text-align:center;padding:10px;"><b>
        ${markers[i].name}<br>
        사이트 : ${markers[i].site}<br>
        주소 : ${markers[i].address}<br>
        도로명 주소 : ${markers[i].address_road}<br>
        </b><br>-네이버 지도 -</div>`,
      });

      // 마커 이벤트 리스너
      window.naver.maps.Event.addListener(marker, 'mousedown', async (e) => {
        if (e.domEvent.button === 2) {
          // 우클릭시 day화살표 초기화
          setDayPolyLines([]);

          // 중심 좌표 클릭 시 초기화
          if (e.overlay.title === centerPoint.current.title) {
            console.log('중심좌표 초기화');
            centerPoint.current = { point: null, title: null };
            setMileStones([]);
            setPolyLines([]);
            return;
          }
          const point = e.coord;
          if (!centerPoint.current.point) {
            console.log('중심좌표 설정 완료');
            centerPoint.current = { point, title: e.overlay.title };
          } else {
            // polyLines 추가
            setPolyLines(
              polyLines.concat({
                map,
                path: [centerPoint.current.point, point],
                strokeColor: 'red',
                strokeStyle: 'longdash',
                strokeWeight: 1.5,
                // strokeOpacity: 0.5,
                // startIcon: naver.maps.PointingIcon.CIRCLE,
                // startIconSize: 25,
              }),
            );
            // mileStone 추가
            try {
              const roadInfo = await getInfoFromCenterPoint(point);
              console.log('readInfo', roadInfo);
              const { distance, time } = roadInfo.data;
              setMileStones(
                mileStones.concat({
                  position: point,
                  icon: {
                    content: MileStone(
                      Math.round((distance / 1000) * 10) / 10,
                      milliToTime(time),
                    ),
                    anchor: new window.naver.maps.Point(10, -20),
                  },
                  map,
                }),
              );
            } catch (err) {
              console.error(err);
            }
          }
        } else {
          console.log('좌클릭 실행');
          getClickHandler(marker, infoWindow);
        }
      });
    }
    // polyLine, mileStone 그리기
    polyLines.map(
      (polyLine) => new window.naver.maps.Polyline({ ...polyLine, map: map }),
    );

    new window.naver.maps.Polyline({ ...dayPolyLines, map: map });
    mileStones.map(
      (mileStone) => new window.naver.maps.Marker({ ...mileStone, map: map }),
    );
  }, [markers, clickedDay, polyLines, mileStones, dayPolyLines]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
}

export default NaverMap;
