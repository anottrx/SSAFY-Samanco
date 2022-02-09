import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import MyClub from '../../components/User/Club';

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = '내 클럽 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
      alert('로그인하신 뒤에 사용가능합니다');
      Router.push('/login');
    }
  }, []);

  return (
    <>
      <MyInfoLayout>
        <h1>내 클럽</h1>
        <MyClub />
      </MyInfoLayout>
    </>
  );
}
