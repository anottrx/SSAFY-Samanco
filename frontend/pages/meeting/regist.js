import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import * as meetingActions from '../../store/module/meeting';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Swal from 'sweetalert2';

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

  const [inputValue, setInputValue] = useState({
    hostId: sessionStorage.getItem('userId'),
    isSecret: 0,
  });

  const [privateCheck, setprivateCheck] = useState(false);

  const privateCheckHandle = (event) => {
    setprivateCheck(event.target.checked);
    if (event.target.checked) {
      inputValue.isSecret = 1;
    } else {
      inputValue.isSecret = 0;
    }
  };

  const changeHandle = (value, name) => {
    inputValue[name] = value;
    // 리렌더링 X
  };

  function validateCheck() {
    let [check, msg] = [true, ''];
    if (typeof inputValue.title == 'undefined')
      [check, msg] = [false, '미팅룸 이름을 입력해주세요.'];
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

    if (!check) {
      // alert(msg);
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
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
      <Head>
        <title>미팅룸 등록 | 싸피사만코</title>
      </Head>
      <h1 style={{ marginTop: '20px' }}>미팅룸 등록</h1>
      <CusPaper>
        <TextField
          fullWidth
          name="title"
          label="미팅룸 이름"
          onChange={(e) => changeHandle(e.target.value, 'title')}
          value={inputValue.title}
        />

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
                if (tag !== undefined) {
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
                    // alert(
                    //   '미팅룸이 생성되었습니다. 해당 방으로 이동합니다. 카메라와 마이크 세팅을 준비해주세요.'
                    // );
                    Swal.fire({
                      title:
                        '미팅룸이 생성되었습니다. 해당 방으로 이동합니다. 카메라와 마이크 세팅을 준비해주세요.',
                      icon: 'success',
                      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                    }).then(() => {
                      inputValue.roomId = roomId;
                      inputValue.userId = inputValue.hostId;

                      Swal.fire({
                        title: '미팅룸으로 이동 중입니다',
                        showConfirmButton: false,
                        didOpen: () => {
                          Swal.showLoading();
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
                                  // alert(`${res.message}`);
                                  Swal.fire({
                                    icon: 'error',
                                    title: res.message,
                                    confirmButtonText:
                                      '&nbsp&nbsp확인&nbsp&nbsp',
                                  });
                                }
                              });
                            } else {
                              // alert(`${res.message}`);
                              Swal.fire({
                                icon: 'error',
                                title: res.message,
                                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                              });
                            }
                          });
                        },
                      });
                    });
                  } else {
                    // alert(`${res.message}`);
                    Swal.fire({
                      icon: 'error',
                      title: res.message,
                      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                    });
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
