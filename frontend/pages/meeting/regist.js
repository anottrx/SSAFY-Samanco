import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import * as meetingActions from '../../store/module/meeting';

import {
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import styled from '@emotion/styled';

import { registAPI, joinRoomAPI, getRoomById } from '../api/meeting';

function MeetingRegist() {
  const projectDetail = useSelector(({ project }) => project.projectDetail);
  const studyDetail = useSelector(({ study }) => study.studyDetail);
  const boardDetail = useSelector(({ board }) => board.boardDetail);

  let { tag } = useRouter().query;
  let tagId;
  if (tag === 'project') {
    tagId = projectDetail.id;
  } else if (tag === 'study') {
    tagId = studyDetail.id;
  } else if (tag === 'board') {
    tagId = boardDetail.boardId;
  }

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

    & .privateCheckBox {
      margin-left: 0px;
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

  const MeetingRegistTagField = styled(TextField)`
    width: 300px;
  `;
  const MeetingRegistTagMenu = styled(MenuItem)`
    width: 300px;
  `;

  const currencies = [
    {
      value: 'project',
      label: '프로젝트',
    },
    {
      value: 'study',
      label: '스터디',
    },
    {
      value: 'board',
      label: '게시판',
    },
  ];

  let userId;
  useEffect(() => {
    // userId = sessionStorage.getItem('userId');
  }, []);

  const [inputValue, setInputValue] = useState({
    hostId: sessionStorage.getItem('userId'),
    isSecret: 0,
  });

  const [files, setFiles] = useState('');

  const [privateCheck, setprivateCheck] = useState(false);

  const privateCheckHandle = (event) => {
    setprivateCheck(event.target.checked);
    if (event.target.checked) {
      inputValue.isSecret = 1;
    } else {
      inputValue.isSecret = 0;
    }
  };

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  useEffect(() => {
    // preview();
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
    // if (typeof inputValue.tag == 'undefined')
    // [check, msg] = [false, '태그를 선택해주세요'];
    if (typeof inputValue.title == 'undefined')
      [check, msg] = [false, '미팅룸 이름을 입력해주세요.'];
    // else if (typeof inputValue.size == 'undefined' || inputValue.size == 0)
    // [check, msg] = [false, '미팅룸 인원은 한 명 이상이여야 합니다.'];
    else if (
      privateCheck &&
      (typeof inputValue.password == 'undefined' || inputValue.password == '')
    )
      [check, msg] = [false, '비밀번호를 입력해주세요.'];
    else if (
      privateCheck &&
      (typeof inputValue.passwordConfirm == 'undefined' ||
        inputValue.password != inputValue.passwordConfirm)
    )
      [check, msg] = [false, '입력된 비밀번호가 일치하지 않습니다.'];

    if (!check) alert(msg);
    return check;
  }

  const dispatch = useDispatch();
  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(meetingActions.setMeetingDetail({ detail }));
    },
    [dispatch]
  );

  return (
    <Layout>
      <h1 style={{ marginTop: '20px' }}>미팅룸 등록</h1>
      <CusPaper>
        {/* <ImgUploadBtn
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

        <MeetingRegistTagField
          className={styled.meetingRegistTag}
          id="filled-select-currency"
          select
          label="태그"
          defaultValue=""
          onChange={(e) => changeHandle(e.target.value, 'tag')}
        >
          {currencies.map((option, index) => (
            <MeetingRegistTagMenu key={index} value={option.value}>
              {option.label}
            </MeetingRegistTagMenu>
          ))}
        </MeetingRegistTagField> */}

        <TextField
          fullWidth
          name="title"
          label="미팅룸 이름"
          onChange={(e) => changeHandle(e.target.value, 'title')}
          value={inputValue.title}
        />

        {/* <TextField
          fullWidth
          name="size"
          label="미팅룸 인원"
          onChange={(e) => changeHandle(e.target.value, 'size')}
          value={inputValue.size}
        /> */}

        <FormControlLabel
          control={
            <Checkbox
              checked={privateCheck}
              onChange={privateCheckHandle}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label="비밀방으로 생성하기"
          className="privateCheckBox"
        ></FormControlLabel>

        {privateCheck ? (
          <>
            <TextField
              fullWidth
              name="password"
              label="비밀번호"
              onChange={(e) => changeHandle(e.target.value, 'password')}
              value={inputValue.password}
            />
            <TextField
              fullWidth
              name="passwordConfirm"
              label="비밀번호 확인"
              onChange={(e) => changeHandle(e.target.value, 'passwordConfirm')}
              value={inputValue.passwordConfirm}
            />
          </>
        ) : null}

        <div className="registBtn">
          <Button
            variant="outlined"
            onClick={() => {
              if (validateCheck()) {
                // const formData = new FormData();

                // Object.keys(inputValue).map((key) => {
                //   let value = inputValue[key];
                //   formData.append(key, JSON.stringify(value));
                // });

                if (tag !== undefined) {
                  // formData.append('tag', tag);
                  // formData.append('tagId', tagId);
                  inputValue.tag = tag;
                  inputValue.tagId = tagId;
                } else {
                  inputValue.tag = '';
                  inputValue.tagId = '';
                }

                console.log(inputValue);
                let roomId;
                registAPI(inputValue).then((res) => {
                  if (res.statusCode == 200) {
                    roomId = res.room.roomId;
                    alert(
                      '미팅룸이 생성되었습니다. 해당 방으로 이동합니다. 카메라와 마이크 세팅을 준비해주세요.'
                    );

                    inputValue.roomId = roomId;
                    inputValue.userId = inputValue.hostId;
                    joinRoomAPI(inputValue).then((res) => {
                      // 방장도 미팅룸 가입
                      if (res.statusCode == 200) {
                        getRoomById(roomId).then((res) => {
                          if (res.statusCode == 200) {
                            Router.push('/meeting/' + roomId);
                            setDetail({
                              detail: res.room,
                            });
                          } else {
                            alert(`${res.message}`);
                          }
                        });
                      } else {
                        alert(`${res.message}`);
                      }
                    });
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

export default MeetingRegist;
