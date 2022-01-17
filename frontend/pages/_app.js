import "../styles/app.css";
import "../styles/globals.css";

// import { Container } from "next/app";
import Head from "next/head";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import Router from "next/router";

const styles = {
  layout: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  header: {
    color: "white",
    backgroundColor: "black",
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
    alignItems: "center"
  },
  link: {
    marginRight: "10px"
  },
  main: {
    flex: 1,
    minHeight: "100vh",
  },
  footer: {
    color: "white",
    backgroundColor: "black",
  },
};


function MyApp({ Component, pageProps }) {
  let [isLogin, setIsLogin] = useState(false);
  let [userId, setUserId] = useState(null);

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("userToken"));
    setUserId(sessionStorage.getItem("userId"));
  }, [isLogin, userId])

  return (
    <div>
      <Head>
        <title>Static Website</title>
      </Head>
      <div style={styles.layout}>
        <header style={styles.header}>
          <HeaderLink isLogin={isLogin} userId={userId}></HeaderLink>
        </header>
        <main style={styles.main}>
          <Component {...pageProps} />
        </main>
        <footer style={styles.footer}>Footer</footer>
      </div>
    </div>
  );

  function HeaderLink(props) {
    return (
      <div style={styles.headerLink}>
        <Link href="/"><img src="/images/main-logo.png" height="30px"></img></Link>
        <div>

        {props.isLogin?
          <>
              <span className='mr-5'>{props.userId}님, 안녕하세요</span>
              <Link href="/" className="site-nav-item"  style={styles.link}>마이페이지</Link>
              <span style={styles.link} onClick={()=>{
                alert("로그아웃 되었습니다."); 
                sessionStorage.clear(); 
                Router.push("/"); 
                setIsLogin(false);
                setUserId(null);
                }} className="site-nav-item" >로그아웃</span>
          </>
          :
          <>
              <Link href="/login" style={styles.link}>로그인</Link>
              <Link href="/regist" style={styles.link}>회원가입</Link>
          </>
          }
        </div>
      </div>
    );
  }
}

export default MyApp;
