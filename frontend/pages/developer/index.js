import Layout from '../../components/Layout';
import developerData from '../../data/developerData.json';
import developerProjectImage from '../../data/developerProjectImage.json';
import Head from 'next/head';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ImageButton from '../../components/Common/ImageButton';
import StackItem from '../../components/Common/Stack/item';

function developer() {
  const CusDivider = styled(Divider)`
    margin: 40px 20px 30px 20px;
  `;

  return (
    <Layout>
      <Head>
        <title>만든 사람들 | 싸피사만코</title>
      </Head>
      <h1 style={{ margin: '50px 0px 30px 0px' }}>만든 사람들</h1>
      <Grid
        container
        maxWidth="lg"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {developerData.map((user) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <UserCard user={user}></UserCard>
            </Grid>
          );
        })}
        <CusDivider variant="middle" />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectCard></ProjectCard>
        </Grid>
      </Grid>
    </Layout>
  );
}

function ProjectCard() {
  const CusCard = styled(Card)`
    padding: 10px;
    margin-bottom: 20px;
  `;
  return (
    <CusCard>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          minWidth: 300,
          width: '100%',
        }}
      >
        {developerProjectImage.map((image) => {
          return <ImageButton key={image.title} image={image}></ImageButton>;
        })}
      </Box>
    </CusCard>
  );
}

function UserCard({ user }) {
  const CusCard = styled(Card)`
    padding: 20px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
  `;
  const CusImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 100%;
    z-index: 1;
    // border: 2px solid rgb(0 0 0 / 5%);
    // margin-right: 20px;
    background-color: white;
    padding: 10px;
  `;
  const ImageDivider = styled(Divider)`
    transform: translate(0px, -50px);
  `;
  const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 0px;
    width: 100%;
    height: 100%;
  `;
  const CusDivider = styled(Divider)`
    margin: 20px 0px;
  `;

  return (
    <CusCard>
      <CusImage src={user.image}></CusImage>
      <ImageDivider />
      <InfoWrapper>
        <div style={{ marginBottom: '5px' }}>
          <h2
            style={{
              display: 'inline',
              padding: '1px 7px',
            }}
          >
            {user.name}
          </h2>
        </div>

        <div>
          <StackItem title={user.isLeader ? '팀장' : '팀원'}></StackItem>
          <StackItem title={user.position}></StackItem>
          <StackItem title={user.mbti}></StackItem>
        </div>

        <CusDivider />
        <div>
          <StackItem title={user.email} type="email"></StackItem>
          <br />
          <StackItem title={user.github} type="link"></StackItem>
        </div>
      </InfoWrapper>
    </CusCard>
  );
}

export default developer;
