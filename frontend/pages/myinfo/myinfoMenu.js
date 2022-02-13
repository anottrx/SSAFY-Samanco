import Link from 'next/link';
import styles from '../../styles/Menu.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MyInfoMenu = () => {
  const { pathname } = useRouter(); // pathname: 현재 path

  let links = [
    { path: '/', label: '메인', name: '/myinfo/main' },
    { path: '/myinfo', label: '마이페이지', name: '/myinfo' },
    {
      path: '/myinfo/project',
      label: '내 프로젝트',
      name: '/myinfo/project',
    },
    {
      path: '/myinfo/study',
      label: '내 스터디',
      name: '/myinfo/study',
    },
    {
      path: '/myinfo/board',
      label: '내 게시글',
      name: '/myinfo/board',
    },
    {
      path: '/myinfo/password',
      label: '비밀번호 재설정',
      name: '/myinfo/password',
    },
  ];

  const onMouseOver = (e) => {
    e.target.style.color = 'black';
  };
  const onMouseOut = (e) => {
    e.target.style.color = 'black';
  };

  return (
    <div className={styles.menus}>
      {links.map((link, index) => {
        return (
          <Link href={link.path} key={index}>
            {pathname.split('/')[2] === link.name.split('/')[2] ? (
              <a
                className={styles.link}
                style={{
                  fontWeight: 'bolder',
                }}
              >
                {link.label}
              </a>
            ) : (
              <a
                className={styles.link}
                style={{
                  color: 'black',
                }}
                // onMouseEnter={(e) => {
                //   onMouseOver(e);
                // }}
                // onMouseOut={(e) => {
                //   onMouseOut(e);
                // }}
              >
                {link.label}
              </a>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MyInfoMenu;
