import { Skeleton, Grid, Card, Fab, Box } from '@mui/material';
import styled from '@emotion/styled';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import IosShareIcon from '@mui/icons-material/IosShare';

function User() {
  const VideoWrapper = styled(Skeleton)`
    min-width: 200px;
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
      transform: translate(0px, -70px);
      padding: 0px 5px;
    }
  `;

  // 미팅룸 최대 인원은 6명으로? -> 얘기해보기
  let userList = [0, 0, 0];

  return (
    <GridWrapper>
      <CusGrid container>
        {userList.length > 4
          ? userList.map((user, index) => {
              return (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <VideoWrapper height={350}></VideoWrapper>
                  <UserName></UserName>
                </Grid>
              );
            })
          : userList.map((user, index) => {
              return (
                <Grid item xs={12} sm={10} md={6} key={index}>
                  <VideoWrapper height={350}></VideoWrapper>
                  <UserName></UserName>
                </Grid>
              );
            })}
      </CusGrid>
      <Operation></Operation>
    </GridWrapper>
  );
}

function UserName() {
  const NameWrapper = styled.div`
    transform: translate(10px, -90px);
  `;

  return <NameWrapper>닉네임</NameWrapper>;
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
