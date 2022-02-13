import Layout from '../../components/Layout';
import ItemList from '../../components/Club/ItemList';
import SearchBar from '../../components/Common/Search';
import StackTagList from '../../components/Club/StackTagList';
import Carousel from '../../components/Club/Carousel';
import MyClub from '../../components/Club/MyClub';

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';

// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

export default function Study() {
  const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
  `;

  const StudyActions = styled.div`
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

  // const [popShow, isPopShow] = useState(false);

  // function setCookie() {
  //   cookies.set('studyNotice', 'closed', {
  //     path: '/',
  //     expires: new Date(
  //       Date.now() + 60 * 60 * 24 * 1000 * 3 //3일
  //     ),
  //   });
  // }
  // useEffect(() => {
  //   if (cookies.get('studyNotice')) {
  //     isPopShow(false);
  //   } else {
  //     isPopShow(true);
  //   }
  // }, []);

  return (
    <Layout>
      <Head>
        <title>스터디 | 싸피사만코</title>
      </Head>
      {/* {popShow && (
        <ClubInfo
          onClick={() => {
            setCookie();
            isPopShow(false);
          }}
        >
          <CampaignIcon />
          <span>
            유저 당<span className="border">여러 개의 스터디</span>를 가입할 수
            있습니다.
          </span>
          <CloseIcon className="popCloseBtn" />
        </ClubInfo>
      )} */}
      <h1 style={{ marginTop: '20px' }}>스터디</h1>
      <ItemWrapper>
        {sessionStorage.getItem('userId') ? (
          <MyClub label="내 스터디" from="study"></MyClub>
        ) : null}
        <StudyActions>
          <SearchBar target="study"></SearchBar>
          <CusButton
            variant="outlined"
            size="medium"
            onClick={() => {
              if (sessionStorage.getItem('userId'))
                Router.push('/study/regist');
              else {
                alert('로그인이 필요한 작업입니다.');
                Router.push('/login');
              }
            }}
          >
            등록
          </CusButton>
        </StudyActions>

        <StackTagList from="study"></StackTagList>
        <ItemList from="study"></ItemList>
      </ItemWrapper>

      <CusDivider variant="middle" />

      <Carousel
        label="인기 많은 스터디"
        target="study"
        subject="deadline"
      ></Carousel>
      {/* <Carousel label="곧 마감 되는 스터디" target="study" subject="likes"></Carousel> */}
    </Layout>
  );
}
