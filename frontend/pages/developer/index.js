import Layout from '../../components/Layout';
import developerData from '../../data/developerData.json';
import developerProjectImage from '../../data/developerProjectImage.json';
import Head from 'next/head';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageButton from '../../components/Common/ImageButton';
import StackItem from '../../components/Common/Stack/item';

function developer() {
  const CusDivider = styled(Divider)`
    margin: 40px 20px 30px 20px;
  `;

  const CusAlert = styled(Alert)`
    font-size: 15px;
  `;

  return (
    <Layout>
      <Head>
        <title>만든 사람들 | 싸피사만코</title>
      </Head>
      <h1 style={{ margin: '50px 0px 10px 0px' }}>세사살</h1>
      <CusAlert severity="info">
        <div>세 명이지만 사람답게 살자!</div>
        <Accordion
          style={{ backgroundColor: '#E5F6FD', marginTop: '10px' }}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ color: '#014361' }}>
              <b>Ground Rule 💑</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>0.</b> packge.json 수정 시 알려주기
              <br />
              <b>1.</b> 스터디, 개인 일정, 취준 일정, 휴식 일정 있을 때 미리
              공유, 사과 금지
              <br />
              <b>2.</b> 진짜 잘못 했을 때는 경위서 자필로 작성
              <br />
              (과반수 이상 동의시 육하원칙에 근거하여 누가, 언제, 어디서,
              무엇을, 왜, 어떻게 앞으로의 다짐)
              <br />
              <b>3.</b> 하루에 최소 6시간 이상 자기 <br />
              <b>4.</b> 끼니 거르지 않기, 배고플때 잘 챙겨먹기
              <br />
              <b>5.</b> 하루에 10분이라도 나가기
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CusAlert>
      <br />
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
