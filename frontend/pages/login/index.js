import Login from '../../components/User/Login';
import React, { useEffect } from 'react';
import Router from 'next/router';
import Cookies from 'universal-cookie';

export default function LoginPage() {
  const cookies = new Cookies();

  useEffect(() => {
    document.title = '로그인 | 싸피사만코';

    if (
      cookies.get('userToken') != '' &&
      sessionStorage.getItem('nickname') != null &&
      sessionStorage.getItem('nickname') != 'undefined'
    ) {
      alert('로그인된 상태입니다');
      Router.push('/');
    }
  }, []);

  return <Login />;
}
