import Login from "../../components/User/Login";
import React, { useEffect } from "react";
import Router from "next/router";

export default function LoginPage() {
  useEffect(() => {
    document.title = "로그인 | 싸피사만코";

    if (sessionStorage.getItem("userId")) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <Login />;
}
