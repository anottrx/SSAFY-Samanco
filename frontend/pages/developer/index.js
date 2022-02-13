import Layout from '../../components/Layout';
import developerData from '../../data/developerData.json';
import Head from 'next/head';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

function developer() {
  const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
  `;

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
            <Grid item xs={12} sm={6} md={4} lg={4} key={user.id}>
              <UserCard user={user}></UserCard>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
}

function UserCard({ user }) {
  const CusCard = styled(Card)`
    padding: 10px;
    margin-bottom: 20px;
  `;
  const CusImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 100%;
  `;
  return (
    <CusCard>
      <div>{user.name}</div>
      <CusImage src={user.image}></CusImage>
    </CusCard>
  );
}

export default developer;
