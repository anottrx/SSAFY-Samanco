import Layout from '../../components/Layout';
import ItemList from '../../components/Club/ItemList';
import SearchBar from '../../components/Common/Search';
import StackTagList from '../../components/Club/StackTagList';
import Carousel from '../../components/Club/Carousel';
import MyClub from '../../components/Club/MyClub';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloseIcon from '@mui/icons-material/Close';

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';

import { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function Project() {
  const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: flex-start;
    align-items: center;
    text-align: left;

    // & nav.MuiPagination-root.MuiPagination-text {
    //   width: 100%;
    //   max-width: 1640px;
    // }

    // & .css-wjh20t-MuiPagination-ul {
    //   align-items: center;
    // }
  `;

  const ProjectActions = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `;

  const CusButton = styled(Button)`
    height: fit-content;
  `;

  const CusDivider = styled(Divider)`
    margin: 20px 0px;
  `;

  const InfoWrapper = styled.div`
    display: flex;
  `;

  const ClubInfo = styled(Card)`
    background-color: #a2c2dc;
    color: black;
    float: right;
    position: absolute;
    padding: 10px;
    font-size: 14px;
    transform: translate(calc(100vw - 400px), -50px);

    & span {
      margin-left: 5px;
    }

    & .border {
      font-weight: bolder;
    }

    & .popCloseBtn {
      cursor: pointer;
      margin-left: 10px;
    }
  `;

  const [popShow, isPopShow] = useState(false);

  function setCookie() {
    cookies.set('projectNotice', 'closed', {
      path: '/',
      expires: new Date(
        Date.now() + 60 * 60 * 24 * 1000 * 3 //3일
      ),
    });
  }

  useEffect(() => {
    if (cookies.get('projectNotice')) {
      isPopShow(false);
    } else {
      isPopShow(true);
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>프로젝트 | 싸피사만코</title>
      </Head>
      {popShow && (
        <ClubInfo
          onClick={() => {
            setCookie();
            isPopShow(false);
          }}
        >
          <CampaignIcon />
          <span>
            유저 당<span className="border">하나의 프로젝트</span>만 가입할 수
            있습니다.
          </span>
          <CloseIcon className="popCloseBtn" />
        </ClubInfo>
      )}

      <h1 style={{ marginTop: '20px' }}>프로젝트</h1>
      <ItemWrapper>
        <MyClub label="내 프로젝트" from="project"></MyClub>
        <ProjectActions>
          <SearchBar target="project"></SearchBar>
          <CusButton
            variant="outlined"
            size="medium"
            onClick={() => {
              if (sessionStorage.getItem('userId'))
                Router.push('/project/regist');
              else {
                // alert('로그인이 필요한 작업입니다.');
                // Router.push('/login');
                Swal.fire({
                  title: '로그인이 필요한 작업입니다.',
                  text: '로그인 페이지로 이동합니다.',
                  icon: 'warning',
                  showConfirmButton: false,
                  timer: 800,
                }).then(() => {
                  Router.push('/login');
                });
              }
            }}
          >
            등록하기
          </CusButton>
        </ProjectActions>
        <StackTagList from="project"></StackTagList>
        <ItemList from="project"></ItemList>
      </ItemWrapper>

      <CusDivider variant="middle" />

      <Carousel
        label="곧 마감 되는 프로젝트"
        target="project"
        subject="deadline"
      ></Carousel>
      <Carousel
        label="인기 많은 프로젝트"
        target="project"
        subject="likes"
      ></Carousel>
    </Layout>
  );
}
