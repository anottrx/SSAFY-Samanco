import React, { useState, useEffect, useRef, useCallback } from "react";
import Router from "next/router";
import StackLevelSelectRegister from "../../components/Common/Stack/StackLevelSelectRegister";

import {
  getUserLoginTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
} from "../../pages/api/user";
import {
  TextField,
  Box,
  OutlinedInput,
  Button,
  Autocomplete,
  Select,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { LocalizationProvider } from "@mui/lab";
import MenuItem from "@mui/material/MenuItem";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import StackLevelInfoDialog from "../Common/Stack/StackLevelInfoDialog";

export default function RegistInfo() {
  const [inputState, setInputState] = useState({
    phone: "",
    birthday: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
    // 이미 입력된 값들
    email: "",
    userId: "",
    email: "",
    nickname: "",
    name: "",
    class: "",
    generation: "",
    studentId: "",
  });

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

  const [files, setFiles] = useState("");

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  useEffect(() => {
    inputState.userId = sessionStorage.getItem("userId");
    inputState.nickname = sessionStorage.getItem("nickname");
    inputState.name = sessionStorage.getItem("name");
    inputState.class = sessionStorage.getItem("userClass");
    inputState.generation = sessionStorage.getItem("generation");
    inputState.studentId = sessionStorage.getItem("studentId");
    inputState.password = sessionStorage.getItem("password");

    preview();
  });

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector("#img_box");
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = "";
    reader.readAsDataURL(files);
  };

  // const changeHandle = (e) => {
  //   const { id, value } = e.target;
  //   inputState[id] = value;
  //   // 리렌더링 X
  // };
  const [infoValue, setInfoValue] = useState({
    birthday: "",
    stacks: [],
  });
  const changeHandle = (value, name) => {
    if (name == "birthday") {
      inputState.birthday = value;
    } else {
      inputState[name] = value;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    infoValue.stacks = inputState.stacks;
    console.log(infoValue.birthday);

    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    inputState.stacks = infoValue.stacks;
  };

  const positionHandleChange = (e) => {
    console.log(e.target.value);
    inputState.position = e.target.value;
    // console.log("inputState" + JSON.stringify(inputState));
    // console.log(inputState);
  };

  const [links, setLinks] = useState([]);
  function handleLinksChange(linkArr) {
    let linkList = "";
    const size = linkArr.length;
    for (let i = 0; i < size; i++) {
      linkList = linkList + " " + linkArr[i];
    }
    linkList = linkList.trim();
    inputState.link = linkList;
    // setInputState({
    //   link: linkList,
    // });
  }

  const phoneReg = /^[0-9]{8,13}$/; // 전화번호 정규표현식
  const koreanReg = /[ㄱ-ㅎㅏ-ㅣ가-힇ㆍ ᆢ]/g;

  const [birthdayDate, setBirthdayDate] = useState("");

  const handleBirthdayChange = (value) => {
    const year = String(value.getFullYear()).slice(2, 4);
    const month =
      value.getMonth() + 1 > 9
        ? value.getMonth() + 1
        : "0" + (value.getMonth() + 1);
    const day = value.getDate() > 9 ? value.getDate() : "0" + value.getDate();
    const birthdayDateInputStyle = year + month + day;
    setBirthdayDate(value);
    inputState.birthday = birthdayDateInputStyle;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("이전" + inputState);

    let isNormal = true;
    let msg = "";

    inputState.stacks = {
      HTML: inputState.HTML,
      CSS: inputState.CSS,
      JavaScript: inputState.JavaScript,
      VueJS: inputState.VueJS,
      React: inputState.React,
      Python: inputState.Python,
      Java: inputState.Java,
      C: inputState.C,
      SpringBoot: inputState.SpringBoot,
      MySQL: inputState.MySQL,
      Git: inputState.Git,
      AWS: inputState.AWS,
      Docker: inputState.Docker,
      Linux: inputState.Linux,
      Jira: inputState.Jira,
      Django: inputState.Django,
      Redis: inputState.Redis,
    };
    Object.keys(inputState.stacks).forEach(function (key) {
      if (inputState.stacks[key] === 0) {
        delete inputState.stacks[key];
      }
    });

    if (isNormal) {
      const formData = new FormData();
      // console.log("inputState" + JSON.stringify(inputState));
      // console.log(inputState);

      if (inputState.phone == "") {
        inputState.phone = "00000000000";
      }

      Object.keys(inputState).map((key) => {
        let value = inputState[key];
        if (key === "stacks") {
          formData.append(key, "[" + JSON.stringify(value) + "]");
          // console.log(key + " " + ("["+JSON.stringify(value)+"]"));
        } else {
          formData.append(key, value);
          // console.log(key + " " + value);
        }
      });

      formData.append("file", files);

      for (let key of formData.entries()) {
        console.log("key", `${key}`);
      }

      updateUserAPI(formData).then((res) => {
        console.log(res);
        console.log(JSON.stringify(res));
        if (res.statusCode == 200) {
          sessionStorage.clear();
          sessionStorage.setItem("userId", inputState.userId);
          sessionStorage.setItem("email", inputState.email);
          sessionStorage.setItem("nickname", inputState.nickname);
          alert("회원정보 추가 성공");
          window.history.forward();
          window.location.replace("/");
        } else {
          alert("회원정보 추가에 실패했습니다. 에러코드:" + res.statusCode);
          sessionStorage.clear();
          window.history.forward();
          window.location.replace("/");
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
        sx={{ flexDirection: "column" }}
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1>추가 정보 입력</h1>
        <div>
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
          <input
            ref={uploadRef}
            type="file"
            className="imgInput"
            id="projectImg"
            accept="image/*"
            name="file"
            encType="multipart/form-data"
            onChange={onImgChange}
          ></input>
        </div>
        <div>
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
              value={inputState.phone || ""}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                id="birthday"
                inputFormat="yyyy-MM-dd"
                mask={"____-__-__"}
                value={birthdayDate || null}
                onChange={handleBirthdayChange}
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: 370, fontSize: 14 }} />
                )}
              />
            </LocalizationProvider>
            {/* <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePickerWrapper>
                <DatePickerUserRegist
                  id="birthday"
                  label=""
                  // value={inputState.birthday}
                  // onChange={handleChange}
                  changeHandle={changeHandle}
                ></DatePickerUserRegist>
              </DatePickerWrapper>
            </LocalizationProvider> */}
          </div>
          {/* 분야 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              분야
            </Typography>
            <br />
            <Select
              id="position"
              onChange={(e) => {
                positionHandleChange(e);
                handleChange(e);
              }}
              value={inputState.position || ""}
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
            </Typography>{" "}
            <StackLevelInfoDialog />
            <StackLevelSelectRegister
              changeHandle={changeHandle}
            ></StackLevelSelectRegister>
          </div>
          {/* 링크 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              링크 <i style={{fontSize:"10px"}}>입력 후 엔터를 눌러주세요</i>
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              // options={links}
              // getOptionLabel={(option) => option}
              options={links.map((l) => l.value)}
              renderInput={(params) => <TextField {...params} />}
              onChange={(e, option, reason) => {
                handleLinksChange(option);
              }}
            />
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
              value={inputState.description || ""}
              onChange={handleChange}
              sx={{ width: 370, fontSize: 14 }}
            />
          </div>
          {/* 가입 버튼 */}
          <Button
            type="submit"
            variant="contained"
            sx={{ width: 370, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
          >
            추가 정보 입력 완료
          </Button>
        </div>
      </Box>
    </div>
  );
}
