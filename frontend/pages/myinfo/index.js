import React, { useState, useEffect } from 'react';
import MyInfo from '../../components/User/MyInfo';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import Swal from 'sweetalert2';

export default function MyInfoPage() {
  useEffect(() => {
    document.title = '내정보 | 싸피사만코';

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

  return (
    <>
      <MyInfoLayout>
        <MyInfo />
      </MyInfoLayout>
    </>
  );
}