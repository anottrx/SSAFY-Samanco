import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';

import styled from '@emotion/styled';
import StackList from '../../components/Club/StackList';

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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

import { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import * as studyActions from '../../store/module/study';
import {
  deleteAPI,
  updateStudyLike,
  joinStudyAPI,
  getStudyById,
  joinCancelStudy,
  getUserAtStudy,
  changeStudyHost,
  quitStudy,
  studyImageDownload,
} from '../api/study';
import { joinRoomAPI, getRoomById } from '../api/meeting';
import * as meetingActions from '../../store/module/meeting';

const StudyDetail = () => {
  const detail = useSelector(({ study }) => study.studyDetail);
  const roomDetail = useSelector(({ meeting }) => meeting.meetingDetail);
  const userData = useSelector(({ study }) => study.userList);
  const [reloadCondition, setReloadCondition] = useState(false);
  const [like, changeLike] = useState(detail.userLike);
  const [detailLikes, setLikes] = useState(detail.likes);
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
    studyImageDownload(file).then((res) => {
      //console.log(res);
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        //console.log(res.data);
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
      }
    });
  }

  function fetchData(addHit) {
    // function fetchData() {
    getUserAtStudy({
      studyId: detail.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(studyActions.setUserList({ list: res.users }));
      })
      .catch((err) => console.log(err));

    getStudyById({
      studyId: detail.id,
      userId:
        sessionStorage.getItem('userId') == null
          ? 0
          : sessionStorage.getItem('userId'),
      addHit: addHit,
    }).then((res) => {
      changeLike(res.study?.userLike);
      dispatch(studyActions.setStudyDetail({ detail: res.study }));
    });
  }

  // useEffect(() => {
  //   fetchData();
  // }, [like]);

  useEffect(() => {
    if (!detail.userLike) {
      // 유저가 좋아요를 안누른 상태이면
      if (like) {
        // 버튼 눌렀을 때 == 좋아요
        setLikes(detail.likes + 1);
      } else {
        setLikes(detail.likes);
      }
    } else {
      // 유저가 좋아요를 누른 상태면
      if (like) {
        // 버튼 눌렀을 때 == 좋아요 취소
        setLikes(detail.likes);
      } else {
        setLikes(detail.likes - 1);
      }
    }
  }, [like]);

  useEffect(() => {
    fetchData('0');
  }, []);

  useEffect(() => {
    if (detail && detail.file) changeToBlob(detail.file);
  }, [detail]);

  useEffect(() => {
    if (reloadCondition) {
      // fetchData();
      fetchData('0');
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  const DetailWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  `;

  const ImageWrapper = styled.div`
    margin-right: 30px;
    margin-bottom: 10px;
    min-width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
  `;

  const CusSkeleton = styled(Skeleton)`
    min-width: 300px;
    min-height: 200px;
    height: auto;
    width: 100%;
  `;

  const CusContainer = styled(Container)`
    float: left;
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
        <title>스터디 상세보기 | 싸피사만코</title>
      </Head>
      <CusContainer maxWidth="md">
        <br></br>
        <DetailHeader>
          <h2>{detail.title}</h2>
          {sessionStorage.getItem('userId') == detail.hostId ? (
            <DetailOperation detail={detail} pwDialogOpen={pwDialogOpen} />
          ) : null}
        </DetailHeader>
        <DetailWrapper maxWidth="sm">
          {detail.collectStatus === 'ING' ? (
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
          <StudyInfo detail={detail}></StudyInfo>
        </DetailWrapper>
        <StudyDetail></StudyDetail>
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
        <ButtonGroup variant="outlined">
          {sessionStorage.getItem('userId') == detail.hostId ? (
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
                  Router.push('/study/update');
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
                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
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
                {userData && userData !== null
                  ? userData.map((user) => {
                      return user.id !== detail.hostId ? (
                        <FormControlLabel
                          value={user.id}
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
                let newHostId = nextHost;
                changeStudyHost({
                  studyId: detail.id,
                  oldHostId: detail.hostId,
                  newHostId: newHostId,
                }).then((res) => {
                  if (res.statusCode == 200) {
                    alert('방장이 변경되었습니다.');
                    quitStudy({
                      userId: detail.hostId,
                      studyId: detail.id,
                    });
                    Router.push('/study');
                  } else {
                    // alert(`${res.message}`);
                    Swal.fire({
                      icon: 'error',
                      title: res.message,
                      confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                    });
                  }
                  // 페이지 새로고침
                  setReloadCondition(true);
                });
              }}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>

        {/* 탈퇴 다이얼로그 */}
        <Dialog open={openQuit} onClose={QuitDialogClose}>
          <DialogTitle>{'스터디를 탈퇴 하시겠습니까?'}</DialogTitle>
          <DialogContent>
            {
              // 방장일 경우 방장 넘기기
              sessionStorage.getItem('userId') == detail.hostId ? (
                <DialogContentText>
                  스터디를 삭제하거나 방장 권한을 넘길 수 있습니다.<br></br>
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
                        label="스터디 삭제"
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

                if (sessionStorage.getItem('userId') == detail.hostId) {
                  if (hostAssign === null) {
                    alert('스터디 삭제 또는 방장 권한 넘기기를 선택해주세요.');
                  }
                  if (hostAssign === 'quit') {
                    if (userData.length == 1) {
                      alert('팀원이 존재하지 않습니다.');
                    } else UserDialogOpen();
                    // 방장 권한 넘기기
                  } else if (hostAssign === 'delete') {
                    deleteAPI({
                      id: detail.id,
                      hostId: sessionStorage.getItem('userId'),
                    }).then((res) => {
                      if (res.statusCode === 200) {
                        alert('스터디가 삭제 되었습니다.');
                        Router.push('/study');
                      } else {
                        // alert(`${res.message}`);
                        Swal.fire({
                          icon: 'error',
                          title: res.message,
                          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                        });
                      }
                    });
                    // 프로젝트 삭제
                  }
                } else {
                  // 방장이 아닐 때
                  quitStudy({
                    userId: sessionStorage.getItem('userId'),
                    studyId: detail.id,
                  }).then((res) => {
                    if (res.statusCode === 200) {
                      alert('스터디가 탈퇴 되었습니다.');
                      Router.push('/study');
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
              autoFocus
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function StudyInfo() {
    return (
      <ContentWrapper>
        <div>스터디 주제</div>
        <StackList stackData={detail.stacks}></StackList>
        <br />
      </ContentWrapper>
    );
  }

  function StudyDetail() {
    const CusCard = styled(Card)`
      margin-top: 10px;
    `;

    return (
      <CusCard sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} variant="body1">
            {detail.description.split('\n').map((line, index) => {
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
          <DetailFooter detail={detail}></DetailFooter>
        </CardContent>
        <DetailAction detail={detail}></DetailAction>
      </CusCard>
    );
  }

  function DetailFooter(props) {
    const FooterWrapper = styled.div`
      display: flex;
      flex-direction: row;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin: 10px;
      }
    `;
    let detail = props.detail;

    return (
      <FooterWrapper>
        <div>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            예정 스케쥴
          </Typography>

          <Typography sx={{ mb: 1.5 }}>{detail.schedule}</Typography>
        </div>
      </FooterWrapper>
    );
  }

  function DetailAction(props) {
    let detail = props.detail;
    const ActionWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20px;
      & > div,
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
      }

      & span {
        margin: 0px 5px;
      }
    `;
    const [open, setOpen] = useState(false);
    const [joinCancel, setJoinCalcel] = useState(false);

    const JoinDialogOpen = () => {
      if (sessionStorage.getItem('userId')) setOpen(true);
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
    const JoinDialogClose = () => {
      setOpen(false);
    };

    const JoinCancelDialogOpen = () => {
      setJoinCalcel(true);
    };
    const JoinCancelDialogClose = () => {
      setJoinCalcel(false);
    };

    return (
      <ActionWrapper>
        <ButtonGroup variant="outlined" aria-label="text button group">
          <Button style={{ pointerEvents: 'none' }}>
            <VisibilityIcon />
            <span>{detail.hit}</span>
          </Button>
          <Button
            onClick={() => {
              if (sessionStorage.getItem('userId')) {
                changeLike(!like);
                updateStudyLike({
                  tag: 'STUDY',
                  studyId: detail.id, // 스터디 아이디
                  userId: sessionStorage.getItem('userId'),
                }).then((res) => console.log(res));
              } else {
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
            }}
            variant={like ? 'contained' : 'outlined'}
          >
            {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            {/* <span>{detail.likes}</span> */}
            <span>{detailLikes}</span>
          </Button>
        </ButtonGroup>
        <>
          <div>
            {
              // 글 작성한 사람 === 현재 로그인 한 사람 => 지원자 목록
              sessionStorage.getItem('userId') == detail.hostId ? (
                <Button
                  variant="outlined"
                  onClick={() => {
                    Router.push('/study/applylist');
                  }}
                >
                  지원자 목록 조회
                </Button>
              ) : null
            }
            {
              // 모집중 일때, 지원을 안했거나, 취소한 상태이면 지원하기 버튼 표시
              (detail.collectStatus === 'ING' &&
                detail.studyJoinStatus == null) ||
              detail.studyJoinStatus == 'CANCEL' ? (
                <Button variant="outlined" onClick={JoinDialogOpen}>
                  지원하기
                </Button>
              ) : null
            }
            {
              // 지원한 상태이면 지원 취소 표시
              detail.collectStatus === 'ING' &&
              detail.studyJoinStatus == 'BEFORE' ? (
                <Button variant="outlined" onClick={JoinCancelDialogOpen}>
                  지원취소
                </Button>
              ) : null
            }
          </div>
          <Dialog open={open} onClose={JoinDialogClose}>
            <DialogTitle>{'지원 하시겠습니까?'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                마이페이지에 기입된 정보가 전달됩니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={JoinDialogClose}>취소</Button>
              <Button
                onClick={() => {
                  JoinDialogClose();
                  joinStudyAPI({
                    studyId: detail.id,
                    userId: sessionStorage.getItem('userId'),
                  })
                    .then((res) => {
                      if (res.statusCode === 200) {
                        alert('스터디 지원 신청이 되었습니다.');
                      } else {
                        // alert(`${res.message}`);
                        Swal.fire({
                          icon: 'error',
                          title: res.message,
                          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                  setReloadCondition(true);
                }}
                autoFocus
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={joinCancel} onClose={JoinCancelDialogClose}>
            <DialogTitle>{'지원 취소 하시겠습니까?'}</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button onClick={JoinCancelDialogClose}>아니요</Button>
              <Button
                onClick={() => {
                  JoinCancelDialogClose();
                  joinCancelStudy({
                    studyId: detail.id,
                    userId: sessionStorage.getItem('userId'),
                  })
                    .then((res) => {
                      if (res.statusCode === 200) {
                        alert('스터디 지원 취소가 되었습니다.');
                      } else {
                        // alert(`${res.message}`);
                        Swal.fire({
                          icon: 'error',
                          title: res.message,
                          confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                  setReloadCondition(true);
                }}
                autoFocus
              >
                예
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </ActionWrapper>
    );
  }
};

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
                  joinRoomAPI(inputValue).then((res) => {
                    if (res.statusCode == 200) {
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
                }
              : () => {
                  // alert('비밀번호를 확인해주세요.');
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

export default StudyDetail;
