import React, { useState, useEffect } from "react";
import userData from "../../data/userData.json";
import Router from "next/router";
import Cookies from "universal-cookie";
import { deleteUserAPI } from "../../pages/api/user";
import { Box } from "@mui/icons-material";

export default function MyInfo() {
  const {
    id,
    name,
    password,
    email,
    phone,
    nickname,
    userClass,
    birthday,
    generation,
    studentId,
    stacks,
    position,
    link,
    description,
    image_id,
  } = userData[0];

  const cookies = new Cookies();

  const handleGoUpdateClick = (event) => {
    Router.push("/");
  };

  const handleQuitClick = (event) => {
    const userId = sessionStorage.getItem("userId");
    if (window.confirm("탈퇴하시겠습니까?")) {
      // deleteUserAPI(userId).then((res) => {
      // if (res.statusCode == 200) {
      // 탈퇴 성공 시
      alert("다음에는 오프라인에서 함께 코딩해요!");
      sessionStorage.clear();
      cookies.set("userToken", "");
      cookies.set("userEmail", "");
      // 페이지 이동
      document.location.href = "/";
      // } else alert(`${res.message}`);
      // });
    } else {
      alert("좋아요! 싸피사만코와 오래오래 코딩해요!");
    }
  };

  return (
    <>
      <div>
        <h1>내정보</h1>
        <button onClick={handleGoUpdateClick}>수정하기</button>
        <div className="mb-6">
          <label className="">이메일</label>
          <text>{email}</text>
        </div>
      </div>
      <button onClick={handleQuitClick}>탈퇴하기</button>
    </>
  );
}
