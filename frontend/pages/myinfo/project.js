import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import MyClub from '../../components/Club/MyClub';

export default function MyProjectPage() {
  useEffect(() => {
    document.title = '내 프로젝트 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
      alert('로그인하신 뒤에 사용가능합니다');
      Router.push('/login');
    }
  }, []);

  return (
    <>
      <MyInfoLayout>
        {/* <h1>내 클럽</h1> */}
        <MyClub label="내 프로젝트" from="study" />
      </MyInfoLayout>
    </>
  );
}
