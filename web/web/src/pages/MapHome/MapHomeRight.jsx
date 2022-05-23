import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import proj4 from 'proj4';
import styled from 'styled-components';
// * : components
import RecommendModal from '../../components/RecommendModal';
import { BiPlusCircle, BiMinusCircle, BiInfoCircle } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import {
  MapHomeRightTop,
  MapHomeRightBottom,
  SearchPlace,
  RecommendedPlace,
  PlaceCard,
  IconDiv,
  MapHomeRightTopBtn,
} from '../../components/MapHomeStyles/MapHomeRight.styles';
// * : helpers
import { contexts } from '../../helpers/contexts';

// 위도 경도 변환용 proj4
proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
proj4.defs(
  'TM128',
  '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43',
);

const SearchDiv = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  & #magnifyingIcon {
    margin-left: 5px;
    margin-right: 5px;
  }
  & input {
    border: none;
    &:focus {
      outline: none;
    }
  }
`;

function MapHomeRight() {
  // * : states
  // 지도위에 있는 마커들 배열
  const { markers, setMarkers } = useContext(contexts);
  // 현재 클릭한 버튼에 따른 하단 컨텐츠들 (장소 또는 호텔)
  const [currentContents, setCurrentContents] = useState([]);
  // 호텔들 정보
  // const [hotelContents, setHotelContents] = useState(hotels);
  // 장소들 정보
  const [placeContents, setPlaceContents] = useState([]);
  // 검색한 장소들 정보
  // const [searchContents, setSearchContents] = useState([]);
  // 클릭한 버튼
  const [clickedBtn, setClickedBtn] = useState('추천 호텔');
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('추천 호텔');
  const [modalPlaces, setModalPlaces] = useState([]);
  const [recommendInfo, setRecommendInfo] = useState({});
  // input 값
  const [searchValue, setSearchValue] = useState('');

  // * : functions
  // 지도위에 마커 추가 함수
  const addMarkerOnMap = useCallback(
    (item) => {
      for (let i = 0; i < markers.length; i += 1) {
        if (markers[i].name === item.name) {
          // eslint-disable-next-line no-alert
          alert('이미 지도위에 존재합니다.');
          return;
        }
      }
      // 지도위에 현재 클릭한 마커 추가
      setMarkers((prevMarkers) => prevMarkers.concat({ ...item, onMap: true }));
    },
    [markers],
  );

  // 지도위에 마커 제거 함수
  const removeMarkerFromMap = useCallback((item) => {
    // 마커 배열에서 onMap이 false된 아이템 제거
    setMarkers((prevMarkers) =>
      prevMarkers.filter((_item) => {
        if (item.name === _item.name) {
          return false;
        }
        return true;
      }),
    );
  }, []);

  // input창 submit
  const searchPlace = async () => {
    const area = localStorage.getItem('area');
    await axios
      .post('http://13.124.152.197:3001/search/search', {
        search: `${area} ${searchValue}`,
      })
      .then((res) => {
        const newCurrentContents = res.data.map((place) => ({
          tag: 'search',
          name: place.title,
          address: place.address,
          address_road: place.roadAddress,
          site: place.link,
          img: place.imgUrl,
          lng: place.lng,
          lat: place.lat,
          onMap: false,
        }));
        setCurrentContents(newCurrentContents);
      });
    setSearchValue('');
  };

  const sendKeyword = async (keyword) => {
    const area = localStorage.getItem('area');
    let recPlace = [];
    let recSport = [];
    try {
      const res = await axios.post(
        `http://13.124.152.197:3001/recommend-${keyword}/search-keyword`,
        { keyword: area },
      );
      //console.log(data.data.response.body.items.item);
      const dataArr = res.data.response.body.items.item;
      const newCurrentContents = dataArr.map((place) => ({
        tag: keyword,
        contentId: place.contentid,
        name: place.title,
        address: place.addr1,
        img: place.firstimage,
        lng: place.mapx,
        lat: place.mapy,
        onMap: false,
      }));
      // setModalPlaces(res.data.response.body.items.item);
      recPlace = newCurrentContents;
      // setCurrentContents(newCurrentContents);
    } catch {}

    if (keyword === 'place') {
      try {
        const res = await axios.post(
          `http://13.124.152.197:3001/recommend-sport/search-keyword`,
          { keyword: area },
        );
        console.log(res);
        const dataArr = res.data;
        const newCurrentContents = dataArr.map((place) => ({
          tag: keyword,
          contentId: place.contentid,
          name: place.title,
          address: place.addr1,
          img: place.firstimage,
          lng: place.mapx,
          lat: place.mapy,
          onMap: false,
        }));
        recSport = newCurrentContents;
      // setCurrentContents(newCurrentContents);

      } catch (e) {
        console.log(e);
      }
    }
      setCurrentContents(recPlace.concat(recSport));

  };

  const showInfo = async (item) => {
    try {
      const res = await axios.post(
        `http://13.124.152.197:3001/recommend-${item.tag}/detailIntro`,
        { contentId: item.contentId },
      );
      const information = {
        name: item.name,
        img: item.img,
        address: res.data.eventplace || item.address,
        tel: res.data.sponsor1tel || res.data.infocenterlodging,
        detail: res.data,
        link: res.data.reservationurl,
        eventstartdate: res.data.eventstartdate,
        eventenddate: res.data.eventenddate,
        priceInfo: res.data.usetimefestival,
        playtime: res.data.playtime,
        checkintime: res.data.checkintime,
        checkouttime: res.data.checkouttime,
        parking: res.data.parkinglodging,
        foodplace: res.data.foodplace,
        subfacility: res.data.subfacility,
      };
      setRecommendInfo(information);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    // 클릭한 버튼에 따라 표시되는 장소 카드들의 상태(+,-)를 최신값으로 유지
    switch (clickedBtn) {
      case '추천 호텔':
        // setCurrentContents(hotelContents);
        setCurrentContents(modalPlaces);
        break;
      case '추천 장소':
        // setCurrentContents(placeContents);
        setCurrentContents(modalPlaces);
        break;
      default:
        setCurrentContents(markers);
    }
  }, [markers, clickedBtn]);

  return (
    <>
      {openModal && (
        <RecommendModal
          setOpenModal={setOpenModal}
          addMarkerOnMap={addMarkerOnMap}
          modalTitle={modalTitle}
          modalPlaces={modalPlaces}
          info={recommendInfo}
        />
      )}
      <MapHomeRightTop>
        <SearchDiv>
          <BsSearch id="magnifyingIcon" />
          <SearchPlace
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchPlace(searchValue);
              }
            }}
          />
        </SearchDiv>
        <RecommendedPlace>
          <MapHomeRightTopBtn
            clicked={clickedBtn === '추천 호텔'}
            onClick={() => {
              sendKeyword('stay');
              setClickedBtn('추천 호텔');
              setModalTitle('추천 호텔');
              setOpenModal(false);
            }}
          >
            추천 호텔
          </MapHomeRightTopBtn>
          <MapHomeRightTopBtn
            clicked={clickedBtn === '추천 장소'}
            onClick={() => {
              sendKeyword('place');
              setClickedBtn('추천 장소');
              setModalTitle('추천 장소');
              setOpenModal(false);
            }}
          >
            추천 장소
          </MapHomeRightTopBtn>
        </RecommendedPlace>
        <MapHomeRightTopBtn
          clicked={clickedBtn === '선택한 장소'}
          onClick={() => {
            setClickedBtn('선택한 장소');
          }}
        >
          선택한 장소
        </MapHomeRightTopBtn>
      </MapHomeRightTop>
      <MapHomeRightBottom>
        {currentContents.map((item, index) => (
          <PlaceCard key={item.name}>
            <img src={item.img} alt="이미지 안뜸" />
            <div>
              <div>{currentContents[index].name}</div>
              <IconDiv>
                <BiInfoCircle
                  onClick={() => {
                    showInfo(item);
                    setOpenModal(true);
                  }}
                  size={18}
                />
                {item.onMap ? (
                  <BiMinusCircle
                    color="red"
                    size={18}
                    onClick={() => {
                      removeMarkerFromMap(item, index);
                    }}
                  />
                ) : (
                  <BiPlusCircle
                    size={18}
                    onClick={() => {
                      addMarkerOnMap(item);
                    }}
                  />
                )}
              </IconDiv>
            </div>
          </PlaceCard>
        ))}
      </MapHomeRightBottom>
    </>
  );
}

export default MapHomeRight;
