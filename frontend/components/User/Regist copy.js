import React, { useState, useEffect } from "react";
import Router from "next/router";
import CheckEmailCode from "./CheckEmailCode";
import PositionList from "../Club/PositionList";
import StackLevelSelect from "../../components/Common/Stack/StackLevelSelect";

import {
  registAPI,
  idCheckAPI,
  sendEmailCodeAPI,
  checkCodeAPI,
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
import DateAdapter from "@mui/lab/AdapterDateFns";
import MenuItem from "@mui/material/MenuItem";

export default function Regist() {
  // id, password 유효성 검사 반환 결과 : idCheckRes, pwCheckRes
  const [pwCheckRes, setPwCheckRes] = useState(null);
  const [pwSameRes, setPwSameRes] = useState(null);

  const [nicknameCheckRes, setNicknameCheckRes] = useState(null); // 닉네임 중복검사

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
    phone: "",
    nickname: "",
    userClass: "JAVA",
    birthday: "",
    generation: "6",
    studentId: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
  });

  // const [stackScore, setStackScore] = useState({
  //   HTML: "",
  //   CSS: "",
  //   JavaScript: "",
  //   VueJS: "",
  //   React: "",
  //   Angular: "",
  //   Python: "",
  //   Java: "",
  //   C: "",
  //   Spring: "",
  //   MySQL: "",
  //   Git: "",
  //   AWS: "",
  //   Docker: "",
  //   Linux: "",
  //   Jira: "",
  //   Django: "",
  //   Redis: "",
  // });

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

  // const stackGroup = [
  //   { value: "HTML", label: "HTML" },
  //   { value: "CSS", label: "CSS" },
  //   { value: "JavaScript", label: "JavaScript" },
  //   { value: "VueJS", label: "VueJS" },
  //   { value: "React", label: "React" },
  //   { value: "Angular", label: "Angular" },
  //   { value: "Python", label: "Python" },
  //   { value: "Java", label: "Java" },
  //   { value: "C/C++/C#", label: "C/C++/C#" },
  //   { value: "Spring boot", label: "Spring boot" },
  //   { value: "MySQL", label: "MySQL" },
  //   { value: "Git", label: "Git" },
  //   { value: "AWS", label: "AWS" },
  //   { value: "Docker", label: "Docker" },
  //   { value: "Linux", label: "Linux" },
  //   { value: "Jira", label: "Jira" },
  //   { value: "Django", label: "Django" },
  //   { value: "Redis", label: "Redis" },
  // ];

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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddLinkClick = (props) => {
    // 링크 추가 버튼을 누르면
    // const { onClose, selectedValue, open } = props;

    // const handleClose = () => {
    //   onClose(selectedValue);
    // };

    // const handleListItemClick = (value) => {
    //   onClose(value);
    // };

    return <></>;
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

    if (!inputState.password) {
      isNormal = false;
      msg = "비밀번호를 입력해주세요.";
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = "비밀번호 양식을 확인해주세요.";
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = "비밀번호가 동일하지 않습니다.";
    } else if (!inputState.name) {
      isNormal = false;
      msg = "이름을 입력해주세요.";
    } else if (!inputState.email) {
      isNormal = false;
      msg = "이메일을 입력해주세요.";
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = "이메일 양식을 확인해주세요.";
    } else if (!phoneReg.test(inputState.phone)) {
      isNormal = false;
      msg = "전화번호 양식을 확인해주세요.";
    } else if (!inputState.name) {
      isNormal = false;
      msg = "이름을 입력해주세요.";
    } else if (!inputState.nickname) {
      isNormal = false;
      msg = "닉네임을 입력해주세요.";
    } else if (!inputState.studentId) {
      isNormal = false;
      msg = "학번을 입력해주세요.";
    } else if (!inputState.userClass) {
      isNormal = false;
      msg = "반을 입력해주세요.";
    } else if (!inputState.generation) {
      isNormal = false;
      msg = "기수를 입력해주세요.";
    }

    console.log(inputState);
    if (isNormal) {
      registAPI(inputState).then((res) => {
        console.log(res);
        if (res.statusCode == 200) {
          // 가입 성공 시
          alert("가입이 되었습니다!");
          // 페이지 이동
          window.history.forward();
          Router.push("/login");
        } else alert(`${res.message}`);
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
        {/* 전화번호 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            전화번호
          </Typography>
          <br />
          <OutlinedInput
            type="number"
            id="phone"
            placeholder="01012345678"
            value={inputState.phone}
            onChange={(e) => {
              handleChange(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
          />
        </div>
        {/* 생년월일 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            생년월일
          </Typography>
          <br />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePickerWrapper>
              <DatePicker
                label="생년월일"
                value={inputState.birthday}
              ></DatePicker>
            </DatePickerWrapper>
          </LocalizationProvider>
        </div>
        {/* 분야 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            분야
          </Typography>
          <br />
          <Select
            id="position"
            onChange={positionHandleChange}
            defaultValue=""
            sx={{ minWidth: 370, fontSize: 14 }}
          >
            {positionOptions.map((u, i) => {
              return (
                <MenuItem
                  key={i}
                  value={u.value}
                  sx={{ minWidth: 120, fontSize: 14 }}
                >
                  {u.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        {/* 기술 스택 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            기술 스택
          </Typography>
          <StackLevelSelect
            changeHandle={changeHandle}
            // label="프로젝트 스택"
          ></StackLevelSelect>
        </div>
        {/* 링크 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            링크
          </Typography>
          <Button onClick={handleClickOpen}>추가</Button>
          <label></label>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>링크</DialogTitle>
            <DialogContent>
              <DialogContentText>
                나를 소개할 수 있는 링크를 추가해주세요 (예: 깃허브, 블로그,
                페이스북)
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="links"
                // label="Email Address"
                type="text"
                fullWidth
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button>추가</Button>
                    </InputAdornment>
                  ),
                }}
              />
              <></>
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleClose}>취소하기</Button> */}
              <Button onClick={handleClose}>완료하기</Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* 자기소개 */}
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            자기소개
          </Typography>
          <br />
          <TextField
            id="description"
            placeholder="자기자신에 대해 소개해주세요"
            fullWidth
            rows={4}
            multiline
            value={inputState.description}
            onChange={handleChange}
            sx={{ width: 370, fontSize: 14 }}
          />
        </div>
        {/* 이미지 업로드 */}
        <ImgUploadBtn
          id="img_box"
          onClick={(event) => {
            event.preventDefault();
            uploadRef.current.click();
          }}
        >
          Image Upload
        </ImgUploadBtn>
        <br />
        {/* 가입 버튼 */}
        <Button
          type="submit"
          variant="contained"
          sx={{ width: 370, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
        >
          회원가입하기
        </Button>

        {/* </form> */}
      </Box>
    </div>
  );
}
