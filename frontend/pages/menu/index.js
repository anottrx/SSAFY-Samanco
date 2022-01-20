import Link from "next/link";
import styles from "../../styles/Menu.module.css";
import React, { useState, useEffect } from "react";

const menu = () => {
  let [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(sessionStorage.getItem("userId"));
  }, [userId]);

  return (
    <div className={styles.menus}>
      <Link href="/">
        <a className={styles.link}>메인</a>
      </Link>
      <Link href="/project">
        <a className={styles.link}>프로젝트</a>
      </Link>
      <Link href="/study">
        <a className={styles.link}>스터디</a>
      </Link>
      <Link href="/meeting">
        <a className={styles.link}>미팅룸</a>
      </Link>
      <Link href="/board">
        <a className={styles.link}>게시판</a>
      </Link>
      {userId === "admin" ? <Link href="/"><a className={styles.link}>회원관리</a></Link> :null}
    </div>
  );
};

export default menu;
