import React, { useState } from "react";
import userData from "../../data/userData.json";

export default function UserInfo() {
  const userNumber = 1;

  const {
    nickname,
    stacks,
    position,
    link,
    description,
    image_id,
  } = userData[userNumber];

  return (
    <>
      <div>
        <h1>{nickname}님의 정보</h1>
        <div className="mb-6">
          <label>닉네임</label>
          <label>{nickname}</label>
        </div>
        <div className="mb-6">
          <label>분야</label>
          <label>{position}</label>
        </div>
        <div className="mb-6">
          <label>링크</label>
          <label>link</label>
        </div>
        <div className="mb-6">
          <label>스택</label>
          {/* {stacks.map((item) => {
            if (item.HTML > 0) {
              console.log("dd")
            }
          })} */}
        </div>
        <div className="mb-6">
          <label>자기소개</label>
          {/* <TextField
            id="outlined-textarea"
            fullWidth
            rows={4}
            multiline
            value={inputState.description} */}
        </div>
        <div className="mb-6">
          <label>이미지</label>
          <label>{image_id}</label>
        </div>
      </div>
    </>
  );
}
