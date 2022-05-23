import styled from 'styled-components';

export const MapHomeRightTop = styled.div`
  display: flex;
  height: 110px;
  margin-bottom: 10px;
  flex-direction: column;
  justify-content: space-between;
`;
export const MapHomeRightTopBtn = styled.button`
  height: 30px;
  border: none;
  border-radius: 10px;
  background-color: ${(props) => (props.clicked ? '#DCFCFC' : '#FFFFFF')};
  box-shadow: 0px 0px 5px 2px #f0f0f0;
  font-family: ${(props) => props.theme.defaultFont};
  font-weight: ${(props) => (props.clicked ? 'bold' : '')};
  &:active {
    box-shadow: 0px 0px 5px 2px #f0f0f0 inset;
  }
`;
export const MapHomeRightBottom = styled.div`
  height: calc(100% - 110px);
  overflow: auto;
`;
export const SearchPlace = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 30px;
`;
export const RecommendedPlace = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  & button {
    width: 45%;
  }
`;
export const PlaceCard = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  width: 100%;
  height: 70px;
  margin: 10px 0;
  border: none;
  background-color: white;
  box-shadow: 0px 0px 5px 2px #f0f0f0;
  & img {
    width: 50px;
  }
  & div {
    flex: auto;
    padding: 4px;
  }
`;

export const IconDiv = styled.div`
position: absolute;
right:8px;
bottom:5px;
display: flex;
  /* & svg {
    cursor: pointer;
    position: absolute;
    right: 8px;
    bottom: 5px;
  } */
  & svg:hover {
  }
`;
