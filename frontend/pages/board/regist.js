import React, { useState, useRef, useEffect } from 'react';

import Layout from '../../components/Layout';

import { Paper, TextField, Box, Button, MenuItem } from '@mui/material';
import styled from '@emotion/styled';
import styles from '../../styles/Board.module.css';

import { registBoard } from '../api/board';
import Router from 'next/router';

//게시글 등록 페이지
function BoardRegist() {
  const CusPaper = styled(Paper)`
    width: 100%;
    padding: 10px;
    margin: 0 auto;

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

  const currencies = [
    {
      value: 'free',
      label: '자유게시판',
    },
    {
      value: 'qna',
      label: '질문게시판',
    },
    {
      value: 'exam',
      label: '정보공유',
    },
    {
      value: 'job',
      label: '사람구해요',
    },
  ];

  const adminCurrencies = [{ value: 'notice', label: '공지사항' }].concat(
    currencies
  );

  //파일 업로드 부분
  const FileUploadBtn = styled(Button)`
    padding: 10px;
    border: 1px dashed grey;
    width: 100%;
  `;

  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [inputValue, setInputValue] = useState({
    userId: sessionStorage.getItem('userId'),
  });

  const [formData, changeFormData] = useState(new FormData());
  const [files, setFiles] = useState('');

  const changeHandle = (value, name) => {
    inputValue[name] = value;
  };

  const onImgChange = (event) => {
    // const file = event.target.files[0];
    const file = event.target.files;
    setFiles(file);
  };

  const uploadRef = useRef(null);

  useEffect(() => {
    preview();
  });

  const preview = () => {
    setUserId(sessionStorage.getItem('userId'));
    setNickname(sessionStorage.getItem('nickname'));

    if (!files) return false;

    const fileEl = document.querySelector('#file_box');
    fileEl.innerText = '';

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      let file = files[i];
      // console.log(file);
      reader.onload = () => {
        fileEl.innerText += `[${i + 1}] ${file.name}\n`;
      };
      reader.readAsDataURL(file);
    }
  };

  function validateCheck() {
    let [check, msg] = [true, ''];
    if (typeof inputValue.tag == 'undefined')
      [check, msg] = [false, '태그를 선택해주세요'];
    if (typeof inputValue.title == 'undefined')
      [check, msg] = [false, '게시물 제목을 입력해주세요'];
    if (typeof inputValue.content == 'undefined')
      [check, msg] = [false, '게시물 내용을 입력해주세요.'];

    if (!check) alert(msg);
    return check;
  }

  return (
    <Layout>
      <h1>Board Regist</h1>
      <CusPaper>
        {nickname == 'admin' ? (
          <TextField
            className={styles.boardRegistTag}
            id="filled-select-currency"
            select
            label="태그"
            defaultValue=""
            onChange={(e) => changeHandle(e.target.value, 'tag')}
          >
            {adminCurrencies.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            className={styles.boardRegistTag}
            id="filled-select-currency"
            select
            label="태그"
            defaultValue=""
            onChange={(e) => changeHandle(e.target.value, 'tag')}
          >
            {currencies.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          fullWidth
          name="title"
          label="제목"
          onChange={(e) => changeHandle(e.target.value, 'title')}
          value={inputValue.title}
        />

        {/* <TextField fullWidth name="userId" label="아이디" onChange={(e) => changeHandle(e.target.value, "userId")}
                    value={inputValue.userId}/>     */}
        <TextField
          id="outlined-textarea"
          name="content"
          label="게시글 내용"
          placeholder="게시글 내용"
          fullWidth
          rows={20}
          multiline
          onChange={(e) => changeHandle(e.target.value, 'content')}
          value={inputValue.description}
        />

        {/*파일 업로드 부분*/}
        <FileUploadBtn
          id="file_box"
          onClick={(event) => {
            event.preventDefault();
            uploadRef.current.click();
          }}
        >
          파일 업로드
        </FileUploadBtn>

        <input
          ref={uploadRef}
          type="file"
          className="imgInput"
          id="projectImg"
          accept="*"
          name="file"
          multiple
          onChange={onImgChange}
        ></input>

        <div className="registBtn">
          <Button
            variant="outlined"
            onClick={() => {
              if (validateCheck()) {
                const formData = new FormData();

                Object.keys(inputValue).map((key) => {
                  let value = inputValue[key];
                  formData.append(key, value);
                });

                for (let i = 0; i < files.length; i++) {
                  formData.append('file', files[i]);
                }

                // for (var key of formData.entries()) {
                //   console.log(`${key}`);
                // }

                registBoard(formData).then((res) => {
                  if (res.statusCode === 200) {
                    alert('게시물이 작성되었습니다.');
                    Router.push('/board');
                  } else {
                    alert(`${res.message}`);
                  }
                });
              }
            }}
          >
            등록하기
          </Button>
        </div>
      </CusPaper>
    </Layout>
  );
}

export default BoardRegist;
