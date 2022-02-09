import styled from '@emotion/styled';

import Users from '../../components/Meeting/User';
import RoomInfo from '../../components/Meeting/RoomInfo';
import Chatting from '../../components/Meeting/Chatting';
import { Card, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
// import UserVideo from '../../components/Meeting/UserVideo';
import Router from 'next/router';

var OpenViduBrowser;

const OPENVIDU_SERVER_URL = 'https://i6a502.p.ssafy.io:5443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

function meetingDetail() {
  const RoomWrapper = styled(Card)`
    padding: 20px;
    margin: 10px;
    height: calc(100vh - 20px);
    overflow-y: scroll;
  `;

  const RoomContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    height: calc(100% - 100px);
  `;

  let detail = useSelector(({ meeting }) => meeting.meetingDetail);
  let publisherStatus = useSelector(({ meeting }) => meeting.publisherStatus);
  const [OV, setOV] = useState(undefined);
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(publisherStatus);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    if (detail && publisherStatus) {
      importOpenVidu().then((ob) => {
        OpenViduBrowser = ob;
        setOV(new OpenViduBrowser.OpenVidu());
      });

      return () => {
        leaveSession();
        clear();
      };
    }
  }, [detail, publisherStatus]);

  useEffect(() => {
    if (OV) {
      setSession(OV.initSession());
    }
  }, [OV]);

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
      // sub : 새로운 스트림 / subs : 기존 참여자들
      let subs = subscribers;
      subs.push(sub);
      setSubscribers([...subs]);
      console.log('streamCreated', subscribers);
    });

    // 어떤 스트림이 없어지면
    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
      console.log('streamDestroyed');
    });

    // 예외가 발생하면
    mySession.on('exception', (exception) => {
      if (exception.name === 'ICE_CONNECTION_DISCONNECTED') {
        deleteSubscriber(exception.origin.streamManager);
      } else {
        console.warn(exception);
      }
    });

    // 스트림 속성이 변경되면
    mySession.on('streamPropertyChanged', () => {
      const subs = subscribers;
      setSubscribers([...subs]);
      console.log('streamPropertyChanged', subscribers);
    });

    getToken()
      .then((token) => {
        console.log('getToken:', token);
        mySession
          .connect(token, { clientData: sessionStorage.getItem('nickname') })
          .then(() => {
            if (!OV) return;
            let pub = OV.initPublisher('', { ...publisherStatus.properties });

            mySession.publish(pub).then(() => {
              setPublisher(pub);
            });
          });
      })
      .catch((error) => {
        console.error(
          'There was an error connecting to the session:',
          error.code,
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
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }
  };

  const getToken = () => {
    let mySessionId = `session${detail.no}`;
    console.log('getToken:', mySessionId);
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

  const createSession = (sessionId) => {
    console.log('createSession:', sessionId);
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
          console.log('CREATE SESSION', response);
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
    console.log('createToken', sessionId);
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

  const exitClick = () => {
    videoTrackOff(publisher);
    leaveSession();
    clear();
    Router.replace('/meeting');
  };

  return (
    <RoomWrapper>
      <RoomInfo detail={detail} exitClick={exitClick}></RoomInfo>
      <Divider />
      <RoomContent>
        {/* {session !== undefined && (
          <>
            {publisher !== undefined && (
              <div>
                <UserVideo streamManager={publisher}></UserVideo>
              </div>
            )}
            {subscribers.map((sub, idx) => {
              <div key={idx}>
                <UserVideo streamManager={sub}></UserVideo>
              </div>;
            })}
          </>
        )} */}
        <Users
          publisher={publisher}
          subscribers={subscribers}
          nickname={detail.nickname}
        ></Users>
        <Chatting></Chatting>
      </RoomContent>
    </RoomWrapper>
  );
}

meetingDetail.getInitialProps = async (ctx) => {
  const pathname = ctx.pathname;

  return { pathname };
};

export default meetingDetail;
