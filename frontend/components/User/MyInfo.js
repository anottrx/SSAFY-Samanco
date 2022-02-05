import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import Cookies from "universal-cookie";
import { useCookies } from "react-cookie";
import {
  getUserLoginTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
  updateNicknameAPI,
  deleteUserAPI,
  loginAPI,
} from "../../pages/api/user";
import DatePickerUser from "../../components/Common/DatePickerUser";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import styled from "@emotion/styled";
import StackLevelList from "../Common/Stack/StackLevelList";
import StackLevelSelectRegister from "../Common/Stack/StackLevelSelectRegister";
import LinkList from "../Common/LinkList";
import StackLevelDescription from "../Common/Stack/StackLevelDescription";

const DatePickerWrapper = styled.div`
  display: flex;
  & > div {
    flex: 1;
    width: 370px;
    margin: 0px 0px;
  }
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
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const CusSkeleton = styled.div`
  // display: flex;
  flex: 1;
  min-width: 250px;
  min-height: 200px;
  height: auto;
`;
const ContentUpWrapper = styled.div`
  display: flex;
  max-width: 800px;
  flex-direction: column;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 0px 30px;
  padding: 0px 0px;
  flex: 1;
`;
const ContentWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  flex: 1;
  max-width: 800px;
`;
const ButtonWrapper = styled.div`
  flex: 1;
  max-width: 800px;
`;
const RowUpWrapper = styled.div`
  display: grid;
  // grid-template-columns: max-content max-content;
  grid-template-columns: 60px 12fl;
  grid-gap: 8px;
  padding: 1px 0px;
`;
const RowWrapper = styled.div`
  display: grid;
  // grid-template-columns: max-content max-content;
  grid-template-columns: 60px 12fr;
  grid-gap: 8px;
  padding: 2px 0px;
`;

