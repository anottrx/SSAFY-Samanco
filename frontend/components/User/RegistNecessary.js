import React, { useState, useEffect } from "react";
import Router from "next/router";
import CheckEmailCode from "./CheckEmailCode";
import { useCookies } from "react-cookie";

import {
  registAPI,
  checkNicknameAPI,
  checkMemberAPI,
} from "../../pages/api/user";
import {
  Paper,
  InputLabel,
  TextField,
  Box,
  Avatar,
  OutlinedInput,
  ListItem,
  DialogContentText,
  DialogContent,
  List,
  DialogActions,
  Button,
  DialogTitle,
  ListItemAvatar,
  ListItemText,
  Dialog,
  Select,
  Typography,
} from "@mui/material";
import InputAdornment from "@material-ui/core/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import DatePicker from "../../components/Common/DatePicker";
import styled from "@emotion/styled";
import { LocalizationProvider } from "@mui/lab";
import MenuItem from "@mui/material/MenuItem";

export default function RegistNecessafy() {
  // id, password 유효성 검사 반환 결과 : idCheckRes, pwCheckRes
  const [pwCheckRes, setPwCheckRes] = useState(null);
  const [pwSameRes, setPwSameRes] = useState(null);

  const [nicknameCheckRes, setNicknameCheckRes] = useState(null); // 닉네임 중복검사
  const [cookies, setCookie] = useCookies(["userToken", "userEmail"]);

  const [authFin, setAuthFin] = useState(false);
  const [emailCodeRes, setEmailCodeRes] = useState(null);
  const [emailCodeCompareRes, setEmailCodeCompareRes] = useState(null);
  const [showEmailCodeCheck, setShowEmailCodeCheck] = useState(false);

  const [code, setCode] = useState("");
  const [inputState, setInputState] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
    email: "",
    nickname: "",
    userClass: "JAVA",
    generation: "6",
    studentId: "",
    phone: 11111111111,
  });

  const generationOptions = [
    { value: "1", name: "1기" },
    { value: "2", name: "2기" },
    { value: "3", name: "3기" },
    { value: "4", name: "4기" },
    { value: "5", name: "5기" },
    { value: "6", name: "6기" },
    { value: "7", name: "7기" },
  ];

  const classOptions = [
    { value: "JAVA", name: "자바반" },
    { value: "PYTHON", name: "파이썬반" },
    { value: "MOBILE", name: "모바일반" },
    { value: "EMBEDDED", name: "임베디드반" },
  ];

  const positionOptions = [
    { value: "frontend", name: "프론트엔드" },
    { value: "backend", name: "백엔드" },
    { value: "mobile", name: "모바일" },
    { value: "embedded", name: "임베디드" },
  ];

  const DatePickerWrapper = styled.div`
    display: flex;
    & > div {
      flex: 1;
      width: 370px;
      margin: 0px 0px;
    }
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 30px;
    flex: 1;
  `;

  const ImgUploadBtn = styled(Button)`
    padding: 20px;
    border: 1px dashed grey;
    min-width: 150px;
    min-height: 150px;
    margin: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  `;

  const EmailCodeSource = (props) => {
    return (
      <CheckEmailCode />
      // <Button onClick={compareEmailCodeClick}>확인</Button>
    );
  };

  const changeHandle = (value, name) => {
    inputState[name] = value;
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
    inputState.userClass = e.target.value;
  };

  const positionHandleChange = (e) => {
    inputState.position = e.target.value;
  };

  const nicknameHandleChange = (e) => {
    const value = e.target.value;
    checkNicknameAPI(value).then((res) => {
      setNicknameCheckRes({ code: res.statusCode, msg: res.message });
    });
  };

  const sendEmailCodeClick = (e) => {
    // 이메일로 인증번호 보내기 + 인증번호 입력 받을 수 있게 폼 열기
    e.preventDefault();
    const value = inputState.email;

    if (!inputState.email) {
      alert("이메일을 입력해주세요.");
    } else if (!emailReg.test(inputState.email)) {
      alert("이메일 양식을 확인해주세요.");
    } else {
      //   console.log(value);
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      //   sendEmailCodeAPI(value).then((res) => {
      setShowEmailCodeCheck(true);
      setAuthFin(true);
      //   });
    }
  };

  const sendEmailCodeAgainClick = (e) => {
    setShowEmailCodeCheck(false);
    setAuthFin(false);
  };

  const compareEmailCodeClick = (e) => {
    // 이메일로 받은 인증번호 입력해서 확인하기 + 확인 완료되면 폼 닫고 이메일 입력 못 받게 바꾸기
    e.preventDefault();
    const value = code;

    if (!value) {
      alert("인증번호를 입력해주세요.");
    } else {
      // console.log(value);
      //   checkEmailPWAPI(value).then((res) => {
      //     setEmailCodeRes({ code: res.statusCode, msg: res.message });
      setShowEmailCodeCheck(false);
      setAuthFin(true);
      //   });
    }
  };

  const pwHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setPwCheckRes(
      pwReg.test(value)
        ? { code: 200, msg: "사용 가능한 비밀번호입니다." }
        : {
            code: 401,
            msg: "비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.",
          }
    );
  };

  const pwSameCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.password == value ? true : false);
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
    let msg = "";

    if (!inputState.email) {
      isNormal = false;
      msg = "이메일을 입력해주세요.";
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = "이메일 양식을 확인해주세요.";
    } else if (!inputState.nickname) {
      isNormal = false;
      msg = "닉네임을 입력해주세요.";
    } else if (!inputState.password) {
      isNormal = false;
      msg = "비밀번호를 입력해주세요.";
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = "비밀번호 양식을 확인해주세요.";
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = "비밀번호가 동일하지 않습니다.";
    } else if (!inputState.generation) {
      isNormal = false;
      msg = "기수를 입력해주세요.";
    } else if (!inputState.userClass) {
      isNormal = false;
      msg = "반을 입력해주세요.";
    } else if (!inputState.studentId) {
      isNormal = false;
      msg = "학번을 입력해주세요.";
    } else if (!inputState.name) {
      isNormal = false;
      msg = "이름을 입력해주세요.";
    }

    console.log(inputState);
    if (isNormal) {
      registAPI(inputState).then((res) => {
        console.log(res);
        // if (res.statusCode == 200) {
          // 가입 성공 시
          // alert("가입이 되었습니다!");

          setCookie("userToken", res.accessToken)
          setCookie("userEmail", inputState.email);
          sessionStorage.setItem("userId", inputState.userId);
          sessionStorage.setItem("email", inputState.email);
          sessionStorage.setItem("nickname", inputState.nickname);

          if (
            window.confirm(
              "가입이 완료되었습니다! 추가 정보를 입력하실 건가요?"
              )
          ) {
            
          } else {
            // 페이지 이동
            window.history.forward();
            Router.push("/login");
          }
        // } else{ alert(`${res.message}`);
        // console.log("회원가입실패")
      // }
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
        sx={{ flexDirection: "column" }}
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1>회원가입</h1>
        {/* <form > */}
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
          <>{showEmailCodeCheck ? <EmailCodeSource /> : null}</>
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
          {inputState.nickname != "" &&
          nicknameCheckRes &&
          nicknameCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{nicknameCheckRes.msg}</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.nickname != "" &&
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
            }}
            sx={{ width: 370, fontSize: 14 }}
          />
          {/* 1. 비밀번호 사용 가능 */}
          {inputState.password != "" && pwCheckRes && pwCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{pwCheckRes.msg}</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.password != "" && pwCheckRes && pwCheckRes.code != 200 ? (
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
            }}
            sx={{ width: 370, fontSize: 14 }}
          />
          {/* 비밀번호 동일 체크 */}
          {inputState.passwordConfirm == "" || pwSameRes ? null : (
            <div className="" role="alert">
              <span className="font-medium">비밀번호가 동일하지 않습니다.</span>
            </div>
          )}
        </div>
        {/* 기수 */}
        <div className="mb-6">
          <div sx={{ flexDirection: "row" }}>
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
            id="userClass"
            onChange={classHandleChange}
            defaultValue={classOptions[0].value}
            value={classOptions.value}
            sx={{ width: 180, fontSize: 14 }}
            // displayEmpty
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
          <div sx={{ flexDirection: "row" }}>
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
