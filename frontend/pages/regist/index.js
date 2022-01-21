import React, { useEffect } from "react";
import Router from "next/router";
import Regist from "../../components/User/Regist";

export default function RegistPage() {
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <Regist />;
}
