import Link from "next/link";
import styles from "../../styles/Menu.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const MyInfoMenu = () => {
  const { pathname } = useRouter(); // pathname: 현재 path

  let links = [
    { path: "/", label: "메인", name: "/myinfo/main" },
    { path: "/myinfo", label: "내 정보", name: "/myinfo" },
    { path: "/myinfo/pw", label: "비밀번호 재설정", name: "/myinfo/pw" },
  ];

  const onMouseOver = (e) => {
    e.target.style.color = "black";
  };

  const onMouseOut = (e) => {
    e.target.style.color = "#666666";
  };

  return (
    <div className={styles.menus}>
      {links.map((link, index) => {
        return (
          <Link href={link.path} key={index}>
            {pathname.split("/")[2] === link.name.split("/")[2] ? (
              <a
                className={styles.link}
                style={{
                  fontWeight: "bolder",
                }}
              >
                {link.label}|{pathname.split("/")[1]}|{link.path.split("/")[1]}
              </a>
            ) : (
              <a
                className={styles.link}
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                }}
                onMouseEnter={(e) => {
                  onMouseOver(e);
                }}
                onMouseOut={(e) => {
                  onMouseOut(e);
                }}
              >
                {link.label}|여기||{pathname.split("/")[2]}|
                {link.path.split("/")[2]}
              </a>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MyInfoMenu;
