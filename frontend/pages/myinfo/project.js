import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import MyClub from '../../components/Club/MyClub';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import { getProjectById } from '../api/project';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function MyProjectPage() {
  const userDetail = useSelector(({ user }) => user.userDetail);

  useEffect(() => {
    document.title = '내 프로젝트 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
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
  }, []);

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
    cookies.set('projectDday', 'closed', {
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });
  }

  useEffect(() => {
    if (cookies.get('projectDday')) {
      isPopShow(false);
    } else {
      if (userDetail.projectJoinStatus == 'OK') {
        getProjectById({
          projectId: userDetail.projectId,
          userId: userDetail.id,
          addHit: '1',
        }).then((res) => {
          let date = new Date();
          let year = date.getFullYear();
          let month = ('0' + (1 + date.getMonth())).slice(-2);
          let day = ('0' + date.getDate()).slice(-2);
          let today = year + '-' + month + '-' + day;
          if (res.project.startDate == today) {
            isPopShow(true);
          }
        });
      }
    }
  }, []);

  return (
    <>
      <MyInfoLayout>
        <h1>내 프로젝트</h1>
        {popShow && (
          <ClubInfo
            onClick={() => {
              setCookie();
              isPopShow(false);
            }}
          >
            <CampaignIcon />
            <span>프로젝트 시작일입니다! </span>
            <CloseIcon className="popCloseBtn" />
          </ClubInfo>
        )}
        <MyClub label="" from="project" myinfo="myinfo" />
      </MyInfoLayout>
    </>
  );
}
