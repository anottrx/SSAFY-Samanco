import Layout from '../../components/Layout';
import developerData from '../../data/developerData.json';
import developerProjectImage from '../../data/developerProjectImage.json';
import Head from 'next/head';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ImageButton from '../../components/Common/ImageButton';

function developer() {
  return (
    <Layout>
      <Head>
        <title>만든 사람들 | 싸피사만코</title>
      </Head>
      <h1 style={{ marginTop: '20px' }}>만든 사람들</h1>
      <Grid
        container
        maxWidth="lg"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {developerData.map((user) => {
          return (
            <Grid item xs={12} sm={6} md={6} lg={6} key={user.id}>
              <UserCard user={user}></UserCard>
            </Grid>
          );
        })}
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
  const Logo = styled.img`
    width: 100px;
  `;
  return (
    <CusCard>
      {/* <Logo src="/images/main-logo-black.png"></Logo> */}
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
  `;
  const CusImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 10%;
    border: 2px solid rgb(0 0 0 / 5%);
    margin: 0px 20px 0px 0px;
  `;
  return (
    <CusCard>
      <CusImage src={user.image}></CusImage>
      <Stack>
        <h3>{user.name}</h3>
      </Stack>
    </CusCard>
  );
}

export default developer;
