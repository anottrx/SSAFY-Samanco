import React from 'react';
import { useState, useRef, useEffect } from 'react';

import Layout from '../../components/Layout';
import DatePicker from '../../components/Common/DatePicker';
import StackSelect from '../../components/Common/Stack/StackSelect';
import Counter from '../../components/Common/PositionSelect';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import Swal from 'sweetalert2';

import styled from '@emotion/styled';

import { registAPI } from '../api/project';
import Router from 'next/router';
import Head from 'next/head';

const position = [
  { name: 'Frontend', count: 0 },
  { name: 'Backend', count: 0 },
  { name: 'Embedded', count: 0 },
  { name: 'Mobile', count: 0 },
];

function ProjectRegist() {
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
  const DatePickerWrapper = styled.div`
    display: flex;
    & > div {
      flex: 1;
      margin: 10px 5px;
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
    // ???????????? X
  };

  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;
    inputValue['hostPosition'] = name;
  };

  function validateCheck() {
    let [check, msg] = [true, ''];
    if (typeof inputValue.title == 'undefined')
      [check, msg] = [false, '???????????? ????????? ??????????????????.'];
    else if (
      typeof inputValue.stacks == 'undefined' ||
      inputValue.stacks.length == 0
    )
      [check, msg] = [false, '???????????? ????????? ????????? ?????? ??????????????????.'];
    else if (typeof inputValue.hostPosition == 'undefined')
      [check, msg] = [false, '????????? ???????????? ??????????????????.'];
    else if (
      inputValue.totalFrontendSize +
        inputValue.totalBackendSize +
        inputValue.totalEmbeddedSize +
        inputValue.totalMobileSize <=
      1
    )
      [check, msg] = [false, '????????? ??? ????????? ???????????? ?????????.'];

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
          <title>???????????? ?????? | ???????????????</title>
        </Head>
        <h1 style={{ marginTop: '20px' }}>???????????? ??????</h1>
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
            id="projectImg"
            accept="image/*"
            name="file"
            encType="multipart/form-data"
            onChange={onImgChange}
          ></input>

          <TextField
            required
            fullWidth
            name="title"
            label="???????????? ??????"
            onChange={(e) => changeHandle(e.target.value, 'title')}
            value={inputValue.title}
          />
          <TextField
            id="outlined-textarea"
            name="description"
            label="???????????? ??????"
            placeholder="???????????? ??????"
            fullWidth
            rows={4}
            multiline
            onChange={(e) => changeHandle(e.target.value, 'description')}
            value={inputValue.description}
          />

          <StackSelect
            changeHandle={changeHandle}
            label="???????????? ?????? *"
          ></StackSelect>

          <DatePickerWrapper>
            <DatePicker changeHandle={changeHandle} label="?????? ??????" />
            <DatePicker changeHandle={changeHandle} label="?????? ??????" />
          </DatePickerWrapper>

          {/* ?????? ????????? ?????? */}
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={position.map((stack) => stack.name)}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField {...params} label="?????? ????????? *" />
            )}
          />

          <Counter changeHandle={changeHandle}></Counter>

          <div className="registBtn">
            <Button
              variant="outlined"
              onClick={() => {
                if (validateCheck()) {
                  const formData = new FormData();
                  Swal.fire({
                    title: '???????????? ?????? ????????????',
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

                      registAPI(formData).then((res) => {
                        if (res.statusCode == 200) {
                          // alert('??????????????? ?????????????????????.');
                          // Router.push('/project');
                          Swal.fire({
                            title: '??????????????? ?????????????????????.',
                            text: '???????????? ???????????? ???????????????',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 500,
                          }).then(() => {
                            Router.push('/project');
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

export default React.memo(ProjectRegist);
