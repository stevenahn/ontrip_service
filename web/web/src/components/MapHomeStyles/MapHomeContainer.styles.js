import styled from 'styled-components';

export const MapHomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.defaultFont};
`;
export const MapHomeContainer = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: row;
`;
export const MapHomeLeftContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.grayBGColor};
`;
export const MapHomeCenterContainer = styled.div`
  flex: auto;
`;
export const MapHomeRightContainer = styled.div`
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.grayBGColor};
`;
