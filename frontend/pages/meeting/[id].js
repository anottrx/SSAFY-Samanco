import styled from '@emotion/styled';

import Users from '../../components/Meeting/User';
import RoomInfo from '../../components/Meeting/RoomInfo';
import Chatting from '../../components/Meeting/Chatting';
import {
  Card,
  Divider,
  Button,
  Grid,
  Box,
  Fab,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import axios from 'axios';
import UserVideo from '../../components/Meeting/UserVideo';
import Router from 'next/router';

import { quitRoomAPI } from '../api/meeting';

var OpenViduBrowser;

const OPENVIDU_SERVER_URL = 'https://i6a502.p.ssafy.io:5443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

function meetingDetail() {
  const RoomWrapper = styled(Card)`
    padding: 20px;
    margin: 10px;
    height: calc(100vh - 20px);
    overflow-y: auto;
  `;

  const RoomContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    height: calc(100% - 100px);
  `;

  const NoVideo = styled.div`
    width: 320px;
    height: 240px;
    background-color: #f9f9f9;
    border: 1px solid gray;
  `;

  const VideoWrapper = styled.div`
    min-width: 200px;
    height: 350px;
  `;

  const GridWrapper = styled(Grid)`
    flex: 1;
    justify-content: space-between;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  `;

  const CusGrid = styled(Grid)`
    width: 100%;
    justify-content: center;

    & .MuiGrid-root {
      height: 250px;
      transform: translate(0px, 0px);
      padding: 0px 5px;
    }
  `;

  let detail = useSelector(({ meeting }) => meeting.meetingDetail);
  
  const [OV, setOV] = useState();
  const [session, setSession] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [isConfigModalShow, setIsConfigModalShow] = useState(true);
  const userGridSize = useRef(4);

  const myUserName = sessionStorage.getItem('nickname')
    ? sessionStorage.getItem('nickname')
    : 'unknown';

  useEffect(() => {
    // 유저가 방에 들어왔을 때
    // if (detail && publisherStatus) {
    // To do : 방 정보 받아와서 인원 수에 따라 userGridSize 변경하기

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        importOpenVidu().then((ob) => {
          OpenViduBrowser = ob; // 오픈비두 모듈을 임포트
          setOV(new OpenViduBrowser.OpenVidu());
        });
      })
      .catch((err) => {
        alert(
          '카메라와 마이크 접근 권한이 필요합니다. 브라우저 설정에서 [허용]으로 변경 해주세요.'
        );
      });

    return () => {
      leaveSession();
      clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      allTrackOff(publisher);
    };
  }, [publisher]);

  // useEffect(() => {
  //   if (OV) {
  //     setSession(OV.initSession());
  //   }
  // }, [OV]);

  // OpenVidu 모듈 동적 import
  const importOpenVidu = () => {
    return new Promise((resolve, reject) => {
      import('openvidu-browser')
        .then((ob) => {
          resolve(ob);
        })
        .catch((error) => {
          console.error('openvidu import error: ', error.code, error.message);
          reject();
        });
    });
  };

  // 세션 변경 시 실행됨
  // 각 유저마다 세션이 있따.
  useEffect(() => {
    if (!session) return;

    //console.log('session 있다');

    const mySession = session;

    // 어떤 새로운 스트림이 도착하면
    mySession.on('streamCreated', (event) => {
      const sub = mySession.subscribe(event.stream, '');
      // sub : 새로운 스트림 / subs : 기존 참여자들
      let subs = subscribers;
      subs.push(sub);
      setSubscribers([...subs]);
    });

    // 어떤 스트림이 없어지면
    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    // 예외가 발생하면
    mySession.on('exception', (exception) => {
      console.log('[exception]:', exception);
      if (
        exception.name === 'ICE_CONNECTION_DISCONNECTED' ||
        exception.name === 'ICE_CONNECTION_FAILED' ||
        exception.name === 'NO_STREAM_PLAYING_EVENT'
      ) {
        deleteSubscriber(exception.origin.streamManager);
      } else {
        console.warn(exception);
      }
    });

    // 스트림 속성이 변경되면
    mySession.on('streamPropertyChanged', () => {
      const subs = subscribers;
      setSubscribers([...subs]);
    });

    getToken()
      .then((token) => {
        //console.log('getToken:', token);
        mySession.connect(token, { clientData: myUserName }).then(async () => {
          if (!OV) return;
          var devices = await OV.getDevices();
          var videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );

          let pub = OV.initPublisher('', {
            audioSource: undefined,
            videoSource: camOn ? videoDevices[0].deviceId : false,
            publishAudio: micOn,
            publishVideo: camOn,
            resolution: '320x240',
            frameRate: 30,
            mirror: true,
          });

          mySession.publish(pub).then(() => {
            setPublisher(pub);
          });
        });
      })
      .catch((error) => {
        console.error(
          'There was an error connecting to the session:',
          error.name,
          error.message
        );
      });
  }, [session]);

  const deleteSubscriber = (streamManager) => {
    let subs = subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subs.splice(index, 1);
      setSubscribers([...subs]);
    }
  };

  const clear = () => {
    setOV(undefined);
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    setMicOn(false);
    setCamOn(false);
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      // 세션 disconnect
      mySession.unpublish(publisher);
      mySession.disconnect();
    }
  };

  const allTrackOff = (sm) => {
    if (sm) {
      const mediaTrack = sm.stream.getMediaStream();
      if (mediaTrack)
        mediaTrack.getTracks().map((m) => {
          m.enabled = false;
          m.stop();
        });
    }
  };

  const handlerJoinBtn = (micState, camState) => {
    setMicOn(micState);
    setCamOn(camState);

    setIsConfigModalShow(false);
    setSession(OV?.initSession());

    // 에러 발생 시 세션 삭제
    // deleteSession();
  };

  const getToken = () => {
    let mySessionId = `session${detail.no}`;
    //console.log('getToken:', mySessionId);
    if (mySessionId) {
      if (typeof mySessionId === 'object') {
        return createSession(mySessionId[0]).then((sessionId) =>
          createToken(sessionId)
        );
      } else {
        return createSession(mySessionId).then((sessionId) =>
          createToken(sessionId)
        );
      }
    } else {
      throw 'No Session Id';
    }
  };

  const handleVideoStateChanged = () => {
    // if (videoDevices[0].deviceId) {
    republish(!camOn);
    // }
  };

  const handleAudioStateChanged = () => {
    publisher?.publishAudio(!micOn);
    setMicOn(!micOn);
  };

  const videoTrackOff = (streamManager) => {
    if (streamManager) {
      streamManager.stream
        .getMediaStream()
        .getVideoTracks()
        .map((sm) => {
          sm.enabled = false;
          sm.stop();
        });
    }
  };

  const republish = async (newCamOnState) => {
    if (!OV || !session) return;

    if (publisher) {
      await session.unpublish(publisher);
    }

    var devices = await OV.getDevices();
    var videoDevices = devices.filter((device) => device.kind === 'videoinput');

    let newPublisher = OV.initPublisher('', {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: micOn,
      publishVideo: newCamOnState,
      resolution: '320x240',
      frameRate: 30,
      mirror: true,
    });

    session.publish(newPublisher).then(() => {
      setPublisher(newPublisher);
      newPublisher?.publishVideo(newCamOnState);
      setCamOn(newCamOnState);
    });
  };

 
  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
  });
  const exitClick = () => {
    inputValue.roomId = detail.roomId

    videoTrackOff(publisher);
    leaveSession();
    clear();
    
    quitRoomAPI(inputValue).then((res) => {
      if (res.statusCode == 200) {
      } else {
        alert(`${res.message}`);
      }
    });
    // 방장도 미팅룸 탈퇴
    // to do : 방장이면 방 삭제
    if (detail.hostId == sessionStorage.getItem('userId')) {
      deleteSession();
    }
    Router.replace('/meeting');
  };

  // -----------------------------------------------------------

  const deleteSession = () => {
    let mySessionId = `session${detail.no}`;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
      };

      axios
        .delete(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${mySessionId}`, {
          headers,
        })
        .then((res) => console.log('[delete]', res));
    });
  };

  // 이 아래부턴 백엔드에 axios 보내서 데이터 받아옴
  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      let headers = {
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
      };

      axios
        .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions`, data, {
          headers,
        })
        .then((response) => {
          //console.log('CREATE SESSION', response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.error(error);
            console.warn(
              `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`
            );
            if (
              window.confirm(
                `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}

                Click OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at ${OPENVIDU_SERVER_URL}`
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + '/accept-certificate'
              );
            }
          }
        });
    });
  };

  const createToken = (sessionId) => {
    //console.log('createToken', sessionId);
    return new Promise((resolve, reject) => {
      let data = {};
      let headers = {
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
        'Content-Type': 'application/json',
      };

      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
          data,
          { headers }
        )
        .then((response) => {
          // console.log('TOKEN', response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  function UserName({ user }) {
    const NameWrapper = styled.div`
      transform: translate(10px, -160px);
      background-color: white;
      width: fit-content;
      padding: 5px;
    `;

    const [name, setName] = useState('...loading');
    useEffect(() => {
      if (user && user.stream && user.stream.connection) {
        if (user.stream.connection.data) {
          setName(JSON.parse(user.stream.connection.data).clientData);
        } else setName('화면 공유 중');
      } else setName('...loading');
    }, [user]);

    return <NameWrapper>{name}</NameWrapper>;
  }

  return (
    <RoomWrapper>
      {!isConfigModalShow ? (
        <>
          <RoomInfo
            detail={detail}
            exitClick={exitClick}
            micOn={micOn}
            setMicOn={setMicOn}
            camOn={camOn}
            setCamOn={setCamOn}
            handleVideoStateChanged={handleVideoStateChanged}
            handleAudioStateChanged={handleAudioStateChanged}
          ></RoomInfo>
          <Divider />
          <RoomContent>
            <GridWrapper>
              <CusGrid container>
                {/* <Users publisher={publisher} subscribers={subscribers}></Users> */}
                {publisher !== undefined &&
                  (userGridSize.current === 4 ? (
                    <Grid item xs={12} sm={10} md={6}>
                      <VideoWrapper id="video-container">
                        <UserVideo streamManager={publisher} />
                      </VideoWrapper>
                      <UserName user={publisher}></UserName>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={4} md={4}>
                      <VideoWrapper id="video-container">
                        <UserVideo streamManager={publisher} />
                      </VideoWrapper>
                      <UserName user={publisher}></UserName>
                    </Grid>
                  ))}
                {subscribers.map((sub, i) =>
                  userGridSize.current === 4 ? (
                    <Grid item xs={12} sm={10} md={6} key={i}>
                      <VideoWrapper id="video-container">
                        <UserVideo streamManager={sub} />
                      </VideoWrapper>
                      <UserName user={sub}></UserName>
                    </Grid>
                  ) : (
                    <Grid item xss={12} sm={4} md={4} key={i}>
                      <VideoWrapper id="video-container">
                        <UserVideo streamManager={sub} />
                      </VideoWrapper>
                      <UserName user={sub}></UserName>
                    </Grid>
                  )
                )}
              </CusGrid>
            </GridWrapper>
            <Chatting session={session}></Chatting>
          </RoomContent>
        </>
      ) : null}
      {isConfigModalShow && OV && (
        <>
          {/* <div id="video-container" className="col-md-6">
            {camOn ? (
              <UserVideo streamManager={publisher} /> // </div> //   /> //     name={sessionStorage.getItem('nickname')} //     streamManager={publisher} //   <UserVideo // <div className="stream-container col-md-6 col-xs-6">
            ) : (
              <>
                <NoVideo />
              </>
            )}
          </div> */}
          <ToggleButtonGroup
            aria-label="user status formatting"
            style={{ marginTop: '10px' }}
          >
            <ToggleButton
              value="camera"
              onClick={() => {
                setCamOn(!camOn);
              }}
            >
              {camOn ? <VideocamIcon /> : <VideocamOffOutlinedIcon />}
            </ToggleButton>
            <ToggleButton
              value="audio"
              onClick={() => {
                setMicOn(!micOn);
              }}
            >
              {micOn ? <MicIcon /> : <MicOffOutlinedIcon />}
            </ToggleButton>
            <ToggleButton
              value="enter"
              onClick={() => {
                handlerJoinBtn(micOn, camOn);
              }}
            >
              입장
            </ToggleButton>
          </ToggleButtonGroup>
          {/* {
            <Button
              onClick={() => {
                setCamOn(!camOn);
              }}
            >
              {camOn ? <VideocamIcon /> : <VideocamOffOutlinedIcon />}
            </Button>
          }
          {
            <Button
              onClick={() => {
                setMicOn(!micOn);
              }}
            >
              {micOn ? <MicIcon /> : <MicOffOutlinedIcon />}
            </Button>
          } */}
          {/* <Button
            onClick={() => {
              handlerJoinBtn(micOn, camOn);
            }}
          >
            입장하기
          </Button> */}
          {/* <ToggleButtonGroup
            // value={userStatus}
            // onChange={handleUserStatus}
            aria-label="user status formatting"
            style={{ marginTop: '10px' }}
          >
            <ToggleButton
              value="camera"
              aria-label="camera"
              onClick={() => setCamOn(!camOn)}
            >
              {camOn ? <VideocamIcon /> : <VideocamOffOutlinedIcon />}
            </ToggleButton>
            <ToggleButton
              value="audio"
              aria-label="audio"
              onClick={() =>setMicOn(!micOn)}
            >
              {micOn ? <MicIcon /> : <MicOffOutlinedIcon />}
            </ToggleButton>
          </ToggleButtonGroup> */}
        </>
      )}
    </RoomWrapper>
  );
}

meetingDetail.getInitialProps = async (ctx) => {
  const pathname = ctx.pathname;

  return { pathname };
};

export default meetingDetail;
