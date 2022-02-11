import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';

import styled from '@emotion/styled';
import {
  Grid,
  Skeleton,
  Card,
  Button,
  CardContent,
  Typography,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import meetingJSONData from '../../data/meetingData.json';
import { getRoomAllAPI } from '../../pages/api/meeting';
import Router from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import * as meetingActions from '../../store/module/meeting';
import { joinRoomAPI } from '../../pages/api/meeting'
 
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';

// import { OpenVidu } from 'openvidu-browser';
import UserVideo from './UserVideo';

var _ = require('lodash');

function ItemList() {
  //-------------- redux dispatch로 값 저장, selector로 불러오기
  let meetingData = useSelector(({ meeting }) => meeting.meetingList);
  let filterData = useSelector(({ meeting }) => meeting.meetingFilterList);

  const dispatch = useDispatch();

  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(meetingActions.setMeetingDetail({ detail }));
    },
    [dispatch]
  );

  const setList = useCallback(
    ({ list }) => {
      dispatch(meetingActions.setMeetingList({ list }));
    },
    [dispatch]
  );

  const setPublisherStatus = useCallback(
    ({ status }) => {
      dispatch(meetingActions.setPublisherStatus({ status }));
    },
    [dispatch]
  );

  // 페이지네이션 페이지
  const [page, setPage] = useState(1);

  // 미디어 쿼리에 따라 화면에 보여지는 그리드 수 변경
  const theme = useTheme();

  const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
  const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
  const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));

  let purPage = useRef(1);
  let allPage = parseInt(meetingData.length / purPage.current);
  if (meetingData.length % purPage.current > 0) allPage += 1;

  if (lgMatches) {
    purPage.current = 8;
  } else if (mdMatches) {
    purPage.current = 6;
  } else if (smMatches) {
    purPage.current = 4;
  } else if (xsMaches) {
    purPage.current = 2;
  }

  // 화면에 요소를 그리기 전에 store에 저장된 아이템 리스트가 있는지 확인
  // 없으면 store에 저장
  useLayoutEffect(() => {
    getRoomAllAPI().then((res) => {
      if (res.rooms) setList({ list: res.rooms });
      else setList({ list: [] });
    });

    // if (meetingData.length == 0) {
    //   // 빈 배열이면 배열 요청
    //   // To Do : 나중에 api로 값 가져오게 수정
    //   setList({ list: meetingJSONData });
    // }
  }, []);

  const handleChange = (index, value) => {
    setPage(value);
  };

  const CusPagination = styled(Pagination)`
    margin-top: 20px;
  `;

  const CusGrid = styled(Grid)`
    min-height: 530px;
  `;

  const [openJoin, setOpenJoin] = useState(false);
  const [openPw, setOpenPw] = useState(false);
  const [room, setRoom] = useState({});

  const joinDialogOpen = () => {
    setOpenJoin(true);
  };
  const joinDialogClose = () => {
    setOpenJoin(false);
  };
  const pwDialogOpen = () => {
    setOpenPw(true);
  };
  const pwDialogClose = () => {
    setOpenPw(false);
  };

  return (
    <>
      {!meetingData || meetingData.length == 0 ? (
        <CusGrid>
          <CusCard>등록된 데이터가 없습니다.</CusCard>
        </CusGrid>
      ) : (
        <CusGrid
          container
          maxWidth="lg"
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {
            // 검색된 데이터가 있을 때
            filterData != null
              ? filterData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={data.no}
                        onClick={() => {
                          joinDialogOpen();
                          setRoom(data);
                        }}
                      >
                        <Item data={data}></Item>
                      </Grid>
                    );
                  })
              : meetingData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={data.no}
                        onClick={() => {
                          joinDialogOpen();
                          setRoom(data);
                        }}
                      >
                        <Item data={data}></Item>
                      </Grid>
                    );
                  })
          }
        </CusGrid>
      )}
      <JoinDialog
        open={openJoin}
        joinDialogClose={joinDialogClose}
        room={room}
        pwDialogOpen={pwDialogOpen}
        setDetail={setDetail}
      ></JoinDialog>
      <PwDialog
        open={openPw}
        pwDialogClose={pwDialogClose}
        room={room}
        setDetail={setDetail}
      ></PwDialog>
      <CusPagination
        count={allPage}
        color="primary"
        page={page}
        onChange={handleChange}
        setPublisherStatus={setPublisherStatus}
      />
    </>
  );
}

