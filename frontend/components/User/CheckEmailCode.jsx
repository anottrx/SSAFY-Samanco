import React, { useState } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';

import { checkEmailCodeAPI, checkEmailPWAPI } from '../../pages/api/user';
import CountdownTimer from '../Common/CountdownTimer';

export default function CheckEmailCode(props) {
  const [inputValue, setInputValue] = useState({
    code: '',
    email: props.email,
  });
  const [code, setCode] = useState('');
  const [authFin, setAuthFin] = useState(false);
  const [timer, setTimer] = useState(true);

  const codeHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setCode(value);
  };

  const changeTimerHandle = (value, name) => {
    setTimer(value);
    props.changeHandle(false, 'code');
    Swal.fire({
      icon: 'error',
      title: '시간이 만료되었습니다! 인증코드를 재발급해 주세요',
      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
    }).then(() => {
      setAuthFin(true);
    });
  };

  const compareEmailCodeClick = (e) => {
    // 이메일로 받은 인증번호 입력해서 확인하기 + 확인 완료되면 폼 닫고 이메일 입력 못 받게 바꾸기
    e.preventDefault();
    const value = code;
    inputValue.code = code;
    inputValue.email = props.email;

    if (!value) {
      Swal.fire({
        icon: 'error',
        title: '인증번호를 입력해주세요',
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    } else {
      if (props.lostpw) {
        // console.log('비밀번호 잃어버려서 온 것')
        Swal.fire({
          title: '인증번호를 확인 중입니다',
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();

            checkEmailPWAPI(inputValue).then((res) => {
              if (res.statusCode == 200) {
                Swal.fire({
                  title: '인증에 성공했습니다',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 500,
                });
                props.changeHandle(true, 'code');
                setAuthFin(true);
              } else if (res.statusCode == 401) {
                Swal.fire({
                  icon: 'error',
                  title: '인증번호를 잘못 입력했습니다',
                  text: '다시 확인해주세요',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
              } else {
                props.changeHandle(false, 'code');
              }
            });
          },
        });
      } else {
        // console.log('회원가입하다가 온 것')
        Swal.fire({
          title: '인증번호를 확인 중입니다',
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();

            checkEmailCodeAPI(inputValue).then((res) => {
              if (res.statusCode == 200) {
                Swal.fire({
                  title: '이메일 인증에 성공했습니다',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 500,
                });
                props.changeHandle(true, 'code');
                setAuthFin(true);
              } else if (res.statusCode == 401) {
                Swal.fire({
                  icon: 'error',
                  title: '인증번호를 잘못 입력했습니다',
                  text: '다시 확인해주세요',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '문제가 발생했습니다. 다시 시도해주세요.',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
                props.changeHandle(false, 'code');
              }
            });
          },
        });
      }
    }
  };

  return (
    <div>
      {authFin ? (
        <></>
      ) : (
        <>
          <Typography display="inline" sx={{ fontSize: 14 }}>
            인증번호 확인
          </Typography>
          <CountdownTimer changeTimerHandle={changeTimerHandle} />
          <br />
          <OutlinedInput
            type="text"
            id="code"
            placeholder="이메일 인증번호"
            value={code}
            onChange={codeHandleChange}
            sx={{ width: 370 }}
            disabled={authFin ? true : false}
            endAdornment={
              <InputAdornment position="end">
                <Button onClick={compareEmailCodeClick}>확인</Button>
              </InputAdornment>
            }
          />
        </>
      )}
    </div>
  );
}
