import styled from '@emotion/styled';
import RoomInfo from '../../components/Meeting/RoomInfo';
import Chatting from '../../components/Meeting/Chatting';
import {
  Card,
  Divider,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import axios from 'axios';
import UserVideo from '../../components/Meeting/UserVideo';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { useBeforeunload } from 'react-beforeunload';

import { quitRoomAPI } from '../api/meeting';

var OpenViduBrowser;

const OPENVIDU_SERVER_URL = 'https://i6a502.p.ssafy.io:5443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

function MeetingDetail() {
  const RoomWrapper = styled(Card)`
    padding: 20px;
    margin: 10px;
    height: calc(100vh - 20px);
    overflow-y: auto;

    // & div#notistack-snackbar {
    //   font-size: 15px;
    //   color: red;
    // }
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

  const ConfigWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    & button {
      font-size: 20px;
      padding: 10px;
    }
  `;

  let detail = useSelector(({ meeting }) => meeting.meetingDetail);

  const [OV, setOV] = useState();
  const [screenOV, setScreenOV] = useState();
  const [session, setSession] = useState();
  const [screenSession, setScreenSession] = useState();
  const [connectionId, setConnectionId] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);
  const [screenShare, setScreenShare] = useState();
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [isConfigModalShow, setIsConfigModalShow] = useState(true);
  const userGridSize = useRef(4);
  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
  });
  const [setup, changeSetup] = useState(() => []);

  const router = useRouter();

  const handleChangeSetup = (event, newValue) => {
    changeSetup(newValue);
  };

  // 스낵바
  const { enqueueSnackbar } = useSnackbar();

  const welcomeSnackBar = (newMember) => {
    enqueueSnackbar(`🎉 ${newMember} 님이 입장하셨습니다!`, {
      autoHideDuration: 2000,
      preventDuplicate: true,
    });
  };

  const GoodByeSnackBar = (newMember) => {
    enqueueSnackbar(`🖐 ${newMember} 님이 퇴장하셨습니다!`, {
      autoHideDuration: 2000,
      preventDuplicate: true,
    });
  };

  const myUserName = sessionStorage.getItem('nickname')
    ? sessionStorage.getItem('nickname')
    : 'unknown';

  useBeforeunload(() => '미팅방을 나가시겠어요?');

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        importOpenVidu().then((ob) => {
          OpenViduBrowser = ob; // 오픈비두 모듈을 임포트
          setOV(new OpenViduBrowser.OpenVidu());
          setScreenOV(new OpenViduBrowser.OpenVidu());
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
  useEffect(() => {
    if (!session) return;

    const mySession = session;

    // 어떤 새로운 스트림이 도착하면
    mySession.on('streamCreated', (event) => {
      const sub = mySession.subscribe(event.stream, '');
      if (event.stream.typeOfVideo === 'SCREEN') {
        // 새로운 스트림이 화면 공유이면
        setScreenShare(event.stream.streamManager);
      } else {
        getConnectionInfo(event).then((res) => {
          let subscribersInfos = res.subscribers;
          let target = subscribersInfos?.filter((subs) => {
            subs.streamId === event.stream.streamId;
          });

          if (!target)
            welcomeSnackBar(
              JSON.parse(event.stream.connection.data).clientData
            );
        });
        let subs = subscribers;
        subs.push(sub);
        setSubscribers([...subs]);
      }
    });

    // 어떤 스트림이 없어지면
    mySession.on('streamDestroyed', (event) => {
      if (event.stream.typeOfVideo === 'SCREEN') {
        // 새로운 스트림이 화면 공유이면
        setScreenShare(undefined);
      } else {
        // let leftUserName = JSON.parse(event.stream.connection.data).clientData;
        // console.log('참여자 퇴장 => ', leftUserName);
        // if (!subscribers.includes(event.stream)) GoodByeSnackBar(leftUserName);
        deleteSubscriber(event.stream.streamManager);
      }
    });

    mySession.on('signal:userin', (event) => {
      welcomeSnackBar(event.data);
    });

    mySession.on('signal:userleft', (event) => {
      GoodByeSnackBar(event.data);
    });

    // 예외가 발생하면
    mySession.on('exception', (exception) => {
      if (
        exception.name === 'ICE_CONNECTION_DISCONNECTED' ||
        exception.name === 'NO_STREAM_PLAYING_EVENT'
      ) {
        // console.log(exception);
        mySession.signal({ data: myUserName, to: [], type: 'userleft' });
        deleteSubscriber(exception.origin.streamManager);
      } else if (exception.name === 'OPENVIDU_NOT_CONNECTED')
        setScreenShare(undefined);
      console.warn(exception);
    });

    // 스트림 속성이 변경되면
    mySession.on('streamPropertyChanged', (event) => {
      // console.log('스트림 속성이 변경되면', event);
      const subs = subscribers;
      setSubscribers([...subs]);
    });

    mySession.once('sessionDisconnected', () => {
      if (sessionStorage.getItem('userId') != detail.hostId)
        alert('미팅이 종료 되었습니다.');
      clear();
      Router.push('/meeting');
    });

    getToken()
      .then((token) => {
        // console.log('getToken:', token);
        mySession.connect(token, { clientData: myUserName }).then(async () => {
          if (!OV) return;
          var devices = await OV.getDevices();
          var videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );

          if (!publisher) {
            mySession
              .signal({
                data: myUserName,
                to: [],
                type: 'userin',
              })
              .then(() => {
                // console.log(subscribers);
                // console.log('Message successfully sent');
              })
              .catch((error) => {
                console.error(error);
              });
          }

          let pub = OV.initPublisher('', {
            audioSource: undefined,
            videoSource: camOn ? videoDevices[0].deviceId : false,
            publishAudio: micOn,
            publishVideo: camOn,
            resolution: '320x240',
            frameRate: 30,
            mirror: true,
          });

          // publisher가 undefined일 때만 웰컴 메세지 표시
          mySession.publish(pub).then(() => {
            setPublisher(pub);
            // let newUserName = JSON.parse(pub.stream.connection.data).clientData;
            // console.log('새로운 참여자 입장 => ', newUserName);
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

  useEffect(() => {
    // 뒤로 가기 누르면 실행됨
    const handleStart = (url) => {
      if (url !== '/meeting/' + detail.roomId + '/' && url !== '/meeting') {
        inputValue.roomId = detail.roomId;

        if (detail.hostId == sessionStorage.getItem('userId')) {
          // 방장일 경우 한번 더 확인
          if (
            confirm('방장이 방을 나가면 방이 삭제됩니다. 그래도 나가시겠어요?')
          ) {
            quitRoomAPI(inputValue).then((res) => {
              if (res.statusCode == 200) {
                deleteSession();
                Router.replace('/meeting');
              }
            });
          } else {
            Router.replace('/meeting/' + detail.roomId);
          }
        } else {
          // 방장이 아니면 방 나가기
          quitRoomAPI(inputValue).then((res) => {
            if (res.statusCode == 200) {
              Router.replace('/meeting');
              videoTrackOff(publisher);
              leaveSession();
              clear();
            }
          });
        }
      }
    };

    router.events.on('routeChangeStart', handleStart);
    return () => {
      router.events.off('routeChangeStart', handleStart);
    };
  }, []);

  useEffect(() => {
    if (!screenSession) return;

    const shareSession = screenSession;

    shareSession.on('exception', (exception) => {
      if (
        exception.name === 'ICE_CONNECTION_DISCONNECTED' ||
        exception.name === 'NO_STREAM_PLAYING_EVENT'
      ) {
        deleteSubscriber(exception.origin.streamManager);
      } else if (exception.name === 'OPENVIDU_NOT_CONNECTED')
        setScreenShare(undefined);
      console.warn(exception);
    });

    shareSession.on('streamPropertyChanged', () => {
      const sub = screenShare;
      setScreenShare(sub);
    });
  }, [screenSession]);

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
    setScreenOV(undefined);
    setSession(undefined);
    setScreenShare(undefined);
    setScreenSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    setMicOn(false);
    setCamOn(false);
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      // 세션 disconnect
      // mySession.unpublish(publisher);
      mySession.disconnect();
    }

    const shareSession = screenSession;
    if (shareSession) {
      shareSession.disconnect();
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

  const handlerJoinBtn = async (micState, camState) => {
    setMicOn(micState);
    setCamOn(camState);

    setIsConfigModalShow(false);
    await setSession(OV?.initSession());
    await setScreenSession(screenOV?.initSession());

    // 에러 발생 시 세션 삭제
    // deleteSession();
  };

  const getToken = () => {
    let mySessionId = `session${detail.roomId}`;
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
      // await session.forceUnpublish(publisher);
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

  const shareMonitor = () => {
    if (!screenOV || !screenSession) return;
    const mySession = screenOV.initSession();

    getToken().then((tokenScreen) => {
      mySession
        .connect(tokenScreen)
        .then(() => {
          const pub = screenOV.initPublisher('container-screens', {
            videoSource: 'screen',
            publishAudio: false,
            // resolution: '800x720',
          });

          setScreenShare(pub);
          pub.once('accessAllowed', (event) => {
            // console.log('스크린 쉐어 accessAllowed!!!!!!!!!!!!!!!!', event);
            pub.stream.getMediaStream().getVideoTracks()[0].applyConstraints({
              // width: 800,
              height: 600,
            });

            pub.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .addEventListener('ended', () => {
                // console.log('스크린 쉐어 종료!!!!!!! ');
                stopScreenSharing();
                mySession.unpublish(pub);
              });
            mySession.publish(pub).then(() => {
              setScreenShare(pub);
              // console.log('스크린 쉐어 publish 됨!!!!!!! ', screenShare);
            });
            // mySession.publish(pub);
          });

          pub.once('accessDenied', (event) => {
            // console.error('스크린쉐어: Access Denied!!!!!!!!!!!', event);
            stopScreenSharing();
          });
        })
        .catch((error) => {
          console.warn(
            '스크린 쉐어에 문제 있다!!!!!!!!!!',
            error.code,
            error.message
          );
        });
    });
  };

  const stopScreenSharing = () => {
    const shareSession = screenSession;
    const mySession = session;

    // console.log('!!!!!!!!!!!!!!!stopScreenSharing       => ', screenShare);
    if (shareSession) shareSession.unpublish(screenShare);
    deleteSubscriber(screenShare);
    setScreenShare(undefined);
  };

  const exitClick = () => {
    const mySession = session;
    inputValue.roomId = detail.roomId;

    if (mySession)
      mySession.signal({ data: myUserName, to: [], type: 'userleft' });
    // GoodByeSnackBar(myUserName);

    videoTrackOff(publisher);
    leaveSession();
    clear();

    quitRoomAPI(inputValue).then((res) => {
      if (res.statusCode == 200) {
      }
    });
    // 방장도 미팅룸 탈퇴
    // to do : 방장이면 방 삭제
    // if (detail.hostId == sessionStorage.getItem('userId')) {
    //   deleteSession();
    // }
    Router.replace('/meeting');
  };

  // -----------------------------------------------------------

  const deleteSession = () => {
    let mySessionId = `session${detail.roomId}`;
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
        .then((res) => console.log('[deleteSession]', res));
    });
  };

  // 이 아래부턴 백엔드에 axios 보내서 데이터 받아옴
  const createSession = (sessionId) => {
    // console.log('createSession:', sessionId);
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
          // console.log('CREATE SESSION', response);
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
    // console.log('createToken', sessionId);
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
          // console.log('-------------connectionId', response.data.id);
          // setConnectionId(response.data.id);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  const getConnectionInfo = (pub) => {
    let mySessionId = `session${detail.roomId}`;
    let connectionId = pub.stream.connection.connectionId;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
      };

      axios
        .get(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${mySessionId}/connection/${connectionId}`,
          {
            headers,
          }
        )
        .then((res) => res.data);
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
    <SnackbarProvider maxSnack={3}>
      <Head>
        <title>미팅룸 | 싸피사만코</title>
      </Head>
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
              screenShare={screenShare}
              shareMonitor={shareMonitor}
            ></RoomInfo>
            <Divider />
            <RoomContent>
              <GridWrapper>
                <CusGrid container>
                  {screenShare !== undefined && (
                    // 화면 공유 발생 시
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{ marginBottom: '600px' }}
                      >
                        <VideoWrapper id="container-screens">
                          <UserVideo streamManager={screenShare} />
                        </VideoWrapper>
                      </Grid>
                      <br />
                    </>
                  )}
                  {!screenShare &&
                    publisher !== undefined &&
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
                  {!screenShare &&
                    subscribers.map((sub, i) => {
                      return sub.stream.typeOfVideo !== 'SCREEN' &&
                        userGridSize.current === 4 ? (
                        <Grid item xs={12} sm={10} md={6} key={i}>
                          <VideoWrapper id="video-container">
                            <UserVideo streamManager={sub} />
                          </VideoWrapper>
                          <UserName user={sub}></UserName>
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={4} md={4} key={i}>
                          <VideoWrapper id="video-container">
                            <UserVideo streamManager={sub} />
                          </VideoWrapper>
                          <UserName user={sub}></UserName>
                        </Grid>
                      );
                    })}
                </CusGrid>
              </GridWrapper>
              {!screenShare && <Chatting session={session}></Chatting>}
            </RoomContent>
          </>
        ) : null}
        {isConfigModalShow && OV && (
          <ConfigWrapper>
            <ToggleButtonGroup
              aria-label="user status formatting"
              value={setup}
              onChange={handleChangeSetup}
            >
              <ToggleButton
                value="camera"
                onClick={() => {
                  setCamOn(!camOn);
                }}
              >
                {camOn ? (
                  <>
                    <VideocamIcon fontSize="large" />
                    &nbsp;&nbsp;ON
                  </>
                ) : (
                  <>
                    <VideocamOffOutlinedIcon fontSize="large" />
                    &nbsp;OFF
                  </>
                )}
              </ToggleButton>
              <ToggleButton
                value="audio"
                onClick={() => {
                  setMicOn(!micOn);
                }}
              >
                {micOn ? (
                  <>
                    <MicIcon fontSize="large" />
                    &nbsp;&nbsp;ON
                  </>
                ) : (
                  <>
                    <MicOffOutlinedIcon fontSize="large" />
                    &nbsp;OFF
                  </>
                )}
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
          </ConfigWrapper>
        )}
      </RoomWrapper>
    </SnackbarProvider>
  );
}

meetingDetail.getInitialProps = async (ctx) => {
  const pathname = ctx.pathname;

  return { pathname };
};

export default function meetingDetail() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MeetingDetail />
    </SnackbarProvider>
  );
}
