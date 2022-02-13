import React, { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import styled from '@emotion/styled';
import styles from '../../styles/Board.module.css';

import { updateBoard } from '../api/board';

import Router from 'next/router';

//게시글 수정 페이지
function BoardUpdate() {
  const detail = useSelector(({ board }) => board.boardDetail);

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
    boardId: detail.boardId,
    // tag: detail.tag,
  });

  const [formData, changeFormData] = useState(new FormData());
  const [files, setFiles] = useState('');

  const changeHandle = (value, name) => {
    inputValue[name] = value;
  };
  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  useEffect(() => {
    preview();
  });

  const preview = () => {
    setUserId(sessionStorage.getItem('userId'));
    setNickname(sessionStorage.getItem('nickname'));

    let fileName;
    if (!files) return false;

    const fileEl = document.querySelector('#file_box');
    const reader = new FileReader();

    reader.onload = () => {
      fileName = files.name;
      fileEl.innerText = fileName;
    };
    reader.readAsDataURL(files);
  };

  function validateCheck() {
    let [check, msg] = [true, ''];

    if (typeof inputValue.title == 'undefined')
      inputValue['title'] = detail.title;
    else if (inputValue.title == '')
      [check, msg] = [false, '게시물 제목을 입력해주세요.'];
    if (typeof inputValue.content == 'undefined')
      inputValue['content'] = detail.content;
    else if (inputValue.content == '')
      [check, msg] = [false, '게시물 내용을 입력해주세요.'];

    if (!check) alert(msg);
    return check;
  }

  return (
    <Layout>
      <h1>Board Update</h1>
      <CusPaper>
        {nickname == 'admin' ? (
          <TextField
            className={styles.boardRegistTag}
            id="filled-select-currency"
            select
            label="태그"
            defaultValue={detail.tag}
            value={inputValue.tag}
            onChange={(e) => changeHandle(e.target.value, 'tag')}
          >
            {adminCurrencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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
            defaultValue={detail.tag}
            value={inputValue.tag}
            onChange={(e) => changeHandle(e.target.value, 'tag')}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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
          defaultValue={detail.title}
          value={inputValue.title}
        />

        <TextField
          id="outlined-textarea"
          name="content"
          label="게시글 내용"
          placeholder="게시글 내용"
          fullWidth
          rows={20}
          multiline
          defaultValue={detail.content}
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

                // for(var key of formData.entries())
                // {
                //     console.log(`${key}`);
                // }
                formData.append('file', files);

                updateBoard(formData).then((res) => {
                  if (res.statusCode === 200) {
                    alert('게시물이 수정되었습니다.');
                    Router.push('/board/' + detail.boardId);
                  } else {
                    alert(`${res.message}`);
                  }
                });
              }
            }}
          >
            수정하기
          </Button>
        </div>
      </CusPaper>
    </Layout>
  );
}

export default BoardUpdate;
