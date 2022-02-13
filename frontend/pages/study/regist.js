import React from 'react';
import { useState, useRef, useEffect } from 'react';

import Layout from '../../components/Layout';
import StackSelect from '../../components/Common/Stack/StackSelect';

import { Paper, TextField, Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import styled from '@emotion/styled';

import { registAPI } from '../api/study';
import Router from 'next/router';

function StudyRegist() {
  const CusPaper = styled(Paper)`
    width: 100%;
    padding: 10px;

    & > div {
      margin: 10px 0px;
    }

    & .registBtn {
      display: flex;
      justify-content: flex-end;
    }

    & .imgInput {
      display: none;
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

  const [inputValue, setInputValue] = useState({
    collectStatus: 'ING',
    hostId: sessionStorage.getItem('userId'),
  });

  const [files, setFiles] = useState('');

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

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
    inputValue[name] = value;
    // 리렌더링 X
  };

  function validateCheck() {
    let [check, msg] = [true, ''];
    if (typeof inputValue.title == 'undefined')
      [check, msg] = [false, '스터디 이름을 입력해주세요.'];
    if (typeof inputValue.description == 'undefined')
      [check, msg] = [false, '스터디 설명을 입력해주세요.'];
    if (typeof inputValue.size == 'undefined' || inputValue.size == 0)
      [check, msg] = [false, '스터디 인원은 한 명 이상이여야 합니다.'];
    if (typeof inputValue.schedule == 'undefined' || inputValue.schedule == '')
      [check, msg] = [false, '스터디가 진행될 스케쥴을 입력해주세요.'];
    if (
      typeof inputValue.stacks == 'undefined' ||
      inputValue.stacks.length == 0
    )
      [check, msg] = [false, '스터디 주제를 선택해주세요.'];

    if (!check) alert(msg);
    return check;
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Layout>
        <h1 style={{ marginTop: '20px' }}>스터디 등록</h1>
        <CusPaper>
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
            id="studyImg"
            accept="image/*"
            name="file"
            encType="multipart/form-data"
            onChange={onImgChange}
          ></input>

          <TextField
            fullWidth
            name="title"
            label="스터디 이름"
            onChange={(e) => changeHandle(e.target.value, 'title')}
            value={inputValue.title}
          />
          <TextField
            id="outlined-textarea"
            name="description"
            label="스터디 설명"
            placeholder="스터디 설명"
            fullWidth
            rows={4}
            multiline
            onChange={(e) => changeHandle(e.target.value, 'description')}
            value={inputValue.description}
          />
          <TextField
            fullWidth
            name="size"
            label="스터디 인원"
            onChange={(e) => changeHandle(e.target.value, 'size')}
            value={inputValue.size}
          />

          <TextField
            fullWidth
            id="filled-basic"
            name="schedule"
            label="스케쥴"
            onChange={(e) => changeHandle(e.target.value, 'schedule')}
            value={inputValue.schedule}
          />

          <StackSelect
            changeHandle={changeHandle}
            label="스터디 주제"
          ></StackSelect>

          <div className="registBtn">
            <Button
              variant="outlined"
              onClick={() => {
                if (validateCheck()) {
                  const formData = new FormData();

                  Object.keys(inputValue).map((key) => {
                    let value = inputValue[key];
                    if (key === 'stacks')
                      formData.append(key, JSON.stringify(value));
                    else formData.append(key, value);
                  });

                  formData.append('file', files);

                  // for(var key of formData.entries())
                  // {
                  //     console.log(`${key}`);
                  // }

                  registAPI(formData).then((res) => {
                    if (res.statusCode == 200) {
                      alert('스터디가 등록되었습니다.');
                      Router.push('/study');
                    } else alert(`${res.message}`);
                  });
                }
              }}
            >
              등록하기
            </Button>
          </div>
        </CusPaper>
      </Layout>
    </LocalizationProvider>
  );
}

export default React.memo(StudyRegist);