export default function MyInfo() {
  const [authChange, setAuthChange] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [finishUpdate, setFinishUpdate] = useState(false);
  const [nicknameChange, setNicknameChange] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  const [inputState, setInputState] = useState({
    userId: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    nickname: "",
    class: "",
    birthday: "",
    initDate: "",
    generation: "",
    studentId: "",
    stacks: [],
    stacks_get: [],
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

  const [nicknameInfo, setNicknameInfo] = useState({
    nickname: sessionStorage.getItem("nickname"),
    id: sessionStorage.getItem("userId"),
  });

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies(["userToken"]);

  const [files, setFiles] = useState("");

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  const changeHandle = (value, name) => {
    if (name == "birthday") {
      inputState.birthday = value;
      userBirthday.value = value;
      console.log("생일 " + JSON.stringify(inputState));
    } else {
      inputState[name] = value;
      console.log("스택 " + JSON.stringify(inputState));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // inputState.birthday = userBirthday.value;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    // inputState.birthday = userBirthday.value;
    // console.log(userBirthday.value);
    // console.log(inputState.birthday);
  };

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (e) => {
    const descriptionType = e.target;
    setDescription(e.target.value);
    // console.log(descriptionType)
  };

  const [userBirthday, setUserBirthday] = useState({
    value: "",
    initDate: "",
  });
  const [userBirthdayDate, setUserBirthdayDate] = useState("");

  async function getUserInfo() {
    // 사용자 정보 가져오는 함수
    const token = cookie.userToken;

    getUserLoginTokenAPI(token).then((res) => {
      if (res.statusCode == 200) {
      } else {
      }
      console.log("getUserLoginTokenAPI 관련 결과" + JSON.stringify(res));
      inputState.userId = res.userId;
      inputState.email = res.email;
      inputState.nickname = res.nickname;
      nicknameInfo.nickname = inputState.nickname;

      const userId = res.userId;
      getUserInfoAPI(userId).then((res) => {
        if (res.statusCode == 200) {
        } else {
        }
        console.log("내 정보 보기 결과: " + JSON.stringify(res));
        inputState.name = res.user.name;
        const today = new Date();
        const todayYear = today.getFullYear().toString().slice(2);
        if (
          res.user.birthday != null
          // &&  res.user.birthday.toString().slice(0, 2) != todayYear
        ) {
          inputState.birthday = res.user.birthday;
          inputState.initDate = res.user.birthday;
          let year = inputState.birthday.slice(0, 2);
          year = Number(year) > 25 ? 19 + year : 20 + year;
          let month = inputState.birthday.slice(2, 4);
          let day = inputState.birthday.slice(4, 6);
          setUserBirthdayDate(year + "-" + month + "-" + day);
          // console.log(userBirthdayDate);
          userBirthday.initDate = year + "-" + month + "-" + day;
          userBirthday.value = year + "-" + month + "-" + day;
        }
        if (res.user.phone !== "00000000000") {
          inputState.phone = res.user.phone;
        }
        inputState.class = res.user.userClass;
        inputState.generation = res.user.generation;
        inputState.studentId = res.user.studentId;
        inputState.position = res.user.position;
        inputState.password = res.user.password;
        inputState.link = res.user.link;
        inputState.description = res.user.description;
        inputState.stacks = res.user.stacks;
        inputState.stacks_get = res.user.stacks;

        if (res.user.link != null) {
          setLinks(inputState.link.split(" "));
          console.log(links);
          console.log(inputState.link.split(" "));
        } else {
          setLinks();
        }
        // inputState.file = res.user.file;
        setLoading(true);
      });
    });
  }

  useEffect(() => {
    getUserInfo();
    preview();
  }, []);

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector("#img_box");
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = "";
    reader.readAsDataURL(files);
  };

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      nickname: e.target.value,
      id: sessionStorage.getItem("userId"),
    });
  };

  function handleLinksChange(linkArr) {
    console.log(linkArr);
    let linkList = "";
    const size = linkArr.length;
    for (let i = 0; i < size; i++) {
      linkList = linkList + " " + linkArr[i];
    }
    linkList = linkList.trim();
    inputState.link = linkList;
    setLinks(linkList.split(" "));
  }

  const positionHandleChange = (e) => {
    console.log(e.target.value);
    inputState.position = e.target.value;
    console.log("inputState" + JSON.stringify(inputState));
    console.log(inputState);
  };

  const handleNicknameClick = (e) => {
    e.preventDefault();
    // 닉네임 바꿀 수 있는지 확인
    if (nicknameChange) {
      let isNormal = true;
      let msg = "";
      if (nicknameInfo.nickname == "") {
        msg = "닉네임을 입력해주세요";
        isNormal = false;
      } else if (
        nicknameInfo.nickname == "admin" ||
        nicknameInfo.nickname == "관리자"
      ) {
        msg = "해당 닉네임은 사용이 불가능합니다";
        isNormal = false;
      } else if (nicknameInfo.nickname == sessionStorage.getItem("nickname")) {
        msg = "현재 닉네임과 동일합니다";
        isNormal = false;
      }
      if (!isNormal) {
        alert(msg);
        setNicknameChange(false);
      }

      if (isNormal) {
        updateNicknameAPI(nicknameInfo).then((res) => {
          console.log("닉네임 변경 가능한지 확인한 결과" + JSON.stringify(res));
          if (res.statusCode == 200) {
            setCheckPassword(true);

            alert("닉네임 변경이 가능합니다.");
            setNicknameChange(true);
          } else {
            alert(`${res.message}`);
          }
        });
      }
    } else {
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setOnlyView(false);
    setFinishUpdate(true);

    console.log("수정하기 버튼 누름");

    // setAuthChange(true);
    // setOnlyView(false);
    // setFinishUpdate(true);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setOnlyView(true);
    setFinishUpdate(false);
    getUserInfo();
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };
  const [loginInfo, setLoginInfo] = useState({
    email: inputState.email,
    password: "",
  });
  const handlePasswordChange = (e) => {
    loginInfo.email = inputState.email;
    loginInfo.password = e.target.value;
  };

  const handleUpdateFinishClick = (e) => {
    e.preventDefault();
    console.log("수정 완료 버튼 누름");

    console.log(inputState.stacks);

    handleClickOpen();
    console.log(loginInfo);
    // 비밀번호 확인하기
  };

  const handleUpdateInfo = (e) => {
    console.log("업데이트 준비");
    let isNormal = true;
    let msg = "";

    // if (!phoneReg.test(inputState.phone)) {
    //   isNormal = false;
    //   msg = "전화번호 양식을 확인해주세요.";
    // }

    if (isNormal) {
      // inputState.birthday = userBirthday.value;

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
        if (inputState.stacks[key] == 0 || inputState.stacks[key] == null) {
          delete inputState.stacks[key];
        }
      });
      const stacksArr = [];
      Object.keys(inputState.stacks).forEach(function (key) {
        stacksArr.push({ name: key, grade: inputState.stacks[key] });
      });
      inputState.stacks_get = stacksArr;

      loginAPI(loginInfo).then((res) => {
        console.log(loginInfo.email + " " + loginInfo.password);
        if (res.statusCode == 200) {
          console.log("로그인 성공");
          inputState.password = loginInfo.password;

          const formData = new FormData();

          console.log("inputState" + JSON.stringify(inputState));
          console.log(inputState);

          Object.keys(inputState).map((key) => {
            let value = inputState[key];
            if (key === "stacks") {
              formData.append(key, "[" + JSON.stringify(value) + "]");
              // console.log(key + " " + ("["+JSON.stringify(value)+"]"));
            } else if (key === "phone") {
              if (inputState.phone == "") {
                const phoneNull = "00000000000";
                formData.append(key, phoneNull);
                // inputState.phone = "00000000000";
              } else {
                formData.append(key, inputState.phone);
              }
            } else {
              formData.append(key, value);
              console.log(key + " " + value);
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
              setNicknameChange(false);
            } else {
              alert("회원정보 추가에 실패했습니다. 에러코드:" + res.statusCode);
            }
          });

          handleClose();
          setAuthChange(false);
          setOnlyView(true);
          setFinishUpdate(false);

          //   setAuthChange(true);
          // setOnlyView(false);
          // setFinishUpdate(true);
        }
      });
    }
  };

  const handleQuitClick = (event) => {
    const userId = sessionStorage.getItem("userId");
    if (window.confirm("탈퇴하시겠습니까?")) {
      deleteUserAPI(userId).then((res) => {
        if (res.statusCode == 200) {
          // 탈퇴 성공 시
          alert("다음에는 오프라인에서 함께 코딩해요!");
          sessionStorage.clear();
          cookies.set("userToken", "");
          cookies.set("userEmail", "");
          // 페이지 이동
          window.history.forward();
          document.location.href = "/";
        } else alert(`${res.message}`);
      });
    } else {
      alert("좋아요! 싸피사만코와 오래오래 코딩해요!");
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <div>
            <h1>내정보</h1>

            <ContentUpWrapper>
              <ButtonWrapper>
                {finishUpdate ? (
                  <>
                    <Button
                      sx={{ float: "right" }}
                      onClick={handleUpdateFinishClick}
                    >
                      수정완료
                    </Button>
                    <Button sx={{ float: "right" }} onClick={handleResetClick}>
                      수정취소
                    </Button>
                  </>
                ) : (
                  <Button sx={{ float: "right" }} onClick={handleUpdateClick}>
                    수정하기
                  </Button>
                )}
              </ButtonWrapper>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>비밀번호</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    회원정보 변경을 위해 비밀번호를 다시 입력해 주세요
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    // value={loginInfo.password}
                    onChange={handlePasswordChange}
                    type="password"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>취소</Button>
                  <Button onClick={handleUpdateInfo}>확인</Button>
                </DialogActions>
              </Dialog>
              <br />
              <div>
                <DetailWrapper maxWidth="sm">
                  <CusSkeleton>
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
                  </CusSkeleton>
                  <ContentWrapper>
                    <Box sx={{ width: "100%", fontSize: "24px", mb: 2 }}>
                      <label>
                        <b>{inputState.name}</b>님, 환영합니다
                      </label>
                    </Box>
                    <Box
                      className="ssafyInfo"
                      sx={{ width: "100%", fontSize: "18px", mb: 1 }}
                    >
                      싸피&nbsp;
                      <label>{inputState.generation}기&nbsp;</label>
                      <label>{inputState.class}반&nbsp;</label>
                      {/* <input
                    id="userClass"
                    value={inputState.userClass || ""}
                    disabled={onlyView ? true : false}
                    onChange={handleChange}
                  /> */}
                      <label>(학번 {inputState.studentId})</label>
                    </Box>
                    <RowUpWrapper>
                      {/* <Box whiteSpace="nowrap" sx={{ mb: 1 }}> */}
                      <label>
                        이메일
                        {/* {inputState.email} */}
                        <input value={inputState.email || ""} disabled />
                      </label>
                      {/* </Box> */}
                    </RowUpWrapper>
                    <RowUpWrapper>
                      <label>
                        <span>닉네임</span>
                        <input
                          id="nickname"
                          value={nicknameInfo.nickname || ""}
                          disabled={onlyView ? true : false}
                          // style={{ display: "inline-block", width: "240px" }}
                          onChange={(e) => {
                            handleNicknameChange(e);
                            handleChange(e);
                          }}
                        />
                        {finishUpdate ? (
                          nicknameChange ? (
                            <Button onClick={handleNicknameClick}>
                              중복 확인하기1
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNicknameClick}
                              sx={{ width: "100px" }}
                            >
                              중복 확인하기
                            </Button>
                          )
                        ) : (
                          <></>
                        )}
                      </label>
                    </RowUpWrapper>
                  </ContentWrapper>
                </DetailWrapper>
              </div>
              <ContentWrapper2>
                <RowWrapper>
                  {/* <Box sx={{ mb: 2, verticalAlign: "center" }}> */}
                  <label>생일</label>
                  {onlyView ? (
                    <input
                      value={(userBirthday.value, inputState.birthday)}
                      // value={inputState.birthday}
                      disabled
                      // style={{ width: "60%" }}
                    />
                  ) : (
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePickerWrapper>
                        <DatePickerUser
                          value={userBirthday || ""}
                          label=""
                          changeHandle={(e) => {
                            changeHandle(e);
                          }}
                        ></DatePickerUser>
                      </DatePickerWrapper>
                    </LocalizationProvider>
                  )}
                </RowWrapper>
                {/* </Box> */}
                {/* <Box sx={{ mb: 2 }}> */}
                <RowWrapper>
                  <label>전화번호</label>
                  <input
                    id="phone"
                    value={inputState.phone || ""}
                    disabled={onlyView ? true : false}
                    onChange={handleChange}
                  />
                </RowWrapper>
                {/* </Box> */}
                <RowWrapper>
                  {/* <Box sx={{ mb: 2 }}> */}
                  <label>분야</label>
                  {onlyView ? (
                    <input
                      id="position"
                      disabled
                      value={inputState.position || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <Select
                      id="position"
                      onChange={(e) => {
                        positionHandleChange(e);
                        // handleChange(e);
                      }}
                      value={inputState.position || ""}
                      sx={{ minWidth: 350, height: 35, fontSize: 13 }}
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
                  )}
                  {/* <input
                  id="position"
                  value={inputState.position || ""}
                  disabled={onlyView ? true : false}
                  onChange={handleChange}
                /> */}
                  {/* </Box> */}
                </RowWrapper>
                <div>
                  <label>기술 스택</label>
                  <StackLevelDescription />
                  {onlyView && inputState.stacks_get != null ? (
                    <StackLevelList items={inputState.stacks_get} />
                  ) : (
                    <StackLevelSelectRegister
                      values={(inputState.stacks, inputState.stacks_get)}
                      changeHandle={changeHandle}
                    />
                  )}
                </div>
                <Box sx={{ mb: 2 }}>
                  <label>자기소개</label>
                  <br />
                  <TextField
                    id="description"
                    placeholder="자기자신에 대해 소개해주세요"
                    fullWidth
                    // sx={{ width: "80%" }}
                    rows={4}
                    multiline
                    value={inputState.description || ""}
                    disabled={onlyView ? true : false}
                    onChange={(e) => {
                      handleChange(e);
                      // handleDescriptionChange(e);
                    }}
                  />
                </Box>
                <Box>
                  <label>링크</label>
                  <i style={{ fontSize: "10px" }}>입력 후 엔터를 눌러주세요</i>
                  {onlyView ? (
                    <LinkList items={links} />
                  ) : (
                    <Autocomplete
                      multiple
                      freeSolo
                      // options={links}
                      // getOptionLabel={(option) => option}
                      value={links}
                      options={links.map((l) => l.value)}
                      getOptionLabel={(option) => (option ? option : "")}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(e, option, reason) => {
                        handleLinksChange(option);
                      }}
                    />
                  )}
                </Box>
              </ContentWrapper2>
              {finishUpdate ? (
                <></>
              ) : (
                <ButtonWrapper>
                  <Button sx={{ float: "right" }} onClick={handleQuitClick}>
                    탈퇴하기
                  </Button>
                </ButtonWrapper>
              )}
            </ContentUpWrapper>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
