import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// * : Components
import Navbar from '../../components/Navbar';
import {
  MainContainer,
  FormContainer,
  FormContents,
  LoginText,
  LoginInput,
  ButtonContainer,
} from '../../components/UserStyles/UserStyles';

const EmailDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;
const EmailBtn = styled.input`
  flex: auto;
`;
function SignUp() {
  // * : states
  const navigate = useNavigate();
  const [emailCheck, setEmailCheck] = useState('');
  const [isEmailVal, setIsEmailVal] = useState(false);

  // * : functions
  const onEmail = async () => {
    alert('E-mail로 보안 코드를 전송하였습니다.');
    await axios
      .post('http://13.124.152.197:3001/users/email-auth', formik.values)
      .then((e) => {
        console.log(e.data.SecurityCode)
        setEmailCheck(e.data.SecurityCode);
      });
  };
  const onEmailCheck = () => {
    if (emailCheck && formik.values.emailCheck === emailCheck.toString()) {
      alert('본인 인증 성공');
      setIsEmailVal(true);
      return;
    }
    alert('인증 번호가 틀립니다.');
  };
  // * : Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      emailCheck: '',
      password: '',
      passwordCheck: '',
      username: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, 'username은 15자 이하로 설정해주세요')
        .required('required'),
      password: Yup.string().required('required'),
      passwordCheck: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'password is not matched',
      ),
      email: Yup.string()
        .email('옳바른 이메일을 작성하세요')
        .required('required'),
    }),
    onSubmit: async (values) => {
      if (!isEmailVal) {
        alert('이메일 보안 인증을 하세요');
        return;
      }
      let isLogin;
      try {
        isLogin = await axios.post('http://13.124.152.197:3001/users', values);
      } catch (e) {
        console.log(e);
      }
      if (isLogin.data.errors) {
        alert(isLogin.data.errors[0].msg);
      } else {
        alert('회원가입이 완료되었습니다.');
        navigate('../login');
      }
    },
  });
  return (
    <MainContainer>
      <Navbar menus={['일정생성', '추천코스']} />
      <FormContainer>
        <FormContents onSubmit={formik.handleSubmit}>
          <LoginText>
            <div />
            <h1>Sign Up</h1>
            <h3>Create your new registration to get service</h3>
          </LoginText>
          <LoginInput
            id="username"
            name="username"
            type="text"
            placeholder="username"
            autoComplete="off"
            isWrong={formik.touched.username && formik.errors.username}
            value={formik.values.username}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <LoginInput
            isWrong={formik.touched.password && formik.errors.password}
            id="password"
            name="password"
            type="password"
            placeholder="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <LoginInput
            isWrong={
              formik.touched.passwordCheck && formik.errors.passwordCheck
            }
            id="passwordCheck"
            name="passwordCheck"
            type="password"
            value={formik.values.passwordCheck}
            placeholder="password check"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
              placeholder="본인인증코드"
              onChange={formik.handleChange}
              autoComplete="off"
            />
            <EmailBtn type="button" value="확인" onClick={onEmailCheck} />
          </EmailDiv>
          <ButtonContainer>
            <input type="button" value="취소" onClick={()=>{navigate('../login')}}/>
            <input type="submit" value="회원 가입" />
          </ButtonContainer>
        </FormContents>
      </FormContainer>
    </MainContainer>
  );
}

export default SignUp;
