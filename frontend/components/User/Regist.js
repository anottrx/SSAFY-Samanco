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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  OutlinedInput,
  Button,
  Select,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
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

    // else  if(inputState.code==false) {
    //     setShowEmailCodeCheck(false);
    //     setAuthFin(false);
    //   }

    if (!inputState.email) {
      alert('이메일을 입력해주세요.');
    } else if (!emailReg.test(inputState.email)) {
      alert('이메일 양식을 확인해주세요.');
    } else {
      // 인증코드 보내기
      setShowEmailCodeCheck(true);
      sendEmailCodeAPI(inputState.email).then((res) => {
        console.log(inputState.email);
        if (res.statusCode == 200) {
          //
        } else {
          //
        }
        setAuthFin(true);
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
        console.log(`${key}`);
      }

      registAPI(formData).then((res) => {
        // console.log(res);
        if (res.statusCode == 200) {
          // 가입 성공 시
          // alert("가입이 되었습니다!");

          // 로그인
          loginAPI(inputState).then((res) => {
            setCookie('userToken', res.accessToken); // 쿠키 설정
            setCookie('userEmail', inputState.email);
            const token = res.accessToken;
            getUserLoginTokenAPI(token).then((res1) => {
              console.log(res1);
              sessionStorage.setItem('userId', res1.userId);
              sessionStorage.setItem('email', inputState.email);
              sessionStorage.setItem('nickname', res1.nickname);
            });
            if (
              window.confirm(
                '가입이 완료되었습니다! 추가 정보를 입력하실 건가요?'
              )
            ) {
              sessionStorage.setItem('keep', 'true');

              sessionStorage.setItem('password', inputState.password);
              sessionStorage.setItem('userClass', inputState.class);
              sessionStorage.setItem('studentId', inputState.studentId);
              sessionStorage.setItem('generation', inputState.generation);
              sessionStorage.setItem('name', inputState.name);
              window.history.forward();
              Router.push('/regist/info');
            } else {
              // 페이지 이동
              window.history.forward();
              window.location.replace('/');
            }
          });
        } else {
          alert(`${res.message}`);
          console.log('회원가입실패');
        }
      });
    } else {
      alert(msg);
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
        <h1>회원가입</h1>
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
              <CheckEmailCode changeHandle={changeHandle} />
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
