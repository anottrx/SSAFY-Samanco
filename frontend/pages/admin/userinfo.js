import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Layout from '../../components/Layout';
import UserInfoPage from '../../components/User/UserInfoPage';

export default function AdminUserInfo() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = '회원 관리 | 싸피사만코';

    if (
      sessionStorage.getItem('nickname') === 'admin' ||
      sessionStorage.getItem('nickname') === 'admin2'
    ) {
      setIsAdmin(true);
    } else {
      window.history.forward();
      alert('접근 권한이 없습니다');
      window.location.replace('/');
      // Router.push('/');
    }
  }, []);

  return (
    <Layout>
      {isAdmin ? (
        <>
          <UserInfoPage />
        </>
      ) : (
        <></>
      )}
    </Layout>
  );
}
