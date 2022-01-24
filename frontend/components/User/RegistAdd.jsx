import React, { useState, useEffect } from "react";
import Router from "next/router";
import PositionList from "../Club/PositionList";
import StackLevelRegistSelect from "../../components/Common/Stack/StackLevelRegistSelect";

import { registAPI, checkMemberAPI } from "../../pages/api/user";
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
  Autocomplete,
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

export default function RegistAdd() {
  const [inputState, setInputState] = useState({
    email: "",
    phone: "",
    nickname: "",
    birthday: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
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

  // const changeHandle = (value, name) => {
  //   inputState[name] = value;
  //   // 리렌더링 X
  // };

  const changeHandle = (e) => {
    const { id, value } = e.target;
    inputState[id] = value;
    // 리렌더링 X
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const positionHandleChange = (e) => {
    inputState.position = e.target.value;
  };

  const links = []

  const phoneReg = /^[0-9]{8,13}$/;
  // 전화번호 정규표현식

  const koreanReg = /[ㄱ-ㅎㅏ-ㅣ가-힇ㆍ ᆢ]/g;

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = "";

    console.log(links)
    inputState.link = links;

    console.log(inputState);
    if (isNormal) {
      // registAPI(inputState).then((res) => {
      //   console.log(res);
      //   if (res.statusCode == 200) {
      //     // 가입 성공 시
      //     alert("가입이 되었습니다!");
      //     // 페이지 이동
      //     window.history.forward();
      //     Router.push("/login");
      //   } else alert(`${res.message}`);
      // });
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
                  onChange={handleChange}
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
            <StackLevelRegistSelect
              changeHandle={changeHandle}
              // label="프로젝트 스택"
            ></StackLevelRegistSelect>
          </div>
          {/* 링크 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              링크
            </Typography>
            <br />
            <Autocomplete
              multiple
              id="tags-filled"
              // options={top100Films.map((option) => option.title)}
              // defaultValue={[top100Films[13].title]}
              freeSolo
              // renderTags={(value, getTagProps) =>
              //   value.map((option, index) => (
              //     <Chip
              //       variant="outlined"
              //       label={option}
              //       {...getTagProps({ index })}
              //     />
              //   ))
              // }
              
              options={links.map((l) => (l.value))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // variant="filled"
                  // label="freeSolo"
                  // placeholder="Favorites"
                />
              )}
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
              value={inputState.description}
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
