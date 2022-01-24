import React, { useState, useEffect } from "react";
import Router from "next/router";

export default function MyInfoStudyPage() {
  
  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("로그인하신 뒤에 사용가능합니다");
      Router.push("/login");
    }
  }, []);

  return (
    <>
      <h1>내 스터디</h1>
    </>
  );
}
