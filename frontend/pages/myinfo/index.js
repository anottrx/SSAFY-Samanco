import React, { useState, useEffect } from "react";
import MyInfo from "../../components/User/MyInfo";
import Router from "next/router";

export default function MyInfoPage() {
  useEffect(() => {
    document.title = "내정보 | 싸피사만코";

    if (!sessionStorage.getItem("userId")) {
      alert("로그인하신 뒤에 사용가능합니다");
      Router.push("/login");
    }
  }, []);

  return (
    <>
      <MyInfo />
    </>
  );
}
