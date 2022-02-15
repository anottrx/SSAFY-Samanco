import RegistInfo from './RegistAdd';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import CheckEmailCode from './CheckEmailCode';
import { useCookies } from 'react-cookie';

import {
  registAPI,
  loginAPI,
  checkNicknameAPI,
  sendEmailCodeAPI,
  getUserLoginTokenAPI,
} from '../../pages/api/user';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Swal from 'sweetalert2';
import styled from '@emotion/styled';

export default function Regist() {
  const [pwCheckRes, setPwCheckRes] = useState(null);
  const [pwSameRes, setPwSameRes] = useState(null);

  const [nicknameCheckRes, setNicknameCheckRes] = useState(null); // 닉네임 중복검사
  const [cookies, setCookie] = useCookies(['userToken', 'userEmail']);

  const [authFin, setAuthFin] = useState(false);
  const [showEmailCodeCheck, setShowEmailCodeCheck] = useState(false);

  const [code, setCode] = useState('');
  const [inputState, setInputState] = useState({
    name: '',
    password: '',
    passwordConfirm: '',
    email: '',
    nickname: '',
    class: 'JAVA',
    generation: '6',
    studentId: '',
    code: false,
    showPassword: false,
    showPasswordConfirm: false,
  });

  const generationOptions = [
    { value: '1', name: '1기' },
    { value: '2', name: '2기' },
    { value: '3', name: '3기' },
    { value: '4', name: '4기' },
    { value: '5', name: '5기' },
    { value: '6', name: '6기' },
    { value: '7', name: '7기' },
  ];

  const classOptions = [
    { value: 'JAVA', name: '자바반' },
    { value: 'PYTHON', name: '파이썬반' },
    { value: 'MOBILE', name: '모바일반' },
    { value: 'EMBEDDED', name: '임베디드반' },
  ];

  const changeHandle = (value, name) => {
    inputState[name] = value;
    if (value == false) {
      setAuthFin(false);
      // setShowEmailCodeCheck(true);
    }
    // 리렌더링 X
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const generationHandleChange = (e) => {
    inputState.generation = e.target.value;
  };

  const classHandleChange = (e) => {
    // inputState.userClass = e.target.value;
    inputState.class = e.target.value;
  };

  const nicknameHandleChange = (e) => {
    const value = e.target.value;
    checkNicknameAPI(value).then((res) => {
      // console.log("닉네임이 " +value+"인 사람의 닉네임API 체크 결과" + res)
      setNicknameCheckRes({ code: res.statusCode, msg: res.message });
    });
  };

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };
  const handleClickShowPasswordConfirm = () => {
    setInputState({
      ...inputState,
      showPasswordConfirm: !inputState.showPasswordConfirm,
    });
  };

  const sendEmailCodeClick = (e) => {
    // 이메일로 인증번호 보내기 + 인증번호 입력 받을 수 있게 폼 열기
    e.preventDefault();
    let isNormal = true;
    let msg = '';
    // else  if(inputState.code==false) {
    //     setShowEmailCodeCheck(false);
    //     setAuthFin(false);
    //   }

    if (!inputState.email) {
      isNormal = false;
      msg = '이메일을 입력해주세요.';
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = '이메일 양식을 확인해주세요.';
    } else {
      // 인증코드 보내기
      setShowEmailCodeCheck(true);
      setAuthFin(true); // 우선 인증버튼 누르자마자 막기
      Swal.fire({
        title: '인증번호를 전송중입니다',
        text: '전송에 시간이 조금 걸릴 수 있으니 조금만 기다려주세요',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
          sendEmailCodeAPI(inputState.email).then((res) => {
            // console.log(res);
            if (res.statusCode == 200) {
              // console.log('보냄');
              Swal.fire({
                title: '이메일로 인증번호를 전송했습니다',
                text: '이메일 수신에 시간이 조금 걸릴 수 있습니다',
                icon: 'info',
                showConfirmButton: false,
                timer: 800,
              });
            } else if (res.statusCode == 401) {
              // alert('이미 있는 이메일주소입니다. 다른 이메일로 시도해주세요');
              Swal.fire({
                title: '이미 있는 이메일주소입니다. 다른 이메일로 시도해주세요',
                icon: 'error',
                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
              });
              setShowEmailCodeCheck(false);
              setAuthFin(false); // 우선 인증버튼 누르자마자 막기
            } else {
              //
            }
          });
        },
      });
    }
  };

  const sendEmailCodeAgainClick = (e) => {
    setShowEmailCodeCheck(false);
    setAuthFin(false);
  };

  const pwHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setPwCheckRes(
      pwReg.test(value)
        ? { code: 200, msg: '사용 가능한 비밀번호입니다.' }
        : {
            code: 401,
            msg: '비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.',
          }
    );
  };

  const pwSameCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.password == value ? true : false);
  };
  const pwSameOtherCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.passwordConfirm == value ? true : false);
  };

  const idReg = /^[A-Za-z0-9_-]{4,8}$/;
  // 아이디 정규표현식 : 최소 4자, 최대 8자

  const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{8,16}$/;
  // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자

  const emailReg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  // 이메일 정규표현식

  const phoneReg = /^[0-9]{8,13}$/;
  // 전화번호 정규표현식

  const koreanReg = /[ㄱ-ㅎㅏ-ㅣ가-힇ㆍ ᆢ]/g;

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = '';

    if (!inputState.email) {
      isNormal = false;
      msg = '이메일을 입력해주세요.';
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = '이메일 양식을 확인해주세요.';
    } else if (!authFin || !showEmailCodeCheck || !inputState.code) {
      isNormal = false;
      msg = '이메일 인증을 해주세요.';
    } else if (!inputState.nickname) {
      isNormal = false;
      msg = '닉네임을 입력해주세요.';
    } else if (!inputState.password) {
      isNormal = false;
      msg = '비밀번호를 입력해주세요.';
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = '비밀번호 양식을 확인해주세요.';
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = '비밀번호가 동일하지 않습니다.';
    } else if (!inputState.generation) {
      isNormal = false;
      msg = '기수를 입력해주세요.';
    } else if (!inputState.class) {
      isNormal = false;
      msg = '반을 입력해주세요.';
    } else if (!inputState.studentId) {
      isNormal = false;
      msg = '학번을 입력해주세요.';
    } else if (!inputState.name) {
      isNormal = false;
      msg = '이름을 입력해주세요.';
    }

    if (isNormal) {
      const formData = new FormData();

      Object.keys(inputState).map((key) => {
        let value = inputState[key];
        formData.append(key, value);
      });

      for (var key of formData.entries()) {
        // console.log(`${key}`);
      }

      if (isNormal) {
        Swal.fire({
          title: '회원가입 중입니다',
          showConfirmButton: false,
          didOpen: () => {
            registAPI(formData).then((res) => {
              if (res.statusCode == 200) {
                // 가입 성공 시
                loginAPI(inputState).then((res) => {
                  setCookie('userToken', res.accessToken); // 쿠키 설정
                  setCookie('userEmail', inputState.email);
                  const token = res.accessToken;
                  // console.log(res)
                  getUserLoginTokenAPI(token).then((res1) => {
                    // console.log(res1);
                    sessionStorage.setItem('userId', res1.userId);
                    sessionStorage.setItem('email', inputState.email);
                    sessionStorage.setItem('nickname', res1.nickname);
                  });

                  Swal.fire({
                    title:
                      '회원가입에 성공했습니다. 추가 정보를 더 입력하실 건가요?',
                    icon: 'success',
                    confirmButtonText: '네, 지금 할래요',
                    cancelButtonText: '아니요, 다음에 할래요',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      sessionStorage.setItem('keep', 'true');
                      sessionStorage.setItem('password', inputState.password);
                      sessionStorage.setItem('userClass', inputState.class);
                      sessionStorage.setItem('studentId', inputState.studentId);
                      sessionStorage.setItem(
                        'generation',
                        inputState.generation
                      );
                      sessionStorage.setItem('name', inputState.name);
                      window.history.forward();
                      Router.push('/regist/info');
                    } else {
                      Swal.fire({
                        title: '메인페이지로 이동합니다',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 500,
                      }).then(() => {
                        window.history.forward();
                        window.location.replace('/');
                      });
                    }
                  });
                });
              } else {
                // alert(`${res.message}`);
                Swal.fire({
                  icon: 'error',
                  title: '회원가입에 실패했습니다.',
                  text: '지속적으로 같은 문제 발생시 관리자에게 문의하세요',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
                // console.log('회원가입실패');
              }
            });
          },
        });
      }
    } else {
      // alert(msg);
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-xl cols-6">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: 'column' }}
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1 style={{ marginTop: '20px' }}>회원가입</h1>
        {/* 이메일 */}
        <div>
          <Typography display="inline" sx={{ fontSize: 14 }}>
            이메일
          </Typography>
          <br />
          <OutlinedInput
            type="email"
            id="email"
            placeholder="이메일"
            value={inputState.email}
            onChange={handleChange}
            disabled={authFin ? true : false}
            sx={{ width: 370, fontSize: 14 }}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  onClick={sendEmailCodeClick}
                  disabled={authFin ? true : false}
                >
                  인증받기
                </Button>
              </InputAdornment>
            }
          />
          <>
            {showEmailCodeCheck ? (
              <CheckEmailCode
                changeHandle={changeHandle}
                email={inputState.email}
              />
            ) : (
              <></>
            )}
          </>
          {authFin ? (
            <Button onClick={sendEmailCodeAgainClick}>
              이메일 변경 및 인증 다시 받기
            </Button>
          ) : null}
        </div>
        {/* 닉네임 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            닉네임
          </Typography>
          <br />
          <OutlinedInput
            type="text"
            id="nickname"
            placeholder=""
            value={inputState.nickname}
            onChange={(e) => {
              handleChange(e);
              nicknameHandleChange(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
          />
          {/* 닉네임 유효성 결과 */}
          {/* 1. 사용 가능 */}
          {inputState.nickname != '' &&
          nicknameCheckRes &&
          nicknameCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">멋진 닉네임이네요~^^</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.nickname != '' &&
          nicknameCheckRes &&
          nicknameCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{nicknameCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        {/* 비밀번호 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            비밀번호
          </Typography>
          <br />
          <OutlinedInput
            type="password"
            id="password"
            placeholder="8~16자리, 영문자, 숫자, 특수문자"
            value={inputState.password}
            onChange={(e) => {
              handleChange(e);
              pwHandleChange(e);
              pwSameOtherCheck(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
            type={inputState.showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ mr: -0.5 }}
                >
                  {inputState.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {/* 1. 비밀번호 사용 가능 */}
          {inputState.password != '' && pwCheckRes && pwCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">최고의 비밀번호에요~^^</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.password != '' && pwCheckRes && pwCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{pwCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            비밀번호 확인
          </Typography>
          <br />
          <OutlinedInput
            type="password"
            id="passwordConfirm"
            value={inputState.passwordConfirm}
            onChange={(e) => {
              handleChange(e);
              pwSameCheck(e);
              pwHandleChange(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
            type={inputState.showPasswordConfirm ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordConfirm}
                  edge="end"
                  sx={{ mr: -0.5 }}
                >
                  {inputState.showPasswordConfirm ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {/* 비밀번호 동일 체크 */}
          {inputState.passwordConfirm == '' || pwSameRes ? null : (
            <div className="" role="alert">
              <span className="font-medium">비밀번호가 동일하지 않습니다.</span>
            </div>
          )}
        </div>
        {/* 기수 */}
        <div className="mb-6">
          <div sx={{ flexDirection: 'row' }}>
            <Typography display="inline" sx={{ fontSize: 14, mr: 20.5 }}>
              기수
            </Typography>
            <Typography display="inline" sx={{ fontSize: 14 }}>
              반
            </Typography>
          </div>
          <Select
            id="generation"
            onChange={generationHandleChange}
            defaultValue={generationOptions[5].value}
            value={generationOptions.value}
            sx={{ width: 180, mr: 1.25, fontSize: 14 }}
          >
            {generationOptions.map((opt) => {
              return (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ minWidth: 120, fontSize: 14 }}
                >
                  {opt.name}
                </MenuItem>
              );
            })}
          </Select>
          {/* 반 */}
          <Select
            id="class"
            onChange={classHandleChange}
            defaultValue={classOptions[0].value}
            value={classOptions.value}
            sx={{ width: 180, fontSize: 14 }}
          >
            {classOptions.map((opt) => {
              return (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ minWidth: 120, fontSize: 14 }}
                >
                  {opt.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        {/* 학번 */}
        <div>
          <div sx={{ flexDirection: 'row' }}>
            <Typography display="inline" sx={{ fontSize: 14, mr: 20.5 }}>
              학번
            </Typography>
            <Typography display="inline" sx={{ fontSize: 14 }}>
              이름
            </Typography>
          </div>
          <OutlinedInput
            type="number"
            id="studentId"
            value={inputState.studentId}
            placeholder="싸피에서 받은 학번"
            onChange={handleChange}
            sx={{ width: 180, mr: 1.25, fontSize: 14 }}
          />
          {/* 이름 */}
          <OutlinedInput
            type="text"
            id="name"
            value={inputState.name}
            placeholder="한글"
            onChange={(e) => {
              handleChange(e);
            }}
            sx={{ width: 180, fontSize: 14 }}
          />
        </div>
        {/* 가입 버튼 */}
        <Button
          type="submit"
          variant="contained"
          sx={{ width: 370, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
        >
          회원가입하기
        </Button>
      </Box>
    </div>
  );
}
