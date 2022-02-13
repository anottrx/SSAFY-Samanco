import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import MyInfoLayout from '../../components/User/MenuLayout';
import MyClub from '../../components/Club/MyClub';

export default function MyStudyPage() {
  useEffect(() => {
    document.title = '내 스터디 | 싸피사만코';

    if (!sessionStorage.getItem('userId')) {
      alert('로그인하신 뒤에 사용가능합니다');
      Router.push('/login');
    }
  }, []);

  return (
    <>
      <MyInfoLayout>
        <MyClub label="내 스터디" from="study" myinfo="myinfo"/>
      </MyInfoLayout>
    </>
  );
}
