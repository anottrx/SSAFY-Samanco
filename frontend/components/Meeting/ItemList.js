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
import Router from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import * as meetingActions from '../../store/module/meeting';

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
    if (meetingData.length == 0) {
      // 빈 배열이면 배열 요청
      // To Do : 나중에 api로 값 가져오게 수정
      setList({ list: meetingJSONData });
    }
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
      <CusGrid
        container
        maxWidth="lg"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {meetingData
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
          })}
      </CusGrid>
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

  return (
    <Container>
      <ChipWrapper>
        <CusChip label={data.size} icon={<PersonIcon />} />
      </ChipWrapper>
      <Card>
        <Skeleton variant="rectangular" height={150} animation={false} />

        <CardContent>
          <Typography
            className="title"
            gutterBottom
            variant="h5"
            component="div"
          >
            {data.isPrivate ? <LockIcon /> : null} {data.title}
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
  const [publisher, setPublisher] = useState(null);

  // userStatus : 카메라, 오디오 설정 -> 배열 안에 값이 있으면 ON 상태, 없으면 OFF 상태
  const [userStatus, setUserStatus] = useState(['camera', 'audio']);
  const handleUserStatus = (e, newValue) => {
    setUserStatus(newValue);
  };

  const NoVideo = styled.div`
    width: 320px;
    height: 240px;
    background-color: #f9f9f9;
    border: 1px solid gray;
  `;

  let openViduModule, OV, devices, videoDevices;

  useEffect(() => {
    if (publisher) {
      let newPublisher = _.cloneDeep(publisher);
      newPublisher.properties = {
        ...publisher.properties,
        publishAudio: userStatus.includes('audio'),
        publishVideo: userStatus.includes('camera'),
      };

      console.log(
        'new [audio]:',
        newPublisher.properties.publishAudio +
          ' / [video]:' +
          newPublisher.properties.publishVideo
      );
      setPublisher(newPublisher);
    }
  }, [userStatus]);

  let commonSetting = {
    audioSource: undefined, // 오디오 출처 : 디폴트값 - 마이크
    resolution: '320x240', // 비디오 사이즈
    frameRate: 30, // 비디오 프레임
    insertMode: 'APPEND', // 비디오가 'video-container' 타겟 요소에 어떻게 삽입될 지 결정
    mirror: false, // 비디오 좌우반전할지 말지 (true: 반전)
  };

  useEffect(() => {
    (async function init() {
      // eslint-disable-next-line
      console.log('---------------------init');
      openViduModule = await import('openvidu-browser');
      OV = new openViduModule.OpenVidu();
      devices = await OV.getDevices();
      videoDevices = devices.filter((device) => device.kind == 'videoinput');

      if (videoDevices.length > 0) {
        setPublisher(
          OV.initPublisher(undefined, {
            ...commonSetting,
            videoSource: videoDevices[0].deviceId, // 비디오 출처 : 디폴트값 - 웹캠
            publishAudio: true, // 방에 들어갔을 때 오디오를 mute할지, 그렇지 않을지 결정 (true: ON)
            publishVideo: true, // 방에 들어갔을 때 비디오를 킬 지, 끌 지 결정 (true: ON)
          })
        );
      }
    })();
  }, []);

  return (
    <Dialog open={open} onClose={joinDialogClose}>
      <DialogTitle>{`[${room.title}]\n방에 입장하시겠습니까?`}</DialogTitle>
      <DialogContent>
        <div id="video-container" className="col-md-6">
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
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={joinDialogClose}>취소</Button>
        {userStatus.length > 0 ? (
          <Button
            onClick={
              // 비밀방인지 여부 확인
              room.isPrivate
                ? () => {
                    joinDialogClose();
                    pwDialogOpen();
                  }
                : () => {
                    // 세션 연결
                    // joinSession();
                    console.log(JSON.stringify(publisher.properties));
                    // Router.push("/meeting/"+room.no);
                    setDetail({ datail: room });
                    joinDialogClose();
                    window.open(
                      '/meeting/' + room.no,
                      '_blank',
                      'toolbar=no,scrollbars=no,resizable=yes,width=1000,height=800'
                    );
                  }
            }
            autoFocus
          >
            확인
          </Button>
        ) : (
          <Tooltip
            title="방에 입장하기 위해선 마이크나 카메라를 켜야해요."
            placement="top"
          >
            <Button>앗</Button>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
}

function PwDialog(props) {
  let { open, pwDialogClose, room, setDetail } = props;
  let [pw, setPw] = useState('');
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
            pw === '1234'
              ? () => {
                  // Router.push("/meeting/"+room.no);
                  // 세션 연결
                  // joinSession();
                  pwDialogClose();
                  setDetail({ datail: room });
                  window.open(
                    '/meeting/' + room.no,
                    '_blank',
                    'toolbar=no,scrollbars=no,resizable=yes,width=1000,height=800'
                  );
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

/*
[전제] 미팅방마다 세션 정보가 저장되어 있음
-> 입장 버튼 클릭 시 joinSession 실행
*/

function deleteSubscriber() {
  // 참여자에서 현재 유저 지우는 함수
}

async function joinSession() {
  // 1. Openvidu 객체 생성
  let openViduModule = await import('openvidu-browser');
  let OV = new openViduModule.OpenVidu();
  // 2. 세션 초기화
  let session = OV.initSession();

  () => {
    var mySession = session;

    // // 어떤 새로운 스트림이 도착하면
    mySession.on('streamCreated', (e) => {
      var subscriber = mySession.subscribe(e.stream, undefined);

      var subscribers = this.state.subscribers;
      subscribers.push(subscriber); // 기존 참여자들에 새로 들어온 유저 추가

      // Update the state with the new subscribers
      this.setState({
        subscribers: subscribers,
      });
    });
  };

  // 3. 방에서 생기는 이벤트들 액션으로 정의
  // -> 이건 id.js에 정의하는 게 나을 듯
  // 액션 1. 사용자가 들어올 때
  // 액션 2. 사용자가 나갈 때
  // 액션 3. 예외 발생할 때
  // 4. 사용자가 방에 들어오면 유저마다 토큰 반환
  // 세션 객체에 connect 메소드 호출

  // 해당 세션에 접속중인 유저 정보 ->
  //  var subscriber = mySession.subscribe(event.stream, undefined);
}

function leaveSession() {
  // 세션 객체에 disconnect 메소드 호출
  // OpenVidu 객체 초기화
  // session, 방에 참여하고 있는 유저 정보, 현재 유저 정보 초기화
}

export default ItemList;
