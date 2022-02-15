import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import * as boardActions from '../../store/module/board';
import { joinRoomAPI, getRoomById } from '../api/meeting';

import {
  getArticleById,
  deleteBoard,
  registComment,
  updateArticleLike,
  fileDownload,
} from '../api/board';
import styled from '@emotion/styled';

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';

import CommentList from '../../components/Board/CommentList';
import BoardColor from '../../data/BoardColor.json';
import * as meetingActions from '../../store/module/meeting';

//게시글 상세보기 페이지

const BoardDetail = () => {
  const router = useRouter();

  const detail = useSelector(({ board }) => board.boardDetail);
  const roomDetail = useSelector(({ meeting }) => meeting.meetingDetail);
  const tag = detail?.tag;
  const [reloadCondition, setReloadCondition] = useState(false);
  const [like, changeLike] = useState(detail.userLike);
  const [detailLikes, setLikes] = useState(detail.likes);
  const [openPw, setOpenPw] = useState(false);
  const [queryId, setQueryId] = useState(undefined);

  // const bid = router.query;

  useEffect(() => {
    if (router.query.id) {
      console.log(router.query.id);
      setQueryId(router.query.id);
    }
  });

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

  function fetchData(addHit) {
    getArticleById({
      boardId: queryId ? queryId : detail.boardId,
      userId:
        sessionStorage.getItem('userId') == null
          ? 0
          : sessionStorage.getItem('userId'),
      addHit: addHit,
    }).then((res) => {
      changeLike(res.board?.userLike);
      dispatch(boardActions.setBoardDetail({ detail: res.board }));
    });
  }

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
    if (reloadCondition) {
      fetchData('0');
      setReloadCondition(false);
    }
  }, [reloadCondition]);

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

  const CusH2 = styled(Chip)`
    margin-right: 10px;
    font-size: 15px;
    padding: 5px 0px;
    ${({ colorinfo }) => colorinfo && `background-color: #${colorinfo}`}
  `;

  return (
    <Layout>
      <Head>
        <title>게시물 상세보기 | 싸피사만코</title>
      </Head>
      <CusContainer maxWidth="md">
        <br></br>
        <DetailHeader>
          <CusH2
            colorinfo={BoardColor[tag].color}
            label={BoardColor[tag].label}
          />
          {sessionStorage.getItem('userId') &&
          sessionStorage.getItem('userId') == detail.userId ? (
            <DetailOperation />
          ) : (
            <JoinRoomOperation pwDialogOpen={pwDialogOpen} />
          )}
        </DetailHeader>
        <BoardDetail></BoardDetail>
        <PwDialog
          open={openPw}
          pwDialogClose={pwDialogClose}
          room={roomDetail}
          setDetail={setDetail}
        ></PwDialog>
      </CusContainer>
    </Layout>
  );

  function JoinRoomOperation({ pwDialogOpen }) {
    const [inputValue, setInputValue] = useState({
      password: '', // 비밀번호 없는 방
      roomId: '',
      userId: sessionStorage.getItem('userId'),
    });

    return (
      <ButtonGroup variant="outlined">
        {detail.canJoin && detail.roomId != 0 ? (
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
                      title: '해당 방으로 이동 중입니다',
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
      </ButtonGroup>
    );
  }

  function DetailOperation() {
    const [open, setOpen] = useState(false);

    const JoinDialogOpen = () => {
      setOpen(true);
    };
    const JoinDialogClose = () => {
      setOpen(false);
    };

    return (
      <>
        <ButtonGroup variant="outlined">
          {detail.tag !== 'notice' && detail.canRegister ? (
            <Button
              onClick={() => {
                Router.push({
                  pathname: '/meeting/regist',
                  query: { tag: 'board' },
                });
              }}
            >
              방 생성
            </Button>
          ) : null}
          <Button
            onClick={() => {
              Router.push('/board/update');
            }}
          >
            수정
          </Button>
          <Button onClick={JoinDialogOpen}>삭제</Button>
        </ButtonGroup>
        <Dialog open={open} onClose={JoinDialogClose}>
          <DialogTitle>{'삭제 하시겠습니까?'}</DialogTitle>
          <DialogActions>
            <Button onClick={JoinDialogClose}>취소</Button>
            <Button
              onClick={() => {
                JoinDialogClose();
                Swal.fire({
                  title: '게시물 삭제 중입니다',
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                    deleteBoard({
                      boardId: detail.boardId,
                      userId: sessionStorage.getItem('userId'),
                    }).then((res) => {
                      if (res.statusCode === 200) {
                        // alert('게시물이 삭제되었습니다.');
                        Swal.fire({
                          title: '게시물이 삭제되었습니다',
                          text: '게시판 목록으로 이동합니다',
                          icon: 'success',
                          showConfirmButton: false,
                          timer: 500,
                        }).then(() => {
                          Router.push('/board');
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

  function BoardDetail() {
    const CusCard = styled(Card)`
      margin-top: 10px;
      padding: 10px;

      & h4 {
        font-weight: bolder;
        padding: 0;
        margin: 0;
      }
    `;

    const DetailWrapper = styled.div`
      display: flex;
      flex-direction: row;
      align-items: baseline;

      & > div {
        display: flex;
        margin-left: auto;
        float: right;
      }

      & div > p {
        margin-left: 10px;
      }

      & .dateOrTime {
        color: gray;
      }
    `;
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
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = window.URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }

    function changeToBlob(file) {
      fileDownload(file).then((res) => {
        if (res.data && res.data.statusCode == 200 && res.data.fileString) {
          const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
          createAndDownloadBlobFile(arrayBuffer, file.originFile);
        } else {
          // alert('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
          Swal.fire({
            icon: 'error',
            title: '파일이 존재하지 않습니다. 관리자에게 문의해주세요.',
            confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
          });
        }
      });
    }

    return detail ? (
      <>
        <CusCard>
          <CardContent>
            <DetailWrapper>
              <h4>{detail.title}</h4>
              <div>
                <p>{detail.nickname}</p>
                <p className="dateOrTime">{detail.dateOrTime}</p>
              </div>
            </DetailWrapper>
            <Typography sx={{ fontSize: 15 }}>
              {detail.content.split('\n').map((line, index) => {
                return (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                );
              })}
            </Typography>
            <DetailAction detail={detail}></DetailAction>
          </CardContent>
        </CusCard>
        {Array.isArray(detail.files) && detail.files.length !== 0 ? (
          <CusCard>
            <Accordion elevation="0">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div>첨부 파일 ({`${detail.files.length}`})</div>
              </AccordionSummary>
              <AccordionDetails>
                {detail.files.map((file, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        changeToBlob(file);
                      }}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <AttachFileIcon />
                      {`${file.originFile}`}
                    </div>

                    // <div key={index} onClick={()=>{changeToBlob(file)}}><AttachFileIcon />{`${file.originFile}`}</div>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </CusCard>
        ) : null}
        <CusCard>
          <CardContent>
            <h4>댓글</h4>
            <CommentRegist />
            {detail && detail.comments && detail.comments.length !== 0 ? (
              <CommentList
                detail={detail}
                setReloadCondition={setReloadCondition}
              ></CommentList>
            ) : (
              <div>등록된 댓글이 없습니다.</div>
            )}
          </CardContent>
        </CusCard>
      </>
    ) : null;
  }

  function DetailAction(props) {
    let detail = props.detail;
    const ActionWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 20px;
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
    //조회수,좋아요
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
                updateArticleLike({
                  tag: 'BOARD',
                  boardId: detail.boardId,
                  userId: sessionStorage.getItem('userId'),
                }).then((res) => {
                  let mute = res;
                });
              } else {
                // alert('로그인이 필요한 작업입니다.');
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
            <span>{detailLikes}</span>
          </Button>
        </ButtonGroup>
      </ActionWrapper>
    );
  }

  function CommentRegist() {
    const [inputComment, setInputComment] = useState({});

    const changeHandle = (value, name) => {
      inputComment[name] = value;
    };

    const CommentWrapper = styled.div`
      display: flex;
      margin: 10px 0px;
      align-items: center;
    `;

    function registRequest() {
      registComment({
        boardId: detail.boardId,
        content: inputComment.content,
        userId: sessionStorage.getItem('userId'),
      }).then((res) => {
        if (res.statusCode === 200) {
          // 현재 페이지 재로딩
          setReloadCondition(true);
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

    return (
      <CommentWrapper>
        {sessionStorage.getItem('userId') ? (
          <>
            <TextField
              id="outlined-basic"
              placeholder="댓글을 입력하세요"
              variant="outlined"
              onChange={(e) => changeHandle(e.target.value, 'content')}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  registRequest();
                }
              }}
              sx={{ width: '100%' }}
            ></TextField>
            <Button sx={{ p: '10px 10px' }} onClick={registRequest}>
              <SendIcon sx={{ fontSize: 25 }} />
            </Button>
          </>
        ) : (
          <>
            <TextField
              disabled
              defaultValue="회원만 댓글을 작성할 수 있습니다."
              sx={{ width: '100%' }}
            ></TextField>
            <Button disabled sx={{ p: '10px 10px' }}>
              <SendIcon sx={{ fontSize: 25 }} />
            </Button>
          </>
        )}
      </CommentWrapper>
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
                  Swal.fire({
                    title: '비밀번호 확인 중입니다',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();
                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
                          Swal.fire({
                            title: '해당 방으로 이동합니다',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 500,
                          }).then(() => {
                            Router.push('/meeting/' + room.roomId);
                            pwDialogClose();
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

export default BoardDetail;
