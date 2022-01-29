import Admin from "../../components/User/AdminPage";
import React, { useEffect } from "react";
import Router from "next/router";
import { useCookies } from "react-cookie";

export default function AdminPage() {
  useEffect(() => {
    if (
      sessionStorage.getItem("nickname") != "admin" &&
      sessionStorage.getItem("nickname") != "관리자"
    ) {
      alert("접근 권한이 없습니다");
      Router.push("/");
    }
  }, []);

  return <Admin />;
}
