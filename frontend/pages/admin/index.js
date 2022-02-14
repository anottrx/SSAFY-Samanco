import AdminList from '../../components/User/AdminList';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = '회원 관리 | 싸피사만코';

    if (sessionStorage.getItem('nickname') === 'admin') {
      setIsAdmin(true);
    } else {
      window.history.forward();
      // alert('접근 권한이 없습니다');
      Swal.fire({
        title: '접근 권한이 없습니다.',
        text: '메인페이지로 이동합니다.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 800,
      }).then(() => {
        // Router.push('/login');
        window.location.replace('/');
      });
      // Router.push('/');
    }
  }, []);

  return (
    <Layout>
      {isAdmin ? (
        <>
          <h1 style={{ margin: '20px 0px 30px 0px' }}>회원 관리</h1>
          <AdminList />
        </>
      ) : (
        <></>
      )}
    </Layout>
  );
}
