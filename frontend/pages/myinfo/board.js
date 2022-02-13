import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyBoardList from '../../components/Board/MyBoardList';
import MyInfoLayout from '../../components/User/MenuLayout';

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = '내 게시글 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
      alert('로그인하신 뒤에 사용가능합니다');
      Router.push('/login');
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
