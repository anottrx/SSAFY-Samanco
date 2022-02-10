import { useState, useEffect } from 'react';
import { Skeleton, Grid, Card, Fab, Box } from '@mui/material';
import styled from '@emotion/styled';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import UserVideo from './UserVideo';

function User({ publisher, subscribers }) {
  let [users, setUsers] = useState(
    subscribers ? [publisher, ...subscribers] : [publisher]
  );

  const [videoStatus, setVideoStatus] = useState(
    publisher?.properties?.publishVideo
  );
  const [audioStatus, setAudioStatus] = useState(
    publisher?.properties?.publishAudio
  );

  function changeVideo(value) {
    publisher.publishVideo(value);
  }

  function changeAudio(value) {
    publisher.publishAudio(value);
  }

  useEffect(() => {
    // if (subscribers !== undefined) {
    //   let newArray = [publisher].concat(subscribers);
    //   setUsers(newArray);
    // }

    return () => {
      setUsers([]);
    };
  }, []);

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

  return (
    <GridWrapper>
      <CusGrid container>
        {users.length > 4
          ? users.map((user, index) => {
              return (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <VideoWrapper id="video-container">
                    <UserVideo streamManager={user}></UserVideo>
                  </VideoWrapper>
                  {/* <VideoWrapper height={350}></VideoWrapper> */}
                  <UserName user={user}></UserName>
                </Grid>
              );
            })
          : users.map((user, index) => {
              return (
                <Grid item xs={12} sm={10} md={6} key={index}>
                  <VideoWrapper>
                    <UserVideo streamManager={user}></UserVideo>
                  </VideoWrapper>
                  {/* <VideoWrapper height={350}></VideoWrapper> */}
                  <UserName user={user}></UserName>
                </Grid>
              );
            })}
      </CusGrid>
      <Operation
        videoStatus={videoStatus}
        setVideoStatus={setVideoStatus}
        audioStatus={audioStatus}
        setAudioStatus={setAudioStatus}
        changeVideo={changeVideo}
        changeAudio={changeAudio}
      ></Operation>
    </GridWrapper>
  );
}

function UserName({ user }) {
  const NameWrapper = styled.div`
    transform: translate(10px, -160px);
    background-color: white;
    width: fit-content;
    padding: 5px;
  `;

  const [name, setName] = useState('...loading');
  useEffect(() => {
    if (user && user.stream && user.stream.connection)
      setName(JSON.parse(user.stream.connection.data).clientData);
    else setName('...loading');
  }, [user]);

  return <NameWrapper>{name}</NameWrapper>;
}

function Operation({
  videoStatus,
  setVideoStatus,
  audioStatus,
  setAudioStatus,
  changeVideo,
  changeAudio,
}) {
  const OperWrapper = styled.div`
    float: left;
  `;

  // useEffect(() => {
  //   console.log('재렌더링');
  //   console.log('video:', videoStatus, 'audio:', audioStatus);
  // }, [videoStatus, audioStatus]);

  return (
    <OperWrapper>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        {videoStatus ? (
          <Fab
            color="primary"
            variant="extended"
            aria-label="add"
            onClick={() => {
              setVideoStatus(false); // 버튼
              changeVideo(false); // 상태 변경
            }}
          >
            <VideocamIcon fontSize="large" />
          </Fab>
        ) : (
          <Fab
            variant="extended"
            aria-label="add"
            onClick={() => {
              setVideoStatus(true);
              changeVideo(true);
            }}
          >
            <VideocamOffOutlinedIcon fontSize="large" />
          </Fab>
        )}
        {audioStatus ? (
          <Fab
            color="primary"
            variant="extended"
            aria-label="edit"
            onClick={() => {
              setAudioStatus(false);
              changeAudio(false);
              // publisher.properties.publishVideo = false;
            }}
          >
            <MicIcon fontSize="large" />
          </Fab>
        ) : (
          <Fab
            variant="extended"
            aria-label="edit"
            onClick={() => {
              setAudioStatus(true);
              changeAudio(true);

              // publisher.properties.publishVideo = false;
            }}
          >
            <MicOffOutlinedIcon fontSize="large" />
          </Fab>
        )}
        <Fab variant="extended" aria-label="edit">
          <IosShareIcon fontSize="large" />
        </Fab>
      </Box>
    </OperWrapper>
  );
}

export default User;
