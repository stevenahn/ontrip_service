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
  height: 350px;
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

function SearchPassword({ setOpenSearchPassword }) {
  const [emailCheck, setEmailCheck] = useState(null);
  const [isValidate, setIsValidate] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      emailCheck: '',
      username: '',
      password: '',
      passwordCheck: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('옳바른 이메일을 작성하세요')
        .required('이메일을 입력하세요'),
      username: Yup.string()
        .max(15, 'username은 15자 이하로 설정해주세요')
        .required('required'),
      password: Yup.string().required('required'),
      passwordCheck: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'password is not matched',
      ),
    }),
    onSubmit: async (values) => {
      let changePassword;
      try {
        changePassword = await axios.put(
          'http://13.124.152.197:3001/users/change-password',
          {
            email: formik.values.email,
            newPassword: formik.values.password},
        );
      } catch (e) {
        console.log(e);
      }
      if(changePassword.data.errors){
        alert(changePassword.data.errors[0].msg);
        return;
      }
      alert("비밀번호 변경 성공");
      setOpenSearchPassword(false);
    },
  });
  const onEmail = async () => {
    if (!formik.values.email) {
      alert('이메일을 입력하세요');
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
      alert('이메일 인증 성공');
    } else {
      alert('보안 번호가 틀립니다.');
    }
  };
  const onResetPassword = async () => {
    if (!formik.values.username) {
      alert('username을 입력하세요');
      return;
    }
    if (emailCheck && formik.values.emailCheck === emailCheck.toString()) {
      let checkValidate = null;
      try {
        checkValidate = await axios.post(
          'http://13.124.152.197:3001/users/findPassword',
          formik.values,
        );
      } catch (e) {
        console.log(e);
      }
      if (checkValidate.data.errors) {
        alert(checkValidate.data.errors[0].msg);
      } else {
        setIsValidate(true);
      }
    }
  };
  return (
    <SearchIdContainer onClick={() => setOpenSearchPassword(false)}>
      <SearchIdContent
        onClick={(e) => e.stopPropagation()}
        onSubmit={formik.handleSubmit}
      >
        {!isValidate ? (
          <>
            <LoginText>
              <div />
              <h1>Password 찾기</h1>
            </LoginText>
            <LoginInput
              isWrong={formik.touched.username && formik.errors.username}
              id="username"
              name="username"
              type="username"
              placeholder="username"
              autoComplete="off"
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
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
                onBlur={formik.handleBlur}
                placeholder="본인인증코드"
                onChange={formik.handleChange}
                autoComplete="off"
              />
              <EmailBtn type="button" value="확인" onClick={onEmailCheck} />
            </EmailDiv>
            <EmailBtn
              type="button"
              value="비밀번호 변경"
              onClick={onResetPassword}
            />
          </>
        ) : (
          <>
            <LoginText>
              <div />
              <h1>Password 찾기</h1>
            </LoginText>

            <LoginInput
              isWrong={formik.touched.password && formik.errors.password}
              id="password"
              name="password"
              type="password"
              placeholder="new password"
              autoComplete="off"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <LoginInput
              isWrong={
                formik.touched.passwordCheck && formik.errors.passwordCheck
              }
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              placeholder="password check"
              autoComplete="off"
              value={formik.values.passwordCheck}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <EmailBtn type="submit" value="확인" />
          </>
        )}
      </SearchIdContent>
    </SearchIdContainer>
  );
}

SearchPassword.propTypes = {
  setOpenSearchPassword: PropTypes.func.isRequired,
};
export default SearchPassword;
