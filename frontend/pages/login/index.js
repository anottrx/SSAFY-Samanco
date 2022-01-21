import Login from "../../components/User/Login";
import React, { useEffect } from "react";
import Router from "next/router";

export default function LoginPage() {
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <Login />;
}
