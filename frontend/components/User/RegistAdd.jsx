import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StackLevelSelectRegister from '../../components/Common/Stack/StackLevelSelectRegister';

import { updateUserAPI } from '../../pages/api/user';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

import styled from '@emotion/styled';
import { LocalizationProvider } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import StackLevelInfoDialog from '../Common/Stack/StackLevelInfoDialog';

export default function RegistInfo2() {
  let registInfoData = useSelector(({ user }) => user.registInfo);

  const [inputState, setInputState] = useState({
    birthday: '',
    stacks: [],
  });

  const positionOptions = [
    { value: '', name: '선택해주세요' },
    { value: 'frontend', name: '프론트엔드' },
    { value: 'backend', name: '백엔드' },
    { value: 'mobile', name: '모바일' },
    { value: 'embedded', name: '임베디드' },
  ];

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

  const [files, setFiles] = useState('');
  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };
  const uploadRef = useRef(null);

  useEffect(() => {
    if (registInfoData == null) {
      Swal.fire({
        title: '잘못된 접근입니다.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 800,
      }).then(() => {
        sessionStorage.clear();
        window.history.forward();
        window.location.replace('/');
      });
    }

    inputState.email = registInfoData.email;
    inputState.userId = registInfoData.userId;
    inputState.nickname = registInfoData.nickname;
    inputState.name = registInfoData.name;
    inputState.class = registInfoData.class;
    inputState.generation = registInfoData.generation;
    inputState.studentId = registInfoData.studentId;
    inputState.password = registInfoData.password;
  });

  useEffect(() => {
    preview();
  });

  const preview = () => {
    if (!files) return false;
    const imgEl = document.querySelector('#img_box');
    const reader = new FileReader();
    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);
    imgEl.innerText = '';
    reader.readAsDataURL(files);
  };

  const changeHandle = (value, name) => {
    if (name == 'birthday') {
      // inputState.birthday = value;
    } else {
      inputState[name] = value;
    }
  };

  const handleChange = (value, name) => {
    inputState[name] = value;
  };
  const positionHandleChange = (e) => {
    inputState.position = e.target.value;
  };

  const phoneReg = /^[0-9]{8,13}$/; // 전화번호 정규표현식
  const urlReg =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  const [birthdayDate, setBirthdayDate] = useState('');

  const handleBirthdayChange = (value) => {
    let year = String(value.getFullYear()).slice(2, 4);
    let month =
      value.getMonth() + 1 > 9
        ? value.getMonth() + 1
        : '0' + (value.getMonth() + 1);
    let day = value.getDate() > 9 ? value.getDate() : '0' + value.getDate();
    let birthdayDateInputStyle = year + month + day;
    setBirthdayDate(value);
    inputState.birthday = birthdayDateInputStyle;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = '';

    if (
      inputState.phone != null &&
      inputState.phone.length > 0 &&
      !phoneReg.test(inputState.phone)
    ) {
      isNormal = false;
      msg = '전화번호 양식을 확인해 주세요';
    } else if (
      inputState.link != null &&
      inputState.link.length >= 1 &&
      !urlReg.test(inputState.link)
    ) {
      isNormal = false;
      // console.log(inputState.link);
      msg = '링크 양식을 확인해 주세요';
    }

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
      if (inputState.stacks[key] === 0) {
        delete inputState.stacks[key];
      }
    });

    if (isNormal) {
      const formData = new FormData();

      Object.keys(inputState).map((key) => {
        let value = inputState[key];
        if (key === 'stacks') {
          formData.append(key, '[' + JSON.stringify(value) + ']');
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
        title: '추가 정보 입력 중입니다',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();

          updateUserAPI(formData).then((res) => {
            // console.log(res);
            // console.log(JSON.stringify(res));
            if (res.statusCode == 200) {
              Swal.fire({
                title: '회원정보 추가에 성공했습니다',
                text: '메인페이지로 이동합니다',
                icon: 'success',
                showConfirmButton: false,
                timer: 700,
              }).then(() => {
                sessionStorage.clear();
                sessionStorage.setItem('userId', inputState.userId);
                sessionStorage.setItem('email', inputState.email);
                sessionStorage.setItem('nickname', inputState.nickname);
                window.history.forward();
                window.location.replace('/');
              });
            } else {
              Swal.fire({
                title: '회원정보 추가에 실패했습니다',
                text: '메인페이지로 이동합니다',
                icon: 'error',
                showConfirmButton: false,
                timer: 500,
              }).then(() => {
                sessionStorage.clear();
                sessionStorage.setItem('userId', inputState.userId);
                sessionStorage.setItem('email', inputState.email);
                sessionStorage.setItem('nickname', inputState.nickname);
                window.history.forward();
                window.location.replace('/');
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
      });
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
        sx={{ flexDirection: 'column' }}
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1 style={{ marginTop: '20px' }}>추가 정보 입력</h1>
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
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              전화번호
            </Typography>
            <br />
            <OutlinedInput
              type="number"
              id="phone"
              name="phone"
              placeholder="01012345678"
              value={inputState.phone}
              onChange={(e) => handleChange(e.target.value, 'phone')}
              sx={{ width: 370, fontSize: 14 }}
            />
          </div>
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              생년월일
            </Typography>
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                id="birthday"
                // name="birthday"
                inputFormat="yyyy-MM-dd"
                mask={'____-__-__'}
                value={birthdayDate || null}
                onChange={handleBirthdayChange}
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: 370, fontSize: 14 }} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              분야
            </Typography>
            <br />
            <Select
              id="position"
              name="position"
              onChange={(e) => {
                // positionHandleChange(e);
                handleChange(e.target.value, 'position');
              }}
              value={inputState.position}
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
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              기술 스택
            </Typography>{' '}
            <StackLevelInfoDialog />
            <StackLevelSelectRegister
              changeHandle={changeHandle}
            ></StackLevelSelectRegister>
          </div>
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              링크
            </Typography>
            <TextField
              id="link"
              name="link"
              value={inputState.link}
              onChange={(e) => {
                handleChange(e.target.value, 'link');
              }}
              fullWidth
            />
          </div>
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              자기소개
            </Typography>
            <br />
            <TextField
              id="description"
              name="description"
              placeholder="자기자신에 대해 소개해주세요"
              fullWidth
              rows={4}
              multiline
              value={inputState.description}
              onChange={(e) => handleChange(e.target.value, 'description')}
              sx={{ width: 370, fontSize: 14 }}
            />
          </div>
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
