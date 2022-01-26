import React, { useState, useEffect } from "react";
import { getUserInfoAPI } from "../../pages/api/user";
import { TextField } from "@mui/icons-material";

export default function UserInfo() {
  const [userValue, setUserValue] = useState({
    userId: 33,
    nickname: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
  });

  useEffect(() => {
    async function getUserInfo() {
      getUserInfoAPI(userValue.userId).then((res) => {
        // console.log("res: " + res);
        if (res.statusCode == 200) {
        } else {
          alert(`${res.userId}`);
        }

        setUserValue({
          userId: res.userId,
          nickname: res.nickname,
          stacks: res.stacks,
          position: res.position,
          link: res.link,
          description: res.description,
          image_id: res.image_id,
        });
      });
    }

    getUserInfo();
  }, []);

  return (
    <>
      <div>
        <h1>{userValue.nickname}님의 정보</h1>
        <div className="mb-6">
          <label>닉네임</label>
          <label>{userValue.nickname}</label>
        </div>
        <div className="mb-6">
          <label>분야</label>
          <label>{userValue.position}</label>
        </div>
        <div className="mb-6">
          <label>링크</label>
          <label>{userValue.link}</label>
        </div>
        <div className="mb-6">
          <label>스택</label>
          <label>{userValue.stacks}</label>
          {/* {stacks.map((item) => {
            if (item.HTML > 0) {
              console.log("dd")
            }
          })} */}
        </div>
        <div className="mb-6">
          <label>자기소개</label>
          <label>{userValue.description}</label>
          {/* <TextField
            id="outlined-textarea"
            fullWidth
            rows={4}
            multiline
            value={inputState.description} */}
        </div>
        <div className="mb-6">
          <label>이미지</label>
          <label>{userValue.image_id}</label>
        </div>
      </div>
    </>
  );
}
