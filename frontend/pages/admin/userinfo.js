import React, { useEffect } from 'react';
import Router from 'next/router';
import Layout from '../../components/Layout';
import UserInfoPage from '../../components/User/UserInfoPage';

export default function AdminUserInfo() {
  useEffect(() => {
    if (sessionStorage.getItem('nickname') != 'admin') {
      alert('접근 권한이 없습니다');
      Router.push('/');
    }
  }, []);

  return (
    <Layout>
      <UserInfoPage />
    </Layout>
  );
}
