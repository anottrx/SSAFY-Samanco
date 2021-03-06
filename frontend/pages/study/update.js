import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';

import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

import StackSelect from '../../components/Common/Stack/StackSelect';

import styled from '@emotion/styled';
import { updateAPI } from '../api/study';

import Router from 'next/router';
import Head from 'next/head';

function studyUpdate() {
  const detail = useSelector(({ study }) => study.studyDetail);
  let [imageUrl, setImageUrl] = useState(undefined);

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
    studyId: detail.id,
    hostId: sessionStorage.getItem('userId'),
    stacks: detail.stacks,
    positions: detail.positions,
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

  useEffect(() => {
    if (detail.imageUrl) {
      //console.log(detail);
      setImageUrl(detail.imageUrl);
      initPreview();
    }
  }, []);

  const initPreview = () => {
    const imgEl = document.querySelector('#img_box');
    const newImage = document.createElement('img');

    newImage.setAttribute('src', imageUrl);
    newImage.style.height = '100px';
    newImage.style.width = '100px';
    newImage.style.objectFit = 'contain';
    // const reader = new FileReader();

    // console.log(imageUrl);
    // reader.onload = () => (imgEl.style.backgroundImage = `url(${imageUrl})`);

    imgEl.innerText = '';
    imgEl.append(newImage);
    // reader.readAsDataURL(imageUrl);
  };

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
    // ???????????? X
  };

  function validateCheck() {
    let [check, msg] = [true, ''];
    if (typeof inputValue.title == 'undefined')
      inputValue['title'] = detail.title;
    else if (inputValue.title == '')
      [check, msg] = [false, '????????? ????????? ??????????????????.'];
    if (typeof inputValue.collectStatus == 'undefined')
      inputValue['collectStatus'] = detail.collectStatus;
    if (typeof inputValue.description == 'undefined')
      inputValue['description'] = detail.description;
    if (typeof inputValue.stacks == 'undefined')
      inputValue['stacks'] = detail.stacks;
    if (typeof inputValue.size == 'undefined') inputValue['size'] = detail.size;
    else if (inputValue.size == 0 || inputValue.size == '')
      [check, msg] = [false, '????????? ????????? ??? ??? ??????????????? ?????????.'];
    if (typeof inputValue.schedule == 'undefined')
      inputValue['schedule'] = detail.schedule;
    else if (inputValue.schedule == '')
      [check, msg] = [false, '???????????? ????????? ???????????? ??????????????????.'];
    if (
      typeof inputValue.stacks == 'undefined' ||
      inputValue.stacks.length == 0
    )
      [check, msg] = [false, '????????? ????????? ??????????????????.'];

    // if (!check) alert(msg);
    if (!check) {
      // alert(msg);
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
      });
    }
    return check;
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Layout>
        <Head>
          <title>????????? ?????? | ???????????????</title>
        </Head>
        <h1 style={{ marginTop: '20px' }}>????????? ??????</h1>
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

          <FormControl>
            <InputLabel id="status-select-label">?????? ??????</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              name="collectStatus"
              defaultValue={detail.collectStatus}
              value={inputValue.collectStatus}
              label="?????? ??????"
              onChange={(e) => changeHandle(e.target.value, 'collectStatus')}
            >
              <MenuItem value={'ING'}>?????????</MenuItem>
              <MenuItem value={'END'}>?????? ??????</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="title"
            label="????????? ??????"
            onChange={(e) => changeHandle(e.target.value, 'title')}
            defaultValue={detail.title}
            value={inputValue.title}
          />
          <TextField
            id="outlined-textarea"
            name="description"
            label="????????? ??????"
            placeholder="????????? ??????"
            fullWidth
            rows={4}
            multiline
            onChange={(e) => changeHandle(e.target.value, 'description')}
            defaultValue={detail.description}
            value={inputValue.description}
          />

          <TextField
            fullWidth
            name="size"
            label="????????? ??????"
            onChange={(e) => changeHandle(e.target.value, 'size')}
            defaultValue={detail.size}
            value={inputValue.size}
          />

          <TextField
            fullWidth
            id="filled-basic"
            name="schedule"
            label="?????????"
            onChange={(e) => changeHandle(e.target.value, 'schedule')}
            defaultValue={detail.schedule}
            value={inputValue.schedule}
          />

          <StackSelect
            changeHandle={changeHandle}
            initData={detail.stacks}
            label="????????? ?????? (??????)"
          ></StackSelect>

          <div className="registBtn">
            <Button
              variant="outlined"
              onClick={() => {
                if (validateCheck()) {
                  const formData = new FormData();
                  Swal.fire({
                    title: '????????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();
                      Object.keys(inputValue).map((key) => {
                        let value = inputValue[key];
                        if (key === 'stacks' || key == 'positions')
                          formData.append(key, JSON.stringify(value));
                        else formData.append(key, value);
                      });

                      formData.append('file', files);

                      // for(var key of formData.entries())
                      // {
                      //     console.log(`${key}`);
                      // }

                      updateAPI(formData).then((res) => {
                        if (res.statusCode == 200) {
                          // alert('????????? ?????????????????????.');
                          // Router.push('/study/' + inputValue.studyId);
                          Swal.fire({
                            title: '???????????? ?????????????????????.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                          }).then(() => {
                            Router.push('/study/' + inputValue.studyId);
                          });
                        } else {
                          // alert(`${res.message}`);
                          Swal.fire({
                            icon: 'error',
                            title: res.message,
                            confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                          });
                        }
                      });
                    },
                  });
                }
              }}
            >
              ????????????
            </Button>
          </div>
        </CusPaper>
      </Layout>
    </LocalizationProvider>
  );
}

export default React.memo(studyUpdate);
