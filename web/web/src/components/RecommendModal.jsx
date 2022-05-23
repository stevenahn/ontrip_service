import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { MdClose } from 'react-icons/md';

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  padding: 10px;
  width: 60%;
  height: 70vh;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  overflow: auto;
  button {
    float: right;
  }
  & .modalTitle {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
  }
  & .closeIcon {
    margin: 10px;
    float: right;
  }
  & .subContent {
    padding: 10px;
  }
`;
const ModalContent = styled.div`
  display: flex;
  div {
    padding: 10px;
  }
  & .imgDiv {
    flex: 1;
    text-align: center;
    & img {
      width: 100%;
    }
  }
  & .infoDiv {
    flex: 1;
  }
`;

function RecommendModal({
  setOpenModal,
  addMarkerOnMap,
  modalTitle,
  modalPlaces,
  info,
}) {
  return (
    <ModalContainer>
      <MdClose
        className="closeIcon"
        size={18}
        onClick={() => setOpenModal(false)}
      />
      <div className="modalTitle">{modalTitle}</div>
      <ModalContent>
        <div className="imgDiv">
          <img src={info.img} alt="이미지 없음"></img>
        </div>
        <div className="infoDiv">
          <div>{info.name}</div>
          <div>주소 : {info.address}</div>
          <div>전화 번호 : {info.tel}</div>
          {info.link && <div dangerouslySetInnerHTML={{ __html: info.link }} />}
          {info.checkintime && (
            <div>
              check in / check out : {info.checkintime} / {info.checkouttime}
            </div>
          )}
          {info.eventstartdate && (
            <div>
              기간 : {info.eventstartdate} ~ {info.eventenddate}
            </div>
          )}
          {info.parking && <div>{info.parking}</div>}
          {info.playtime && <div>운영 시간 : {info.playtime}</div>}
          {info.priceInfo && (
            <>
              <div>- 금액 - </div>
              <div dangerouslySetInnerHTML={{ __html: info.priceInfo }} />
            </>
          )}
        </div>
      </ModalContent>
      <div className="subContent">
        <div>{info.foodplace && `식당 : ${info.foodplace}`}</div>
        <div>{info.subfacility && `부가시설 : ${info.subfacility}`}</div>
      </div>
      {/* {modalPlaces.map((place) => (
        <PlaceCard key={place.title}>
          <img src={place.firstimage} alt="이미지 없음"></img>
          <div className="cardInfo">
            <div>{place.title}</div>
            <div>{place.addr1}</div>
            <div>{place.tel}</div>
            <button
              onClick={() => {
                addMarkerOnMap({
                  tag: 'search',
                  name: place.title,
                  lat: place.mapy,
                  lng: place.mapx,
                  onMap: false,
                });
              }}
            >
              add
            </button>
          </div>
        </PlaceCard>
      ))} */}
    </ModalContainer>
  );
}

RecommendModal.propTypes = {
  setOpenModal: PropTypes.func,
  addMarkerOnMap: PropTypes.func,
  modalTitle: PropTypes.string,
  modalPlaces: PropTypes.array,
  info: PropTypes.object,
};
export default RecommendModal;
