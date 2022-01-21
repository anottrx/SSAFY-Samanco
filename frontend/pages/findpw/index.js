import FindPassword from "../../components/User/FindPw";
import React, { useState, useEffect } from "react";
import Router from "next/router";

export default function FindPWPage() {
  
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      alert("로그인된 상태입니다");
      Router.push("/");
    }
  }, []);

  return <FindPassword />;
}
