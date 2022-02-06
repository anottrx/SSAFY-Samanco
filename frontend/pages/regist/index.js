import React, { useEffect } from "react";
import Router from "next/router";
import Regist from "../../components/User/Regist";
import Cookies from "universal-cookie";

export default function RegistPage() {
  const cookies = new Cookies();

  useEffect(() => {
    document.title = "회원가입 | 싸피사만코";

    if (
      cookies.get("userToken") != "" &&
      !sessionStorage.getItem("nickname") &&
      sessionStorage.getItem("nickname") != "undefined"
    ) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <Regist />;
}
