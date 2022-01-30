import "../styles/app.css";
import "../styles/globals.css";
import { wrapper, persistedReducer } from "../store";
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// import { Container } from "next/app";
import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import Button from '@mui/material/Button';
import Cookies from "universal-cookie";

import styled from "@emotion/styled";

const styles = {
  layout: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  header: {
    color: "white",
    backgroundColor: "#A2C2DC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
  },
  headerContent: {
    textAlign: "center",
  },
  headerLink: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    marginRight: "10px",
    color: "black",
  },
  main: {
    flex: 1,
    minHeight: "100vh",
  },
  footer: {
    color: "white",
    backgroundColor: "#A2C2DC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: "10px",
    padding: "10px",
  },
};

function MyApp({ Component, pageProps }) {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  let [isLogin, setIsLogin] = useState(false);
  let [userId, setUserId] = useState(null);
  let [nickname, setNickname] = useState(null);

  const cookies = new Cookies();

  useEffect(() => {
    const userNickname = sessionStorage.getItem("nickname")
    if (cookies.get("userToken")!='' && userNickname != null) {
      setIsLogin(true);
      setNickname(userNickname)
    }
  }, [isLogin, nickname]);
  
  return (
    // PersistGate : state를 조회한 후 리덕스에 저장할 때까지 웹 어플리케이션의 UI가 렌더링되는 것을 지연시킴
    <PersistGate persistor={persistor} loading={<div>loading...</div>}>
      {
        (pageProps && pageProps.pathname) === '/meeting/[id]'? (
            <React.Fragment>

              <Head>    
                <title>싸피사만코</title>
                <meta name="viewport" content="viewport-fit=cover" />
              </Head>
              
              <div style={styles.layout}>
                
                <main style={{backgroundColor: "gray"}}>
                  <Component {...pageProps} /> 
                </main>
                {/* pageProps.pathname === '/meeting/[id]' 일 때는 Layout 없이 렌더링 */}
              </div>
            </React.Fragment>
        ) 
        : 
          <React.Fragment>
            <Head>
              <title>싸피사만코</title>
              <meta name="viewport" content="viewport-fit=cover" />
            </Head>
            <div style={styles.layout}>
              <header style={styles.header}>
                <HeaderLink isLogin={isLogin} userId={userId}></HeaderLink>
              </header>
              <main style={styles.main}>
                <Component {...pageProps} />
              </main>
              <footer style={styles.footer}>
                footer
              </footer>
            </div>
          </React.Fragment>
    }
    </PersistGate>
  );

  function HeaderLink(props) {
    
  const UserSpan = styled.span`
    color: black;
    margin-right: 5px;
    background-color: white;
    padding: 5px;
    border-radius: 5px;
  `
    return (
      <div style={styles.headerLink}>
        <Link href="/">
          <img src="/images/main-logo-black.png" height="30px"></img>
        </Link>
        <div>
          {props.isLogin ? (
            <>
              <UserSpan>{nickname}님, 안녕하세요</UserSpan>
              <Link href="/myinfo" className="site-nav-item" style={styles.link}>
                마이페이지
              </Link>
              <span
                style={styles.link}
                onClick={() => {
                  alert("로그아웃 되었습니다.");
                  sessionStorage.clear();
                  cookies.set("userToken", "");
                  setIsLogin(false);
                  setUserId(null);
                  window.location.replace("/")
                }}
                className="site-nav-item"
              >
                로그아웃
              </span>
            </>
          ) : (
            <>
              <span className="site-nav-item" style={styles.link}>
                <Link href="/login">
                  로그인
                </Link>
              </span>
              <span className="site-nav-item" style={styles.link}>    
                <Link href="/regist" >
                  회원가입
                </Link>
              </span>  
            </>
          )}
        </div>
      </div>
    );
  }
}

export default wrapper.withRedux(MyApp);