export function Item(props) {
  let data = props.data;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    cursor: pointer;

    & .title {
      font-weight: bolder;
    }
  `;

  const ChipWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  const CusChip = styled(Chip)`
    width: fit-content;
    transform: translate(-10px, 45px);
  `;

  const DefaultImage = styled.div`
    height: 150px;
    background-color: #e0e0e0;
    background-image: url('/images/profile_default_gen0.png');
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  return (
    <Container>
      <ChipWrapper>
        <CusChip label={data.size} icon={<PersonIcon />} />
      </ChipWrapper>
      <Card>
        <DefaultImage></DefaultImage>

        <CardContent>
          <Typography
            className="title"
            gutterBottom
            variant="h5"
            component="div"
          >
            {data.isSecret === 1 ? <LockIcon /> : null} {data.title}
          </Typography>
          <div>{data.isPrivate ? '-' : data.host}</div>
          <div>
            <AccessTimeIcon style={{ marginRight: '5px' }} />
            {data.startTime}분 / {data.timeLimit}분
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

function JoinDialog(props) {
  let { open, joinDialogClose, room, pwDialogOpen, setDetail } = props;
  // const [publisher, setPublisher] = useState(null);

  // useEffect(() => {
  //   if (publisher) {
  //     let newPublisher = _.cloneDeep(publisher);
  //     newPublisher.properties = {
  //       ...publisher.properties,
  //       publishAudio: userStatus.includes('audio'),
  //       publishVideo: userStatus.includes('camera'),
  //     };
  //     setPublisher(newPublisher);
  //   }
  // }, [userStatus]);

  // let commonSetting = {
  //   audioSource: undefined, // 오디오 출처 : 디폴트값 - 마이크
  //   resolution: '320x240', // 비디오 사이즈
  //   frameRate: 30, // 비디오 프레임
  //   insertMode: 'APPEND', // 비디오가 'video-container' 타겟 요소에 어떻게 삽입될 지 결정
  //   mirror: false, // 비디오 좌우반전할지 말지 (true: 반전)
  //   nickname: sessionStorage.getItem('nickname'),
  // };

  // const initOV = () => {
  //   (async function init() {
  //     // eslint-disable-next-line
  //     openViduModule = await import('openvidu-browser');
  //     OV = new openViduModule.OpenVidu();
  //     devices = await OV.getDevices();
  //     videoDevices = devices.filter((device) => device.kind == 'videoinput');

  //     if (videoDevices.length > 0) {
  //       setPublisher(
  //         OV.initPublisher(undefined, {
  //           ...commonSetting,
  //           videoSource: videoDevices[0].deviceId, // 비디오 출처 : 디폴트값 - 웹캠
  //           publishAudio: true, // 방에 들어갔을 때 오디오를 mute할지, 그렇지 않을지 결정 (true: ON)
  //           publishVideo: true, // 방에 들어갔을 때 비디오를 킬 지, 끌 지 결정 (true: ON)
  //         })
  //       );
  //     }
  //   })();
  // };

  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: true })
    //   .then((stream) => {
    //     initOV();
    //   })
    //   .catch((err) => {
    //     alert('접근이 거절되었습니다. 브라우저 설정에서 변경이 가능합니다.');
    //   });
    return () => {};
  }, []);

  return (
    <Dialog open={open} onClose={joinDialogClose}>
      <DialogTitle>{`[${room.title}]\n방에 입장하시겠습니까?`}</DialogTitle>
      <DialogContent>
        {/* <div id="video-container" className="col-md-6">
          {userStatus.includes('camera') && publisher !== undefined ? (
            <div className="stream-container col-md-6 col-xs-6">
              <UserVideo
                streamManager={publisher}
                name={sessionStorage.getItem('nickname')}
              />
            </div>
          ) : (
            <>
              <NoVideo />
              <p>{sessionStorage.getItem('nickname')}</p>
            </>
          )}
        </div>
        <ToggleButtonGroup
          value={userStatus}
          onChange={handleUserStatus}
          aria-label="user status formatting"
          style={{ marginTop: '10px' }}
        >
          <ToggleButton value="camera" aria-label="camera">
            {userStatus.includes('camera') ? (
              <VideocamIcon />
            ) : (
              <VideocamOffOutlinedIcon />
            )}
          </ToggleButton>
          <ToggleButton value="audio" aria-label="audio">
            {userStatus.includes('audio') ? (
              <MicIcon />
            ) : (
              <MicOffOutlinedIcon />
            )}
          </ToggleButton>
        </ToggleButtonGroup> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={joinDialogClose}>취소</Button>
        {/* {userStatus.length > 0 ? ( */}
        <Button
          onClick={
            // 비밀방인지 여부 확인
            room.isSecret === 1
              ? () => {
                  joinDialogClose();
                  pwDialogOpen();
                }
              : () => {
                  // setPublisherStatus({ status: publisher });
                  // 카메라, 오디오 정보 -> publisher
                  Router.push('/meeting/' + room.roomId);
                  setDetail({
                    detail: room,
                  });
                  joinDialogClose();
                }
          }
          autoFocus
        >
          확인
        </Button>
        {/* ) : (
          <Tooltip
            title="방에 입장하기 위해선 마이크나 카메라를 켜야해요."
            placement="top"
          >
            <Button>앗</Button>
          </Tooltip>
        )} */}
      </DialogActions>
    </Dialog>
  );
}

function PwDialog(props) {
  let { open, pwDialogClose, room, setDetail } = props;
  let [pw, setPw] = useState('');
  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
    password: ''
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
            // 일치하면 입장
            // To Do : 나중에 방 비밀번호로 변경
            pw === room.password
              ? () => {
                  // setPublisherStatus({ status: publisher });
                  inputValue.password = pw;
                  inputValue.roomId = room.roomId
                  joinRoomAPI(inputValue).then((res) => { 

                    if (res.statusCode == 200) {
                      Router.push('/meeting/' + room.no);
                      setDetail({
                        detail: room,
                      });
                      pwDialogClose();
                    } else {
                      alert(`${res.message}`);
                    }
                  });
                }
              : () => {
                  alert('비밀번호를 확인해주세요.');
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

export default ItemList;
