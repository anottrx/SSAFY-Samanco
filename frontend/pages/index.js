import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import styled from '@emotion/styled';

import Menu from './menu';

export default function Home() {
  const LinkImage = styled.div`
    cursor: pointer;
  `;

  return (
    <div className={styles.container}>
      <Head>
        <title>싸피사만코</title>
        <meta name="싸피사만코" content="SSAFY 교육생만을 위한 커뮤니티!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.jumbotron}>
          <h1 className={styles.title}>싸피사만코</h1>

          <p className={styles.description}>
            <code className={styles.code}>SSAFY!</code> 사이버에서 만나서
            코딩하자
          </p>
        </div>

        <div className={styles.contents}>
          <div className={styles.menus}>
            <Menu />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.description}>
            <h2>싸피사만코?</h2>
            <p>SSAFY 교육생만을 위한 커뮤니티!</p>
          </div>

          <div className={styles.grid}>
            <Link href="/project">
              <LinkImage className={styles.card}>
                <h2>프로젝트, 스터디 &rarr;</h2>
                <img src="/images/main_image1.webp" alt="main_image1"></img>
                <p>원하는 팀원을 모집할 수 있어요</p>
              </LinkImage>
            </Link>

            <Link href="/meeting">
              <LinkImage className={styles.card}>
                <h2>미팅룸 &rarr;</h2>
                <img src="/images/main_image2.webp" alt="main_image2"></img>
                <p>
                  화상 회의를 이용해
                  <br />
                  미팅을 진행할 수 있어요
                </p>
              </LinkImage>
            </Link>

            <Link href="/board">
              <LinkImage className={styles.card}>
                <h2>게시판 &rarr;</h2>
                <img src="/images/main_image3.webp" alt="main_image3"></img>
                <p>
                  시험과 취업 정보를 얻고,
                  <br />
                  익명으로 질문을 할 수 있어요
                </p>
              </LinkImage>
            </Link>
          </div>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
