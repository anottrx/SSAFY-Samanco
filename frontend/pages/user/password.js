import LostPassword from "../../components/User/LostPassword";
import React, { useEffect } from "react";
import Router from "next/router";

export default function FindPasswordPage() {
  
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <LostPassword />;
}
