import React, { useState, useEffect } from 'react';
import ResetPassword from '../../components/User/ResetPassword';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import Swal from 'sweetalert2';

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = '비밀번호 재설정 | 싸피사만코';

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
        <h2>비밀번호 재설정</h2>
        <ResetPassword />
      </MyInfoLayout>
    </>
  );
}
