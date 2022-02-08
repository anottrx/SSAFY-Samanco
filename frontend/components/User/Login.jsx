import React, { useState, useEffect } from 'react';
import { getUserLoginTokenAPI, loginAPI } from '../../pages/api/user';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  OutlinedInput,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

export default function Login() {
  const [inputState, setInputState] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [cookies, setCookie] = useCookies(['userToken', 'userEmail']);
  const [rememberId, setRememberId] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (cookies.userEmail !== '') {
      setInputState({
        email: cookies.userEmail,
      });
      setRememberId(true);
    } else {
      setRememberId(false);
    }
  }, []);

  const handleRememberIdCheck = (e) => {
    setRememberId(e.target.checked);
  };

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = '';

    if (!inputState.email) {
      isNormal = false;
      msg = '이메일을 입력해주세요.';
    } else if (!inputState.password) {
      isNormal = false;
      msg = '비밀번호를 입력해주세요.';
    }

    if (isNormal) {
      // 유효성 검사 통과 시 login API 요청
      loginAPI(inputState).then((res) => {
        switch (res.statusCode) {
          case 200: // 로그인 성공
            // alert(`로그인 성공: ${res.accessToken}`);
            setCookie('userToken', res.accessToken); // 쿠키 설정
            if (res.accessToken != null && res.accessToken != '') {
              const token = res.accessToken;
              getUserLoginTokenAPI(token).then((res1) => {
                console.log(res1);
                // alert();
                sessionStorage.setItem('userId', res1.userId);
                sessionStorage.setItem('email', inputState.email);
                sessionStorage.setItem('nickname', res1.nickname);

                window.history.forward();
                window.location.replace('/');
              });
            }
            if (rememberId) {
              setCookie('userEmail', inputState.email);
            } else {
              setCookie('userEmail', '');
            }
            break;
          case 401: // 비밀번호 틀림
            alert('비밀번호를 확인해주세요.');
            break;
          case 404: // 유저 정보 X
            alert('회원 정보가 존재하지 않습니다.');
            break;
          default:
            alert(
              `로그인 중 문제가 발생했습니다. 관리자에게 문의하세요. 에러코드 (${res.statusCode})`
            );
            break;
        }
      });
    } else {
      alert(msg);
    }
  };

  return (
    <div>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
        sx={{ flexDirection: 'column' }}
      >
        <h1>로그인</h1>
        <br />
        <FormControl sx={{ width: 300 }}>
          <OutlinedInput
            id="email"
            placeholder="이메일"
            value={inputState.email || ''}
            onChange={handleChange}
            sx={{ fontSize: 14 }}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <OutlinedInput
            id="password"
            placeholder="비밀번호"
            type={inputState.showPassword ? 'text' : 'password'}
            value={inputState.password || ''}
            onChange={handleChange}
            sx={{ fontSize: 14 }}
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
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            onChange={handleRememberIdCheck}
            checked={rememberId}
            sx={{ width: 260, mt: 1, font: 20 }}
            label="아이디 저장하기"
          />
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: 300, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
        >
          로그인
        </Button>
        <div sx={{ flexDirection: 'row' }}>
          <Typography
            variant="h6"
            display="inline"
            gutterBottom
            sx={{ width: 300, fontSize: 13.5, mr: 2 }}
          >
            <span className="site-nav-item">
              <Link href="/user/password">비밀번호 재설정</Link>
            </span>
          </Typography>
          <span> </span>
          <Typography
            variant="h6"
            display="inline"
            gutterBottom
            sx={{ width: 300, fontSize: 13.5, mr: 2 }}
          >
            <span className="site-nav-item">
              <Link href="/regist">회원가입</Link>
            </span>
          </Typography>
        </div>
        <br />
      </Box>
    </div>
  );
}
