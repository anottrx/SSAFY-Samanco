import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import { useCookies } from 'react-cookie';
import {
  getUserLoginTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
  updateNicknameAPI,
  deleteUserAPI,
  loginAPI,
} from '../../pages/api/user';
import DatePickerUser from '../../components/Common/DatePickerUser';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';

import styled from '@emotion/styled';
import StackLevelListInfo from '../Common/Stack/StackLevelListInfo';
import StackLevelSelectRegister from '../Common/Stack/StackLevelSelectRegister';
import LinkList from '../Common/LinkList';
import StackLevelInfoDialog from '../Common/Stack/StackLevelInfoDialog';
import MyInfoLayout from './MenuLayout';

const phoneReg = /^[0-9]{8,13}$/; // 전화번호 정규표현식
// const urlReg = [(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*);
const urlReg =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const DatePickerWrapper = styled.div`
  display: flex;
  & > div {
    flex: 1;
    width: 370px;
    margin: 0px 0px;
  }
`;
const CusCard = styled(Card)`
  // margin-top: 10px;
  padding: 10px;

  // display: flex;
  margin: 10px 0px;
  align-items: center;

  & h4 {
    font-weight: bolder;
    padding: 0;
    margin: 0;
  }
`;
const CusContainer = styled(Container)`
  float: left;
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
const ImgDefault = styled.img`
  // padding: 20px;
  // border: 1px dashed grey;
  min-width: 150px;
  min-height: 150px;
  max-width: 180px;
  margin: 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
`;
// const DetailWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
// `;
const DetailWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  // align-items: baseline;

  & > div {
    // display: flex;
    // margin-left: auto;
    // float: right;
  }

  & div > p {
    margin-left: 10px;
  }

  & .dateOrTime {
    color: gray;
  }
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
  grid-template-columns: 60px 12fr;
  grid-gap: 8px;
  padding: 2px 0px;
`;
const RowWrapper = styled.div`
  display: grid;
  // grid-template-columns: max-content max-content;
  grid-template-columns: 60px 12fr;
  grid-gap: 8px;
  padding: 2px 0px;
