import styled from '@emotion/styled';
import Layout from '../../components/Layout';
import StackList from '../../components/Club/StackList';
import PositionList from '../../components/Club/PositionList';
import UserCard from '../../components/Common/UserCard';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

import {
  deleteAPI,
  getUserAtProject,
  changeProjectHost,
  getProjectByUserId,
  quitProject,
  projectImageDownload,
} from '../../pages/api/project';
import { joinRoomAPI, getRoomById } from '../api/meeting';
import * as projectActions from '../../store/module/project';
import * as meetingActions from '../../store/module/meeting';

import Router from 'next/router';
import Head from 'next/head';

function ProjectInfo() {
  let clubData = useSelector(({ project }) => project.projectDetail);
  const userData = useSelector(({ project }) => project.userList);
  const roomDetail = useSelector(({ meeting }) => meeting.meetingDetail);
  const [reloadCondition, setReloadCondition] = useState(false);
  let [imageUrl, setImageUrl] = useState(undefined);
  const [openPw, setOpenPw] = useState(false);

  const pwDialogOpen = () => {
    setOpenPw(true);
  };
  const pwDialogClose = () => {
    setOpenPw(false);
  };
  const dispatch = useDispatch();

  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(meetingActions.setMeetingDetail({ detail }));
    },
    [dispatch]
  );

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
      setImageUrl(url);
    }
  }

  function changeToBlob(file) {
    projectImageDownload(file).then((res) => {
      //console.log(res);
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        //console.log(res.data);
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        // console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
      }
    });
  }

  function fetchData() {
    getUserAtProject({
      projectId: clubData.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(projectActions.setUserList({ list: res.users }));
      })
      .catch((err) => console.log(err));

    getProjectByUserId(parseInt(sessionStorage.getItem('userId'))).then(
      (res) => {
        dispatch(projectActions.setMyProject({ project: res.project }));
        dispatch(projectActions.setProjectDetail({ detail: res.project }));
      }
    );
  }

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (clubData && clubData.file) changeToBlob(clubData.file);
  }, [clubData]);

  useEffect(() => {
    if (reloadCondition) {
      fetchData();
      setReloadCondition(false);
    }
  });

  const CusContainer = styled(Container)`
    float: left;
    margin-bottom: 50px;
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 30px;
    flex: 1;
  `;

  const DetailWrapper = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const ImageWrapper = styled.div`
    margin-right: 30px;
    margin-bottom: 10px;
    min-width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const CusSkeleton = styled(Skeleton)`
    display: flex;
    flex: 1;
    min-width: 200px;
    min-height: 200px;
    height: auto;
  `;

  const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px;
    & > h2 {
      margin: 0;
    }
    & > div {
      height: fit-content;
    }
  `;

  const EndImage = styled.img`
    width: 100px;
    height: 100px;
    // margin-right: auto;
    // transform: translate(-90%, 10%);
    position: absolute;
  `;

  return (
    <Layout>
      <Head>
        <title>내 프로젝트 | 싸피사만코</title>
      </Head>
      <CusContainer maxWidth="md">
        <br></br>
        <DetailHeader>
          <DetailOperation
            detail={clubData}
            pwDialogOpen={pwDialogOpen}
          ></DetailOperation>
        </DetailHeader>
        <h2>{clubData.title}</h2>
        <DetailWrapper maxWidth="sm">
          {clubData.collectStatus === 'ING' ? (
            <ImageWrapper>
              {imageUrl ? (
                <img src={imageUrl} height={200}></img>
              ) : (
                <CusSkeleton variant="rectangular" animation={false} />
              )}
            </ImageWrapper>
          ) : (
            <ImageWrapper>
              <EndImage src="/images/apply_end.png"></EndImage>
              {imageUrl ? (
                <img src={imageUrl} height={200}></img>
              ) : (
                <CusSkeleton variant="rectangular" animation={false} />
              )}
            </ImageWrapper>
          )}
          <ProjectInfo detail={clubData}></ProjectInfo>
        </DetailWrapper>
        <ProjectDetail></ProjectDetail>
        <PwDialog
          open={openPw}
          pwDialogClose={pwDialogClose}
          room={roomDetail}
          setDetail={setDetail}
        ></PwDialog>
      </CusContainer>
    </Layout>
  );

  function DetailOperation({ detail, pwDialogOpen }) {
    const [openQuit, setOpenQuit] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);

    const QuitDialogOpen = () => {
      if (sessionStorage.getItem('userId')) setOpenQuit(true);
      else {
        // alert('로그인이 필요한 작업입니다.');
        // Router.push('/login');
        Swal.fire({
          title: '로그인이 필요한 작업입니다.',
          text: '로그인 페이지로 이동합니다.',
          icon: 'warning',
          showConfirmButton: false,
          timer: 800,
        }).then(() => {
          Router.push('/login');
        });
      }
    };
    const QuitDialogClose = () => {
      setOpenQuit(false);
    };

    const UserDialogOpen = () => {
      setOpenUsers(true);
    };
    const UserDialogClose = () => {
      setOpenUsers(false);
    };

    const [hostAssign, setHostAssign] = useState(null);
    const [nextHost, setNextHost] = useState(null);

    const [inputValue, setInputValue] = useState({
      password: '', // 비밀번호 없는 방
      roomId: '',
      userId: sessionStorage.getItem('userId'),
    });

    return (
      <>
        {sessionStorage.getItem('userId') == detail.hostId ? (
          <Button
            variant="outlined"
            onClick={() => {
              Router.push('/project/applylist');
            }}
          >
            지원자 목록 조회
          </Button>
        ) : (
          <div></div>
        )}
        <ButtonGroup variant="outlined">
          {sessionStorage.getItem('userId') == clubData.hostId ? (
            <>
              {detail.canRegister ? (
                <Button
                  onClick={() => {
                    Router.push({
                      pathname: '/meeting/regist',
                      query: { tag: 'project' },
                    });
                  }}
                >
                  방 생성
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  Router.push('/project/update');
                }}
              >
                수정
              </Button>
            </>
          ) : null}
          {sessionStorage.getItem('userId') != detail.hostId &&
          detail.canJoin &&
          detail.roomId != 0 ? (
            <Button
              onClick={() => {
                inputValue.roomId = detail.roomId;
                getRoomById(detail.roomId).then((res) => {
                  if (res.statusCode == 200) {
                    let roomData = res.room;

                    setDetail({
                      detail: roomData,
                    });

                    if (roomData.isSecret) {
                      // 비밀방이면
                      pwDialogOpen();
                    } else {
                      // 비밀방 아니면 바로 입장
                      Swal.fire({
                        title: '방으로 이동 중입니다',
                        showConfirmButton: false,
                        didOpen: () => {
                          Swal.showLoading();

                          joinRoomAPI(inputValue).then((res) => {
                            if (res.statusCode == 200) {
                              Swal.fire({
                                title: '방으로 이동합니다',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 500,
                              });
                              Router.push('/meeting/' + detail.roomId);
                            } else {
                              // 방 입장 실패
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
                    }
                  } else {
                    // 방 조회 실패 시
                    // alert(`${res.message}`);
                    Swal.fire({
                      icon: 'error',
                      title: res.message,
                      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                    });
                  }
                });
              }}
            >
              방 참가
            </Button>
          ) : null}
          <Button onClick={QuitDialogOpen}>탈퇴</Button>
        </ButtonGroup>

        <Dialog open={openUsers} onClose={UserDialogClose}>
          <DialogTitle>{'방장 권한을 넘길 유저를 선택해주세요.'}</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                name="newHost"
                onChange={(e) => {
                  e.persist();
                  setNextHost(e.target.value);
                }}
              >
                {userData
                  ? userData.map((user) => {
                      return user.id !== clubData.hostId ? (
                        <FormControlLabel
                          value={user.id + ',' + user.projectPosition}
                          control={<Radio />}
                          label={user.nickname}
                        />
                      ) : null;
                    })
                  : null}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={UserDialogClose}>취소</Button>
            <Button
              onClick={() => {
                UserDialogClose();
                let [newHostId, newHostPosition] = nextHost.split(',');
                Swal.fire({
                  title: '방장 변경 중입니다',
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                    changeProjectHost({
                      projectId: clubData.id,
                      oldHostId: clubData.hostId,
                      newHostId: newHostId,
                      newHostPosition: newHostPosition,
                    }).then((res) => {
                      if (res.statusCode == 200) {
                        // alert('방장이 변경되었습니다.');
                        Swal.fire({
                          title: '방장이 변경되었습니다.',
                          text: '프로젝트 목록으로 이동합니다',
                          icon: 'success',
                          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                        }).then(() => {
                          quitProject({
                            userId: clubData.hostId,
                            projectId: clubData.id,
                          });
                          Router.push('/project');
                        });
                      } else {
                        // alert(`${res.message}`);
                        Swal.fire({
                          icon: 'error',
                          title: res.message,
                          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                        });
                      }
                      // 페이지 새로고침
                    });
                  },
                });
              }}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>

        {/* 탈퇴 다이얼로그 */}
        <Dialog open={openQuit} onClose={QuitDialogClose}>
          <DialogTitle>{'프로젝트를 탈퇴 하시겠습니까?'}</DialogTitle>
          <DialogContent>
            {
              // 방장일 경우 방장 넘기기
              sessionStorage.getItem('userId') == detail.hostId ? (
                <DialogContentText>
                  프로젝트를 삭제하거나 방장 권한을 넘길 수 있습니다.<br></br>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={hostAssign}
                      onChange={(e) => {
                        setHostAssign(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="quit"
                        control={<Radio />}
                        label="방장 권한 넘기기"
                      />
                      <FormControlLabel
                        value="delete"
                        control={<Radio />}
                        label="프로젝트 삭제"
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContentText>
              ) : null
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={QuitDialogClose}>취소</Button>
            <Button
              onClick={() => {
                QuitDialogClose();
                // 방장일 때
                if (sessionStorage.getItem('userId') == detail.hostId) {
                  if (hostAssign === null) {
                    // alert(
                    //   '프로젝트 삭제 또는 방장 권한 넘기기를 선택해주세요.'
                    // );

                    Swal.fire({
                      icon: 'warning',
                      title:
                        '프로젝트 삭제 또는 방장 권한 넘기기를 선택해주세요.',
                      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                    });
                  } else if (hostAssign === 'quit') {
                    if (clubData.positions[9].size == 1) {
                      // alert('팀원이 존재하지 않습니다.');
                      Swal.fire({
                        icon: 'error',
                        title: '팀원이 존재하지 않습니다.',
                        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                      });
                    } else UserDialogOpen();
                    // 방장 권한 넘기기
                  } else if (hostAssign === 'delete') {
                    Swal.fire({
                      title: '프로젝트 삭제 중입니다',
                      showConfirmButton: false,
                      didOpen: () => {
                        Swal.showLoading();
                        deleteAPI({
                          id: clubData.id,
                          hostId: sessionStorage.getItem('userId'),
                        }).then((res) => {
                          if (res.statusCode === 200) {
                            // alert('프로젝트가 삭제 되었습니다.');
                            // Router.push('/project');
                            Swal.fire({
                              title: '프로젝트가 삭제 되었습니다.',
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
                              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                            });
                          }
                        });
                      },
                    });
                    // 프로젝트 삭제
                  }
                } else {
                  // 방장이 아닐 때
                  Swal.fire({
                    title: '프로젝트 탈퇴 중입니다',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      quitProject({
                        userId: sessionStorage.getItem('userId'),
                        projectId: clubData.id,
                      }).then((res) => {
                        if (res.statusCode === 200) {
                          // alert('프로젝트가 탈퇴 되었습니다.');
                          // Router.push('/project');
                          Swal.fire({
                            title: '프로젝트가 탈퇴 되었습니다.',
                            text: '프로젝트 목록으로 이동합니다',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                          }).then(() => {
                            Router.push('/project');
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
                }
              }}
              autoFocus
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function ProjectInfo() {
    const DateWrapper = styled.div`
      display: flex;
      flex-direction: row;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    `;

    const RowWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      & > div {
        padding-bottom: 20px;
      }
    `;

    return (
      <ContentWrapper>
        <div>기술 스택</div>
        <StackList stackData={clubData.stacks}></StackList>
        <br />
        <RowWrapper>
          <div>
            <div>현재 팀원</div>
            <PositionList positionData={clubData.positions}></PositionList>
          </div>
          <DateWrapper>
            <div>
              <div>진행 기간</div>
              <Typography>
                {clubData.startDate} ~ {clubData.endDate}
              </Typography>
            </div>
          </DateWrapper>
        </RowWrapper>
      </ContentWrapper>
    );
  }

  function ProjectDetail() {
    const CusCard = styled(Card)`
      margin-top: 10px;
    `;

    return (
      <CusCard sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} variant="body1">
            {clubData.description.split('\n').map((line, index) => {
              return (
                <span key={index}>
                  {line}
                  <br />
                </span>
              );
            })}
          </Typography>
          <br />
          <Divider light />
          <br />
          <ProjectUser detail={clubData}></ProjectUser>
          <br />
        </CardContent>
      </CusCard>
    );

    function ProjectUser(props) {
      const UserWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;

        & > div {
          display: flex;
          flex-direction: column;
          margin: 10px;
        }
        & .no-user {
          font-size: 14px;
        }
        & .fill {
          display: flex;
          flex: 1;
        }
      `;

      const FollowerWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      `;

      return (
        <UserWrapper>
          <div style={{ width: 'fit-content' }}>
            <div>팀장</div>
            <div>
              {userData == null ? (
                <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>
              ) : (
                userData.map((user) => {
                  return user.id == clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      from="project"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </div>
          </div>
          <div>
            <div>팀원</div>
            <FollowerWrapper>
              {userData == null ? (
                <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>
              ) : (
                userData.map((user) => {
                  return user.id != clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      // projectId={clubData.id}
                      clubId = {clubData.id}
                      hostId={clubData.hostId}
                      from="project"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </FollowerWrapper>
          </div>
        </UserWrapper>
      );
    }
  }
}

function PwDialog(props) {
  let { open, pwDialogClose, room } = props;
  let [pw, setPw] = useState('');

  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
    password: '',
  });

  const pwChangeHandle = (e) => {
    setPw(e.target.value);
  };

  return (
    <Dialog open={open} onClose={pwDialogClose}>
      <DialogTitle>{`비밀번호를 입력해주세요.`}</DialogTitle>
      <DialogContent>
        <TextField value={pw} onChange={pwChangeHandle}></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={pwDialogClose}>취소</Button>
        <Button
          onClick={
            // 입력한 비밀번호와 일치하면 입장
            pw === room.password
              ? () => {
                  inputValue.password = pw;
                  inputValue.roomId = room.roomId;
                  Swal.fire({
                    title: '비밀번호 확인 중입니다',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
                          Swal.fire({
                            title: '미팅룸에 참여 진행 중입니다',
                            text: '참여가 완료되면 해당 방으로 이동합니다',
                            showConfirmButton: false,
                            timer: 500,
                          });
                          Router.push('/meeting/' + room.roomId);
                          pwDialogClose();
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
                }
              : () => {
                  // alert('비밀번호를 확인해주세요.');
                  pwDialogClose();
                  Swal.fire({
                    icon: 'error',
                    title: '비밀번호를 확인해주세요.',
                    confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                  });
                }
          }
          autoFocus
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectInfo;
