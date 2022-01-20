import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "next/router";
import { useCookies } from "react-cookie";

export default function AdminPage() {
  const [cookies, setCookie] = useCookies(["userEmail"]);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(cookies.userEmail)
    if (cookies.userEmail !== "admin") {
      alert('접근 권한이 없습니다');
      Router.push("/");
    }
  }, []);

  return (
    <>
      <div>사용자 정보</div>
    </>
  );
}
