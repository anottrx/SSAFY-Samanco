import Link from "next/link";
import styles from "../../styles/Menu.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

const menu = () => {
  const { asPath } = useRouter(); // asPath: 현재 path 
  let [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(sessionStorage.getItem("userId"));
  }, [userId]);

  let links = [
    {path:"/", label:"메인"},
    {path:"/project", label:"프로젝트"},
    {path:"/study", label:"스터디"},
    {path:"/meeting", label:"미팅룸"},
    {path:"/board", label:"게시판"}
  ]


  return (
    <div className={styles.menus}>
      {
        links.map((link, index) => {
          return(
            <Link href={link.path} key={index}>
              {
                asPath.split("/")[1] === link.path.split("/")[1]?
                <a className={styles.link} style={{
                  fontWeight: "bolder"
                }}>{link.label}</a>
                :
                <a className={styles.link}>{link.label}</a>
              }
            </Link>
          )
        })
      }
      
      {/* <Link href="/project">
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
      </Link> */}
      {userId === "admin" ? <Link href="/admin"><a className={styles.link}>회원관리</a></Link> :null}
    </div>
  );
};

export default menu;