`;

export default function UserInfoPage() {
  const [authChange, setAuthChange] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [finishUpdate, setFinishUpdate] = useState(false);
  const [nicknameChange, setNicknameChange] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [reloadCondition, setReloadCondition] = useState(false);

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [imageDefault, setImageDefault] = useState('');

  const [inputState, setInputState] = useState({
    userId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    nickname: '',
    class: '',
    birthday: '',
    initDate: '',
    generation: '',
    studentId: '',
    stacks: [],
    stacks_get: [],
    position: '',
    link: '',
    description: '',
    image_id: '',
  });

  const positionOptions = [
    { value: '', name: '선택해 주세요' },
    { value: 'frontend', name: '프론트엔드' },
    { value: 'backend', name: '백엔드' },
    { value: 'mobile', name: '모바일' },
    { value: 'embedded', name: '임베디드' },
  ];

  const classOptions = [
    { value: 'JAVA', name: '자바반' },
    { value: 'PYTHON', name: '파이썬반' },
    { value: 'MOBILE', name: '모바일반' },
    { value: 'EMBEDDED', name: '임베디드반' },
  ];

  const [nicknameInfo, setNicknameInfo] = useState({
    nickname: '',
    id: sessionStorage.getItem('userInfo'),
  });

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies(['userToken']);

  const [files, setFiles] = useState('');

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  const changeHandle = (value, name) => {
    if (name == 'birthday') {
      inputState.birthday = value;
      userBirthday.value = value;
      console.log('생일 ' + JSON.stringify(inputState));
    } else {
      if (name == null && value.length == 6) {
        inputState.birthday = value;
        let yy = inputState.birthday.slice(0, 2);
        yy = Number(yy) > 25 ? 19 + yy : 20 + yy;
        let mm = inputState.birthday.slice(2, 4);
        let dd = inputState.birthday.slice(4, 6);
        setUserBirthdayDate(yy + '-' + mm + '-' + dd);
        userBirthday.initDate = yy + '-' + mm + '-' + dd;
        userBirthday.value = yy + '-' + mm + '-' + dd;
      }
      inputState[name] = value;
      console.log('스택 ' + JSON.stringify(inputState));
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

  const [userBirthday, setUserBirthday] = useState({
    value: '',
    initDate: '',
  });
  const [userBirthdayDate, setUserBirthdayDate] = useState('');

  async function getUserInfo() {
    // 사용자 정보 가져오는 함수
    getUserInfoAPI(sessionStorage.getItem('userInfo')).then((res) => {
      if (res.statusCode == 200) {
        console.log('사용자 정보 보기 결과: ' + JSON.stringify(res));
        inputState.email = res.user.email;
        inputState.nickname = res.user.nickname;
        nicknameInfo.nickname = res.user.nickname;
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
          setUserBirthdayDate(year + '-' + month + '-' + day);
          // console.log(userBirthdayDate);
          userBirthday.initDate = year + '-' + month + '-' + day;
          userBirthday.value = year + '-' + month + '-' + day;
        }
        if (res.user.phone !== '00000000000') {
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
        inputState.image_id = res.user.file;

        if (inputState.image_id == null) {
          if (inputState.generation == 7) {
            setImageDefault('/images/profile_default_gen7.png');
          } else if (inputState.generation == 0) {
            setImageDefault('/images/profile_default_gen0.png');
          } else {
            setImageDefault('/images/profile_default_gen6.png');
          }
        }

        if (res.user.link != null) {
          setLinks(inputState.link.split(' '));
          console.log(links);
          console.log(inputState.link.split(' '));
        } else {
          setLinks();
        }
        // inputState.file = res.user.file;
        setLoading(true);
      } else {
        //
      }
    });
  }

  useEffect(() => {
    getUserInfo();
    preview();
  }, []);

  useEffect(() => {
    if (reloadCondition) {
      getUserInfo();
      preview();
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector('#img_box');
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = '';
    reader.readAsDataURL(files);
  };

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      nickname: e.target.value,
      id: sessionStorage.getItem('userInfo'),
    });
  };

  function handleLinksChange(linkArr) {
    console.log(linkArr);
    let linkList = '';
    const size = linkArr.length;
    for (let i = 0; i < size; i++) {
      linkList = linkList + ' ' + linkArr[i];
      console.log(linkArr[i]);
    }
    linkList = linkList.trim();
    inputState.link = linkList;
    setLinks(linkList.split(' '));
  }

  const positionHandleChange = (e) => {
    console.log(e.target.value);
    inputState.position = e.target.value;
    console.log('inputState' + JSON.stringify(inputState));
    console.log(inputState);
  };

  const [checkedNickname, setCheckedNickname] = useState(true);
  const [changeNickname, setChangeNickname] = useState(false);
  const handleUserNicknameClick = (e) => {
    alert('닉네임 중복 확인 후 수정완료 버튼을 눌러야 변경이 완료됩니다');
    setCheckedNickname(false);
    setChangeNickname(true);
    setNicknameChange(true);
  };
  const handleNicknameClick = (e) => {
    e.preventDefault();
    // 닉네임 바꿀 수 있는지 확인
    if (nicknameChange) {
      let isNormal = true;
      let msg = '';
      if (nicknameInfo.nickname == '') {
        msg = '닉네임을 입력해주세요';
        isNormal = false;
      }
      // else if (nicknameInfo.nickname == sessionStorage.getItem("nickname")) {
      //   msg = "현재 닉네임과 동일합니다";
      //   isNormal = false;
      // }
      if (!isNormal) {
        alert(msg);
        setChangeNickname(false);
        setNicknameChange(false);
      }

      if (isNormal) {
        updateNicknameAPI(nicknameInfo).then((res) => {
          if (res.statusCode == 200) {
            setCheckPassword(true);
            alert('닉네임 변경이 가능합니다.');
            setNicknameChange(false);
            setChangeNickname(false);
            setCheckedNickname(true);
          } else {
            alert(`${res.message}`);
          }
        });
      }
    } else {
      //
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setOnlyView(false);
    setFinishUpdate(true);
    // console.log("수정하기 버튼 누름");

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
    if (reason && reason == 'backdropClick') return;
    setOpen(false);
  };
  const [loginInfo, setLoginInfo] = useState({
    email: inputState.email,
    password: '',
  });
  const handlePasswordChange = (e) => {
    loginInfo.email = inputState.email;
    loginInfo.password = e.target.value;
  };

  const handleUpdateFinishClick = (e) => {
    e.preventDefault();
    console.log(inputState.stacks);

    let isNormal = true;

    if (changeNickname) {
      isNormal = false;
      alert('닉네임 중복 체크를 완료해 주세요.');
    } else if (
      inputState.phone.length > 0 &&
      !phoneReg.test(inputState.phone)
    ) {
      isNormal = false;
      alert('전화번호 양식을 확인해 주세요.');
    } else if (links.length >= 1 && !urlReg.test(links)) {
      // isNormal = false;
      console.log(links.length);
      // alert("링크 양식을 확인해 주세요.")
    }

    if (isNormal) {
      handleClickOpen();
      console.log(loginInfo);
    }
  };

  const handleUpdateInfo = (e) => {
    let isNormal = true;

    if (inputState.phone.length > 0 && !phoneReg.test(inputState.phone)) {
      isNormal = false;
      alert('전화번호 양식을 확인해 주세요.');
    } else if (changeNickname) {
      isNormal = false;
      alert('닉네임 중복 체크를 완료해 주세요.');
    }

    if (isNormal) {
      inputState.stacks = {
        HTML: inputState.HTML,
        CSS: inputState.CSS,
        JavaScript: inputState.JavaScript,
        VueJS: inputState.VueJS,
        React: inputState.React,
        Python: inputState.Python,
        Java: inputState.Java,
        C: inputState.C,
        'C++': inputState.C2,
        'C#': inputState.C3,
        SpringBoot: inputState.SpringBoot,
        MySQL: inputState.MySQL,
        Git: inputState.Git,
        AWS: inputState.AWS,
        Docker: inputState.Docker,
        Linux: inputState.Linux,
        Jira: inputState.Jira,
        Django: inputState.Django,
        Redis: inputState.Redis,
        Kotlin: inputState.Kotlin,
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

      if (loginInfo.password == 'admin') {
        // loginAPI(loginInfo).then((res) => {
        // console.log(loginInfo.email + " " + loginInfo.password);
        // if (res.statusCode == 200) {
        // console.log("로그인 성공");
        // inputState.password = loginInfo.password;

        const formData = new FormData();

        console.log('inputState' + JSON.stringify(inputState));
        console.log(inputState);

        Object.keys(inputState).map((key) => {
          let value = inputState[key];
          if (key === 'stacks') {
            formData.append(key, '[' + JSON.stringify(value) + ']');
            // console.log(key + " " + ("["+JSON.stringify(value)+"]"));
          } else if (key === 'phone') {
            if (inputState.phone == '') {
              const phoneNull = '00000000000';
              formData.append(key, phoneNull);
              // inputState.phone = "00000000000";
            } else {
              formData.append(key, inputState.phone);
            }
          } else {
            formData.append(key, value);
            console.log(key + ' ' + value);
          }
        });

        formData.append('file', files);

        for (let key of formData.entries()) {
          console.log('key', `${key}`);
        }

        updateUserAPI(formData).then((res) => {
          console.log(res);
          console.log(JSON.stringify(res));
          if (res.statusCode == 200) {
            // if (sessionStorage.getItem("nickname") != inputState.nickname) {
            // 닉네임 변경시 상단바 변경도 필요하기 때문
            // sessionStorage.setItem("nickname", inputState.nickname);
            setReloadCondition(true);
            // }
            // setNicknameChange(false);
          } else {
            alert('회원정보 추가에 실패했습니다. 에러코드:' + res.statusCode);
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
      // });
    }
  };

  const classHandleChange = (e) => {
    // inputState.userClass = e.target.value;
    inputState.class = e.target.value;
  };

  const handleQuitClick = (event) => {
    const userId = sessionStorage.getItem('userInfo');
    if (
      window.confirm('탈퇴하시겠습니까? 확인 버튼을 누르면 즉시 탈퇴됩니다')
    ) {
      deleteUserAPI(userId).then((res) => {
        if (res.statusCode == 200) {
          // 탈퇴 성공 시
          alert('탈퇴시켰습니다');
          // sessionStorage.clear();
          sessionStorage.setItem('userInfo', '');
          // cookies.set("userToken", "");
          // cookies.set("userEmail", "");
          // 페이지 이동
          window.history.forward();
          document.location.href = '/';
        } else alert(`${res.message}`);
      });
    } else {
      alert('취소했습니다');
    }
  };

  return (
    <CusContainer maxWidth="md">
      <CusCard>
        {loading ? (
          <div>
            <CardContent>
              <h1>{inputState.name}님</h1>
              <ContentUpWrapper>
                {/* <ButtonWrapper>
                  {finishUpdate ? (
                    <>
                      <Button
                        variant="outlined"
                        sx={{ float: "right" }}
                        onClick={handleUpdateFinishClick}
                      >
                        수정완료
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ float: "right", marginRight: 1 }}
                        onClick={handleResetClick}
                      >
                        수정취소
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{ float: "right" }}
                      onClick={handleUpdateClick}
                    >
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
                <br /> */}
                <Divider light sx={{ marginTop: 1.5, marginBottom: 1 }} />
                <div>
                  <DetailWrapper maxWidth="sm">
                    <CardContent sx={{ width: '60%', marginRight: 5 }}>
                      {/* <Box sx={{ width: "100%", fontSize: "24px", mb: 2 }}>
                      <label>
                        <b>{inputState.name}</b>님, 환영합니다
                      </label>
                    </Box> */}
                      <Box
                        className="ssafyInfo"
                        sx={{ width: '100%', fontSize: '18px', mb: 1 }}
                      >
                        싸피&nbsp;
                        <label>{inputState.generation}기&nbsp;</label>
                        {onlyView ? (
                          <label>{inputState.class}반&nbsp;</label>
                        ) : (
                          <Select
                            id="class"
                            onChange={classHandleChange}
                            defaultValue={classOptions[0].value}
                            value={classOptions.value}
                            sx={{ width: 120, fontSize: 14, height: 35 }}
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
                        )}
                        <label>(학번 {inputState.studentId})</label>
                      </Box>
                      <RowUpWrapper>
                        {/* <Box whiteSpace="nowrap" sx={{ mb: 1 }}> */}
                        <label>이메일</label>
                        {/* {inputState.email} */}
                        <input value={inputState.email || ''} disabled />
                        {/* </Box> */}
                      </RowUpWrapper>
                      <RowUpWrapper>
                        {/* <label> */}
                        <label>닉네임</label>
                        {onlyView ? (
                          <>
                            <input
                              id="nickname"
                              value={nicknameInfo.nickname || ''}
                              disabled={
                                onlyView ? true : changeNickname ? false : true
                              }
                              // style={{ display: "inline-block", width: "240px" }}
                              onChange={(e) => {
                                handleNicknameChange(e);
                                handleChange(e);
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <OutlinedInput
                              id="nickname"
                              value={nicknameInfo.nickname || ''}
                              disabled={
                                onlyView ? true : changeNickname ? false : true
                              }
                              // style={{ display: "inline-block", width: "240px" }}
                              onChange={(e) => {
                                handleNicknameChange(e);
                                handleChange(e);
                              }}
                              sx={{ height: 35 }}
                              endAdornment={
                                <InputAdornment position="end">
                                  {finishUpdate ? (
                                    nicknameChange ? (
                                      <Button
                                        variant="outlined"
                                        onClick={handleNicknameClick}
                                        sx={{ width: '100px' }}
                                      >
                                        중복 확인하기
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        onClick={handleUserNicknameClick}
                                        sx={{ width: '100px' }}
                                      >
                                        닉네임 변경하기
                                      </Button>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </InputAdornment>
                              }
                            />
                          </>
                        )}

                        {/* </label> */}
                      </RowUpWrapper>
                      <RowWrapper>
                        {/* <Box sx={{ mb: 2, verticalAlign: "center" }}> */}
                        <label>생년월일</label>
                        {onlyView ? (
                          <input
                            value={userBirthday.value}
                            // value={inputState.birthday}
                            disabled
                            // style={{ width: "60%" }}
                          />
                        ) : (
                          <LocalizationProvider dateAdapter={DateAdapter}>
                            <DatePickerWrapper>
                              <DatePickerUser
                                value={userBirthday || ''}
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
                          type="number"
                          placeholder={onlyView ? '' : '01012345678'}
                          value={inputState.phone || ''}
                          disabled={onlyView ? true : false}
                          onChange={handleChange}
                        />
                      </RowWrapper>
                      {/* </Box> */}
                      <RowWrapper>
                        <label>분야</label>
                        {onlyView ? (
                          <>
                            {/* <label>
                        {positionOptions.map((u, i) => {
                          if (u.value == inputState.position) {
                            return (<label>{u.name}</label>);
                          }
                        })}
                      </label> */}
                            <input
                              id="position"
                              disabled
                              value={
                                inputState.position == ''
                                  ? ''
                                  : positionOptions
                                      .map((u, i) => {
                                        if (u.value == inputState.position) {
                                          return u.name;
                                        }
                                      })
                                      .join('')
                              }
                              //  value={inputState.position || ""}
                              // onChange={handleChange}
                            />
                          </>
                        ) : (
                          <Select
                            id="position"
                            onChange={(e) => {
                              positionHandleChange(e);
                              handleChange(e);
                            }}
                            value={inputState.position || ''}
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
                      </RowWrapper>
                    </CardContent>
                    {onlyView && inputState.file == null ? (
                      <ImgDefault src={imageDefault}></ImgDefault>
                    ) : (
                      //  <ImgDefault src="/images/gen7.png"></ImgDefault>
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
                    )}
                  </DetailWrapper>
                </div>
                <ContentWrapper2>
                  <CardContent>
                    <label>기술 스택</label>
                    <StackLevelInfoDialog />
                    {onlyView && inputState.stacks_get != null ? (
                      <StackLevelListInfo items={inputState.stacks_get} />
                    ) : (
                      <StackLevelSelectRegister
                        values={(inputState.stacks, inputState.stacks_get)}
                        changeHandle={changeHandle}
                      />
                    )}
                  </CardContent>
                  <CardContent>
                    <label>자기소개</label>
                    <br />
                    <TextField
                      id="description"
                      // placeholder="자기자신에 대해 소개해주세요"
                      fullWidth
                      rows={4}
                      multiline
                      value={inputState.description || ''}
                      disabled={onlyView ? true : false}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </CardContent>
                  <CardContent>
                    <label>링크</label>&nbsp;
                    {onlyView ? (
                      <LinkList items={links} />
                    ) : (
                      <>
                        <span style={{ fontSize: '10px' }}>
                          (최대 2개 가능)
                        </span>
                        <i style={{ fontSize: '10px' }}>
                          &nbsp;입력 후 엔터를 눌러주세요
                        </i>
                        <Autocomplete
                          multiple
                          freeSolo
                          // options={links}
                          // getOptionLabel={(option) => option}
                          value={links}
                          options={links.map((l) => l.value)}
                          getOptionLabel={(option) => (option ? option : '')}
                          renderInput={(params) => <TextField {...params} />}
                          onChange={(e, option, reason) => {
                            handleLinksChange(option);
                          }}
                        />
                      </>
                    )}
                  </CardContent>
                </ContentWrapper2>
                {finishUpdate ? (
                  <></>
                ) : (
                  <ButtonWrapper>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ float: 'right' }}
                      onClick={handleQuitClick}
                    >
                      탈퇴시키기
                    </Button>
                  </ButtonWrapper>
                )}
              </ContentUpWrapper>
            </CardContent>
          </div>
        ) : (
          <></>
        )}
      </CusCard>
    </CusContainer>
  );
}
