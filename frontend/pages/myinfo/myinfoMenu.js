import Link from "next/link";
import styles from "../../styles/Menu.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const MyInfoMenu = () => {
  const { pathname } = useRouter(); // pathname: 현재 path
  let [nickname, setNickname] = useState(null);

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
  }, [nickname]);

  let links = [
    { path: "/myinfo", label: "내 정보" },
    { path: "/myinfo/pw", label: "비밀번호 재설정" },
  ];

  return (
    <div className={styles.menus}>
      {links.map((link, index) => {
        return (
          <Link href={link.path} key={index}>
            {pathname.split("/")[1] === link.path.split("/")[1] ? (
              <a
                className={styles.link}
                style={{
                  fontWeight: "bolder",
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

export default MyInfoMenu;
