import Link from 'next/link';
import styles from '../../styles/Menu.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const menu = () => {
  const { pathname } = useRouter(); // pathname: 현재 path
  let [nickname, setNickname] = useState(null);

  useEffect(() => {
    setNickname(sessionStorage.getItem('nickname'));
  }, [nickname]);

  let links = [
    { path: '/', label: '메인' },
    { path: '/project', label: '프로젝트' },
    { path: '/study', label: '스터디' },
    { path: '/meeting', label: '미팅룸' },
    { path: '/board', label: '게시판' },
  ];

  let adminLinks = links.concat([{ path: '/admin', label: '회원관리' }]);

  return (
    <div className={styles.menus}>
      {nickname !== 'admin'
        ? links.map((link, index) => {
            return (
              <Link href={link.path} key={index}>
                {pathname.split('/')[1] === link.path.split('/')[1] ? (
                  <a
                    className={styles.link}
                    style={{
                      fontWeight: 'bolder',
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a className={styles.link}>{link.label}</a>
                )}
              </Link>
            );
          })
        : adminLinks.map((link, index) => {
            return (
              <Link href={link.path} key={index}>
                {pathname.split('/')[1] === link.path.split('/')[1] ? (
                  <a
                    className={styles.link}
                    style={{
                      fontWeight: 'bolder',
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a className={styles.link}>{link.label}</a>
                )}
              </Link>
            );
          })}
    </div>
  );
};

export default menu;
