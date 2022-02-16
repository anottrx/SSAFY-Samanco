import React, { useState, useEffect, useRef, useCallback } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
// import { useCookies } from 'react-cookie';
import {
  getUserLoginTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
  updateNicknameAPI,
  deleteUserAPI,
  loginAPI,
} from '../../pages/api/user';
import { projectImageDownload } from '../../pages/api/project';
import DatePickerUser from '../../components/Common/DatePickerUser';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
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
import Swal from 'sweetalert2';

import styled from '@emotion/styled';
import StackLevelListInfo from '../Common/Stack/StackLevelListInfo';
import StackLevelSelectRegister from '../Common/Stack/StackLevelSelectRegister';
import LinkList from '../Common/LinkList';
import StackLevelInfoDialog from '../Common/Stack/StackLevelInfoDialog';
// import forceReload from '../../util/ForceReload';
import MyInfoLayout from './MenuLayout';

const phoneReg = /^[0-9]{8,13}$/; // 전화번호 정규표현식
// const urlReg = [(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*);
const urlReg =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const DatePickerWrapper = styled.div`
  display: flex;
  // width: 370px;
  & > div {
    flex: 1;
    // width: 370px;
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
  object-fit: scale-down;
`;
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

export default function MyInfo() {
  const dispatch = useDispatch();
  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(userActions.setUserDetail({ detail }));
    },
    [dispatch]
  );
  const detail = useSelector(({ user }) => user.userDetail);

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
    nickname: sessionStorage.getItem('nickname'),
    id: sessionStorage.getItem('userId'),
  });

  const cookies = new Cookies();
  // const [cookie, setCookie] = useCookies(['userToken']);

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
        if (yy == 22 && mm == '02') {
          inputState.birthday = '';
          userBirthday.initDate = '';
          userBirthday.value = '';
        }
      }
      inputState[name] = value;
      // console.log('스택 ' + JSON.stringify(inputState));
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

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  function createAndDownloadBlobFile(body, filename) {
    const blob = new Blob([body]);
    const fileName = `${filename}`;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      setImageDefault(url);
    }
  }

  function changeToBlob(file) {
    projectImageDownload(file).then((res) => {
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
      }
    });
  }

  async function getUserInfo() {
    // 사용자 정보 가져오는 함수
    // const token = cookie.userToken;
    const token = cookies.get('userToken');
    cookies.remove('userToken', { path: '/myinfo' });
    // cookies.remove("userToken", {path: "/"})
    inputState.userId = sessionStorage.getItem('userId');
    inputState.nickname = sessionStorage.getItem('nickname');
    inputState.email = sessionStorage.getItem('email');

    getUserInfoAPI(inputState.userId).then((res) => {
      if (res.statusCode == 200) {
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
          userBirthday.initDate = year + '-' + month + '-' + day;
          userBirthday.value = year + '-' + month + '-' + day;
          if (year == '22' && month == '02') {
            userBirthday.value = '';
            inputState.birthday = '';
          }
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
        } else {
          // 이미지 파일이 있으면
          changeToBlob(res.user.file);
        }

        // if (res.user.link != null) {
        //   setLinks(inputState.link.split(" "));
        //   console.log(links);
        //   console.log(inputState.link.split(" "));
        // } else {
        //   setLinks();
        // }
        // inputState.file = res.user.file;
        setLoading(true);
      } else {
        //
      }
    });
    // });
  }

  useEffect(() => {
    getUserInfo();
    // preview();
  }, []);

  useEffect(() => {
    preview();
  }, [files]);

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
    reader.onload = () => {
      if (imgEl) {
        imgEl.style.backgroundImage = `url(${reader.result})`;
        imgEl.innerText = '';
      }
    };
    reader.readAsDataURL(files);
  };

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      nickname: e.target.value,
      id: sessionStorage.getItem('userId'),
    });
  };

  const positionHandleChange = (e) => {
    inputState.position = e.target.value;
  };

  const [checkedNickname, setCheckedNickname] = useState(true);
  const [changeNickname, setChangeNickname] = useState(false);
  const handleUserNicknameClick = (e) => {
    Swal.fire({
      icon: 'info',
      title: '닉네임 중복 확인 후 수정완료 버튼을 눌러야 변경이 완료됩니다',
      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
    });
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
      } else if (nicknameInfo.nickname == sessionStorage.getItem('nickname')) {
        msg = '현재 닉네임과 동일합니다';
        isNormal = false;
      }

      if (isNormal) {
        Swal.fire({
          title: '닉네임 확인 중입니다',
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();

            updateNicknameAPI(nicknameInfo).then((res) => {
              if (res.statusCode == 200) {
                setCheckPassword(true);
                Swal.fire({
                  title: '멋진 닉네임이네요~^^',
                  text: '변경 가능합니다. 수정완료 버튼을 통해 바꿔주세요',
                  icon: 'success',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
                setNicknameChange(false);
                setChangeNickname(false);
                setCheckedNickname(true);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: `${res.message}`,
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
              }
            });
          },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: msg,
          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
        }).then(() => {
          setChangeNickname(false);
          setNicknameChange(false);
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setOnlyView(false);
    setFinishUpdate(true);
    setReloadCondition(true);
    // console.log("수정하기 버튼 누름");

    // setAuthChange(true);
    // setOnlyView(false);
    // setFinishUpdate(true);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    nicknameInfo.nickname = sessionStorage.getItem('nickname');
    Swal.fire({
      title: '정보 수정을 취소합니다',
      icon: 'warning',
      showConfirmButton: false,
      timer: 500,
    }).then(() => {
      setOnlyView(true);
      setFinishUpdate(false);
      getUserInfo();
    });
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

    let isNormal = true;
    let msg = '';
    // console.log(nicknameChange);
    if (changeNickname) {
      isNormal = false;
      msg = '닉네임 중복 체크를 완료해 주세요.';
    } else if (
      inputState.phone != null &&
      inputState.phone.length > 0 &&
      !phoneReg.test(inputState.phone)
    ) {
      isNormal = false;
      msg = '전화번호 양식을 확인해 주세요.';
    } else if (
      inputState.link != null &&
      inputState.link.length >= 1 &&
      !urlReg.test(inputState.link)
    ) {
      isNormal = false;
      msg = '링크 양식을 확인해 주세요.';
    }

    if (isNormal) {
      handleClickOpen();
    } else {
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
  };

  const handleUpdateInfo = (e) => {
    let isNormal = true;
    let msg = '';

    if (
      inputState.phone != null &&
      inputState.phone.length > 0 &&
      !phoneReg.test(inputState.phone)
    ) {
      isNormal = false;
      msg = '전화번호 양식을 확인해 주세요.';
    } else if (changeNickname) {
      isNormal = false;
      msg = '닉네임 중복 체크를 완료해 주세요.';
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

      loginAPI(loginInfo).then((res) => {
        if (res.statusCode == 200) {
          // 로그인 성공
          inputState.password = loginInfo.password;

          const formData = new FormData();

          Object.keys(inputState).map((key) => {
            let value = inputState[key];
            if (key === 'stacks') {
              formData.append(key, '[' + JSON.stringify(value) + ']');
            } else if (key === 'birthday') {
              if (
                inputState.birthday.slice(0, 2) == '22' &&
                inputState.birthday.slice(2, 4) == '02'
              ) {
                //
              } else {
                formData.append(key, inputState.birthday);
              }
            } else if (key === 'phone') {
              if (inputState.phone == null || inputState.phone == '') {
                //
              } else {
                formData.append(key, inputState.phone);
              }
            } else {
              formData.append(key, value);
            }
          });

          formData.append('file', files);

          for (let key of formData.entries()) {
            // console.log('key', `${key}`);
          }

          Swal.fire({
            title: '회원정보 수정 진행중입니다',
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
              updateUserAPI(formData).then((res) => {
                if (res.statusCode == 200) {
                  // console.log("성공")
                  Swal.fire({
                    title: '회원정보 수정에 성공했습니다',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 500,
                  }).then(() => {
                    if (
                      sessionStorage.getItem('nickname') != inputState.nickname
                    ) {
                      // 닉네임 변경시 상단바 변경도 필요하기 때문에 새로고침
                      sessionStorage.setItem('nickname', inputState.nickname);
                      // forceReload();
                    }
                    setNicknameChange(false);
                    setReloadCondition(true);
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: '회원정보 수정에 실패했습니다',
                    text: '지속적으로 같은 문제 발생시 관리자에게 문의하세요',
                    confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                  });
                }
              });
            },
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
    } else {
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
  };

  const classHandleChange = (e) => {
    inputState.class = e.target.value;
  };

  const handleQuitClick = (event) => {
    const userId = sessionStorage.getItem('userId');
    Swal.fire({
      title: '탈퇴하시겠습니까? 확인 버튼을 누르면 즉시 탈퇴됩니다',
      text: '탈퇴 취소는 할 수 없으니 신중하게 결정해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        // if (window.confirm('탈퇴하시겠습니까?')) {
        deleteUserAPI(userId).then((res) => {
          if (res.statusCode == 200) {
            // 탈퇴 성공 시
            Swal.fire({
              icon: 'success',
              title: '탈퇴가 완료되었습니다',
              text: '다음에는 오프라인에서 함께 코딩해요!',
              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
            });
            sessionStorage.clear();
            cookies.set('userToken', '');
            cookies.set('userEmail', '');
            // 페이지 이동
            window.history.forward();
            document.location.href = '/';
          } else {
            Swal.fire({
              icon: 'error',
              title: '탈퇴에 문제가 발생했습니다',
              text: '지속적으로 같은 문제 발생시 관리자에게 문의하세요',
              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: '탈퇴가 취소되었습니다',
          text: '좋아요! 싸피사만코와 오래오래 코딩해요!',
          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
        });
      }
    });
  };

  return (
    <CusContainer maxWidth="md">
      <CusCard>
        {loading ? (
          <div>
            <CardContent>
              <h1>{inputState.name}님, 환영합니다</h1>
              <ContentUpWrapper>
                <ButtonWrapper>
                  {finishUpdate ? (
                    <>
                      <Button
                        variant="outlined"
                        sx={{ float: 'right' }}
                        onClick={handleUpdateFinishClick}
                      >
                        수정완료
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ float: 'right', marginRight: 1 }}
                        onClick={handleResetClick}
                      >
                        수정취소
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{ float: 'right' }}
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
                <Divider light sx={{ marginTop: 1.5, marginBottom: 1 }} />
                <div>
                  <DetailWrapper maxWidth="sm">
                    <CardContent sx={{ width: '60%', marginRight: 5 }}>
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
                        <label>이메일</label>
                        {onlyView ? (
                          <input value={inputState.email} disabled />
                        ) : (
                          <TextField
                            value={inputState.email}
                            disabled
                            inputProps={{
                              style: {
                                height: 35,
                                padding: '0 14px',
                              },
                            }}
                          />
                        )}
                      </RowUpWrapper>

                      <RowUpWrapper>
                        <label>닉네임</label>
                        {onlyView ? (
                          <>
                            <input
                              id="nickname"
                              value={nicknameInfo.nickname || ''}
                              disabled={
                                onlyView ? true : changeNickname ? false : true
                              }
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
                                        sx={{ width: '10px' }}
                                      >
                                        변경하기
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
                      </RowUpWrapper>
                      <RowUpWrapper>
                        <label>생년월일</label>
                        {onlyView ? (
                          <input
                            value={
                              userBirthday.value.length == 10 &&
                              userBirthday.value.slice(2, 4) != '22'
                                ? userBirthday.value
                                : ''
                            }
                            disabled
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
                      </RowUpWrapper>
                      <RowWrapper>
                        <label>전화번호</label>
                        {onlyView ? (
                          <input
                            id="phone"
                            type="number"
                            value={inputState.phone || ''}
                            disabled
                          />
                        ) : (
                          <TextField
                            id="phone"
                            type="number"
                            placeholder={onlyView ? '' : '01012345678'}
                            value={inputState.phone || ''}
                            onChange={handleChange}
                            inputProps={{
                              style: {
                                height: 35,
                                padding: '0 14px',
                              },
                            }}
                          />
                        )}
                      </RowWrapper>
                      {/* </Box> */}
                      <RowUpWrapper>
                        <label>분야</label>
                        {onlyView ? (
                          <>
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
                            sx={{ height: 35, fontSize: 13 }}
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
                      </RowUpWrapper>
                    </CardContent>
                    {onlyView && inputState.file == null ? (
                      <ImgDefault src={imageDefault}></ImgDefault>
                    ) : (
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
                      placeholder={
                        onlyView ? '' : '자기자신에 대해 소개해주세요'
                      }
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
                    <label>링크</label>
                    <br />
                    {onlyView ? (
                      <a href={inputState.link} target="_blank">
                        {inputState.link}
                      </a>
                    ) : (
                      <TextField
                        id="link"
                        value={inputState.link || ''}
                        onChange={handleChange}
                        fullWidth
                      />
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
                      탈퇴하기
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
