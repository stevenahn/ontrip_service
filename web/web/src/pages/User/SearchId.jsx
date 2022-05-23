import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  width: 80%;
`;
const EmailBtn = styled.input`
  flex: auto;
`;

function SearchId({ setOpenSearchId }) {
  const [emailCheck, setEmailCheck] = useState(null);
  const [foundUsername, setFoundUsername] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      emailCheck: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('옳바른 이메일을 작성하세요')
        .required('이메일을 입력하세요'),
    }),
    onSubmit: async (values) => {},
  });
  const onEmail = async () => {
    if(!formik.values.email){
      alert("이메일을 입력하세요")
      return;
    }
    if (formik.errors.email) {
      alert(formik.errors.email);
      return;
    }
    alert('E-mail로 보안 코드를 전송하였습니다.');
    await axios
      .post('http://13.124.152.197:3001/users/email-auth', formik.values)
      .then((e) => {
        setEmailCheck(e.data.SecurityCode);
      });
  };
  const onEmailCheck = async () => {
    if (emailCheck && formik.values.emailCheck === emailCheck.toString()) {
      let searchedId = null;
      try {
        searchedId = await axios.post(
          'http://13.124.152.197:3001/users/findId',
          formik.values,
        );
      } catch (e) {
        console.log(e);
      }
      setFoundUsername(searchedId.data.username);
    } else {
      alert('보안 번호가 틀립니다.');
    }
  };
  return (
    <SearchIdContainer onClick={() => setOpenSearchId(false)}>
      <SearchIdContent onClick={(e) => e.stopPropagation()}>
        <LoginText>
          <div />
          <h1>ID 찾기</h1>
        </LoginText>
        <EmailDiv>
          <LoginInput
            isWrong={formik.touched.email && formik.errors.email}
            id="email"
            name="email"
            type="email"
            placeholder="email"
            autoComplete="off"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <EmailBtn type="button" value="전송" onClick={onEmail} />
        </EmailDiv>
        <EmailDiv>
          <LoginInput
            isWrong={formik.touched.emailCheck && formik.errors.emailCheck}
            id="emailCheck"
            name="emailCheck"
            value={formik.values.emailCheck}
            placeholder="본인인증코드"
            onChange={formik.handleChange}
            autoComplete="off"
          />
          <EmailBtn type="button" value="확인" onClick={onEmailCheck} />
        </EmailDiv>
        <LoginInput value={foundUsername} readOnly />
      </SearchIdContent>
    </SearchIdContainer>
  );
}

SearchId.propTypes = {
  setOpenSearchId: PropTypes.func.isRequired,
};
export default SearchId;
