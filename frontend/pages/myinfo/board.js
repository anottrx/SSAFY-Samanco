import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyBoardList from '../../components/Board/MyBoardList';
import MyInfoLayout from '../../components/User/MenuLayout';
import Swal from 'sweetalert2';

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = '내 게시글 | 싸피사만코';

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
        <h2>내 게시글</h2>
        <MyBoardList tag="mylist" />
      </MyInfoLayout>
    </>
  );
}
