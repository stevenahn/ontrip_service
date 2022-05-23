import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  background-color: ${(props) => props.theme.grayBGColor};
  font-family: ${(props) => props.theme.defaultFont};
`;
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
export const FormContents = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  width: 500px;
  height: 550px;
  box-shadow: 1px 2px 8px 1px rgb(222, 222, 222);
  background-color: white;
  border-radius: 5px;
`;
export const LoginText = styled.div`
  width: 80%;
  & div {
    position: relative;
    top: 15px;
    border: 3px solid ${(props) => props.theme.mainColor};
  }
  & h1 {
    position: relative;
    display: inline-block;
    padding: 0 10px;
    background-color: white;
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  & h3 {
    color: rgb(222, 222, 222);
  }
`;
export const LoginInput = styled.input`
box-sizing: border-box;
  padding: 5px;
  border: 2px solid ${(props) => {
    if(props.isWrong){
      return 'red';
    }
    return props.theme.grayBGColor
  }};
  border-radius: 3px;
  height: 50px;
  width: 80%;
  &:focus {
    border:none;
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  justify-content: space-between;

  & input {
    width: 45%;
    height: 40px;
    margin-bottom: 30px;
    background-color: ${(props) => props.theme.mainColor};
    border: none;
    border-radius: 5px;
    &:hover{
    background-color: #c2f7f7;
    }
    &:active{
      position: relative;
      top:1px;
      left:1px;
    }
  }
`;