import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import MyClub from '../../components/Club/MyClub';
import Swal from 'sweetalert2';

export default function MyStudyPage() {
  useEffect(() => {
    document.title = '내 스터디 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
      // alert('로그인하신 뒤에 사용가능합니다');
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
  }, []);

  return (
    <>
      <MyInfoLayout>
        <h1>내 스터디</h1>
        <MyClub label="" from="study" myinfo="myinfo" />
      </MyInfoLayout>
    </>
  );
}
