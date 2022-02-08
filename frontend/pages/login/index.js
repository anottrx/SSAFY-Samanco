import Login from '../../components/User/Login';
import React, { useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';
import { Box, Typography } from '@mui/material';

const LinkButton = styled(Typography)`
  variant="h6"
  display="inline"
  gutterBottom
  sx={{ width: 300, fontSize: 13.5, mr: 2 }}
`;

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

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop={8}
        sx={{ flexDirection: 'column' }}
      >
        <Login />
        <div sx={{ flexDirection: 'row' }}>
          <LinkButton className="site-nav-item">
            <Link href="/user/password">비밀번호 재설정</Link>
          </LinkButton>
          <LinkButton className="site-nav-item">
            <Link href="/regist">회원가입</Link>
          </LinkButton>
        </div>
      </Box>
    </>
  );
}
