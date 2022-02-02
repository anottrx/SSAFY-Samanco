import React, { useState, useEffect } from "react";
import ResetPassword from "../../components/User/ResetPassword";
import Router from "next/router";
import MyInfoLayout from "../../components/User/MenuLayout";

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = "비밀번호 재설정 | 싸피사만코";

    if (!sessionStorage.getItem("userId")) {
      alert("로그인하신 뒤에 사용가능합니다");
      Router.push("/login");
    }
  }, []);

  return (
    <>
      <MyInfoLayout>
        <h1>비밀번호 재설정</h1>
        <ResetPassword />
      </MyInfoLayout>
    </>
  );
}
