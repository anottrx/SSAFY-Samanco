import React from "react";
import { useState } from "react";
import { getUserInfo, loginAPI } from "../../pages/api/user";
import Link from "next/link";
import Router from "next/router";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

export default function FindPassword() {
  // 비밀번호 재설정

  // 이메일 정규표현식
  const emailReg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  const [inputState, setInputState] = useState({
    email: "",
    code: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
  });

  const handleChange = (e) => {
    const { email, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [email]: value,
    }));
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
      passwordConfirm: !inputState.passwordConfirm,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = "";

    if (!inputState.email) {
      isNormal = false;
      msg = "이메일을 입력해주세요.";
      alert(inputState.email);
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = "이메일 양식을 확인해 주세요.";
    }

    if (isNormal) {
      // 유효성 검사 통과 시 login API 요청

      loginAPI(inputState).then((res) => {
        switch (res.statusCode) {
          case 200: // 로그인 성공
            
            break;
          case 401: // 비밀번호 틀림
            alert("비밀번호를 확인해주세요.");
            break;
          case 404: // 유저 정보 X
            alert("회원 정보가 존재하지 않습니다.");
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
        flexDirection="column"
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1>비밀번호 재설정</h1>
        <br />
        <FormControl sx={{ width: 280 }}>
          <OutlinedInput
            id="email"
            placeholder="이메일"
            value={inputState.email}
            onChange={handleChange}
          />
        </FormControl>
        <br />
        {/* <FormControl sx={{ width: 280 }}>
          <OutlinedInput
            id="password"
            placeholder="비밀번호"
            type={inputState.showPassword ? "text" : "password"}
            value={inputState.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  //   onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {inputState.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <br /> */}
        <Button type="submit" variant="contained" sx={{ width: 280 }}>
          이메일 보내기
        </Button>

        <br />
      </Box>
    </div>
  );
}
