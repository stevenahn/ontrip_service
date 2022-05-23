import styled from 'styled-components';

export const Header = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
  text-align: center;
  height: 70px;
  background-color: white;
  padding:5px;
  border-radius: 3px;
  & div {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;
export const Contents = styled.div`
  flex: auto;
  overflow: auto;
`;
export const DayBox = styled.div`
  margin-top: 20px;
`;
export const DayTitle = styled.div`
  font-weight: bold;
  font-size: ${(props) => (props.clicked ? '25px' : '20px')};
  color: ${(props) => (props.clicked ? '#FF8282' : '#000')};
  &:hover {
    cursor: pointer;
  }
`;
