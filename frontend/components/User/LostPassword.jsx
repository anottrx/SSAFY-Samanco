import React, { useState, useEffect } from 'react';
import {
  sendEmailPWCodeAPI,
  checkEmailPWAPI,
  resetPWAPI,
} from '../../pages/api/user';
import Link from 'next/link';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import CheckEmailCode from './CheckEmailCode';
import ResetPassword from './ResetPassword';
import Swal from 'sweetalert2';

export default function LostPassword(props) {
  // 비밀번호 재설정

  // 이메일 정규표현식
  const emailReg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(false);

  const [authFin, setAuthFin] = useState(false);
  const [showEmailAgainText, setShowEmailAgainText] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [sendEmailButton, setSendEmailButton] = useState(true);

  const [reset, setReset] = useState(false);

  const changeHandle = (value, name) => {
    setCode(value);
  };

  const emailHandleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendEmailClick = (e) => {
    e.preventDefault();
    setCode(false);
    const value = email;

    if (!email) {
      // alert('이메일을 입력해주세요.');
      Swal.fire({
        icon: 'error',
        title: '이메일을 입력해주세요',
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    } else if (!emailReg.test(email)) {
      // alert('이메일 양식을 확인해 주세요.');
      Swal.fire({
        icon: 'error',
        title: '이메일 양식을 확인해 주세요',
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    } else {
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      sendEmailPWCodeAPI(value).then((res) => {
        // console.log(res)
        if (res.statusCode == 200) {
          // props.changeHandle(true, 'code');
          setAuthFin(true);
          setShowEmailAgainText(true);
        } else {
          //
          // props.changeHandle(false, 'code');
        }
      });
      setSendEmailButton(false);
      setShowCodeInput(true);
      // setAuthFin(true);
    }
  };

  const checkCodeClick = (e) => {
    e.preventDefault();
    // const value = code;

    if (!code) {
      // alert('인증코드 입력을 완료해 주세요');
      Swal.fire({
        icon: 'error',
        title: '인증코드 입력을 완료해 주세요',
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    } else {
      //   console.log(value);
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      // sendEmailCodeAPI(value).then((res) => {
      // });
      // console.log('인증번호 ' + code);
      setAuthFin(true);
      setReset(true);
      sessionStorage.setItem('email', email);
      // props.clickResetPasswordHandle(true, "reset");
      // setSendEmailButton(false); // 인증완료로 바꿔야함
    }
  };

  const setSendEmailButtonWork = () => {
    setSendEmailButton(true);
    setShowEmailAgainText(false);
    setAuthFin(false);
    setShowCodeInput(false);
  };

  const ShowEmailAgain = () => (
    <div>
      <Button onClick={setSendEmailButtonWork}>
        인증코드 재발급 / 이메일 변경
      </Button>
    </div>
  );

  return (
    <div>
      <Box
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: 'column' }}
        alignItems="center"
        minHeight="70vh"
      >
        <h1>비밀번호 재설정</h1>
        {reset ? (
          <ResetPassword />
        ) : (
          <>
            <h4>가입하신 이메일 주소를 입력해주세요</h4>
            {/* <br /> */}
            <FormControl sx={{ width: 370 }}>
              <OutlinedInput
                id="email"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={emailHandleChange}
                disabled={authFin ? true : false}
              />
            </FormControl>
            {showEmailAgainText ? <ShowEmailAgain /> : null}
            {showCodeInput ? (
              <CheckEmailCode
                changeHandle={changeHandle}
                email={email}
                lostpw={true}
              />
            ) : null}
            <br />
            <Button
              variant="contained"
              sx={{ width: 370, py: 1.2, fontSize: 14 }}
              onClick={sendEmailButton ? sendEmailClick : checkCodeClick}
            >
              {sendEmailButton ? '이메일 보내기' : '비밀번호 재설정하러 가기'}
            </Button>
          </>
        )}
      </Box>
    </div>
  );
}
