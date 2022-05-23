import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../helpers/AuthContext';
import {
  MainContainer,
  FormContainer,
  FormContents,
  LoginText,
  LoginInput,
  ButtonContainer,
} from '../../components/UserStyles/UserStyles';

const SearchIdContainer = styled(MainContainer)`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
`;
const SearchIdContent = styled(FormContents)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  box-shadow: none;
`;
const EmailDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
`;
function ChangePw({ setOpenChangePw }) {
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const { authState, setAuthState } = useContext(AuthContext);
  const onChange = async () => {
    if(newPassword === checkPassword){
      try{
        const isChanged = await axios.put('http://13.124.152.197:3001/users/change-password',{
          email: authState.email,
          newPassword
        });
        console.log(isChanged);
        if(!isChanged.data.errors){
          alert("변경완료");
        }
      }catch(e){
        console.log(e);
      }
      return;
    }
    alert("비밀번호 확인 요망");
  };
  return (
    <SearchIdContainer onClick={() => setOpenChangePw(false)}>
      <SearchIdContent onClick={(e) => e.stopPropagation()}>
        <LoginText>
          <div />
          <h1>PW 변경</h1>
        </LoginText>
        <h3>변경하려고 하는 비밀번호를 입력하세요</h3>
        <EmailDiv>
          <h1>비밀번호</h1>
          <LoginInput
          type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </EmailDiv>
        <EmailDiv>
          <h1>비밀번호 확인</h1>
          <LoginInput
          type='password'
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
        </EmailDiv>
        <input type="button" value="변경하기" onClick={onChange} />
      </SearchIdContent>
    </SearchIdContainer>
  );
}

ChangePw.propTypes = {
  setOpenChangePw: PropTypes.func.isRequired,
};
export default ChangePw;
