import { useState } from "react";
import { getUserInfo, loginAPI } from "../../pages/api/user";
import Link from "next/link";
import Router from "next/router";

// import styles from "../../styles/Login.module.css";

import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

export default function Login() {
  const [inputState, setInputState] = useState({
    id: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (e) => {
    // setInputState({ ...inputState, [prop]: e.target.value });
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = "";

    if (!inputState.id) {
      isNormal = false;
      msg = "아이디를 입력해주세요.";
    } else if (!inputState.password) {
      isNormal = false;
      msg = "비밀번호를 입력해주세요.";
    }

    if (isNormal) {
      // 유효성 검사 통과 시 login API 요청

      loginAPI(inputState).then((res) => {
        switch (res.statusCode) {
          case 200: // 로그인 성공
            alert(`로그인 성공: ${res.accessToken}`);
            sessionStorage.setItem("userToken", res.accessToken);

            getUserInfo(res.accessToken).then((res) => {
              sessionStorage.setItem("userId", res.userId);
            });
            Router.push("/");
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
        <h1>로그인</h1>
        <br />
        <FormControl sx={{ width: 280 }}>
          <OutlinedInput
            id="id"
            placeholder="이메일"
            value={inputState.id}
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <FormControl sx={{ width: 280 }}>
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
        <br />
        <Button type="submit" variant="contained" sx={{ width: 280 }}>
          로그인
        </Button>
        <br />
        <div flexDirection="row">
          <Link href="/project">비밀번호 찾기</Link>
          <Link href="/regist">회원가입</Link>
        </div>

        <br />
      </Box>

      {/* <form onSubmit={handleSubmit} className="">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            아이디
          </label>
          <input
            type="text"
            id="id"
            value={inputState.id}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="4~8자리"
            required=""
          ></input>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={inputState.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="8~16자리, 영문자, 숫자, 특수문자"
            required=""
          ></input>
        </div>
        <div className="flex justify-between mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required=""
            ></input>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-900 dark:text-gray-300">
                정보 기억하기
              </label>
            </div>
          </div>
          <div className="ml-3 text-sm">
            <Link href="/find" className="float-right text-blue-700">
              비밀번호 찾기
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          로그인
        </button>
      </form> */}
    </div>
  );
}
