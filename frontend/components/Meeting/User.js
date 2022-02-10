import { useState, useEffect } from 'react';
import { Skeleton, Grid, Card, Fab, Box } from '@mui/material';
import styled from '@emotion/styled';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import IosShareIcon from '@mui/icons-material/IosShare';
import UserVideo from './UserVideo';

function User({ publisher, subscribers }) {
  let [users, setUsers] = useState([publisher, ...subscribers]);
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
              console.log('--------------user', user);
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
      <Operation></Operation>
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
    if (user.stream && user.stream.connection)
      setName(JSON.parse(user.stream.connection.data).clientData);
  }, [user]);

  return <NameWrapper>{name}</NameWrapper>;
}

function Operation() {
  const OperWrapper = styled.div`
    float: left;
  `;

  return (
    <OperWrapper>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" aria-label="add">
          <CameraAltIcon fontSize="large" />
        </Fab>
        <Fab variant="extended" aria-label="edit">
          <MicIcon fontSize="large" />
        </Fab>
        <Fab variant="extended" aria-label="edit">
          <IosShareIcon fontSize="large" />
        </Fab>
      </Box>
    </OperWrapper>
  );
}

export default User;
