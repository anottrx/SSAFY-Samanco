import React, { useState, useEffect } from "react";
import { getUserInfoAPI } from "../../pages/api/user";
import { TextField } from "@mui/icons-material";

export default function UserInfo() {
  const [userValue, setUserValue] = useState({
    userId: "",
    nickname: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
  });
  const [loading, setLoading] = useState(false);

  async function getUserInfo() {
    getUserInfoAPI(userValue.userId).then((res) => {
      console.log("res: " + JSON.stringify(res));
      if (res.statusCode == 200) {
      } else {
        // alert(`${res.userId}`);
      }

      userValue.nickname = res.user.nickname;
      userValue.position = res.user.position;
      userValue.link = res.user.link;
      userValue.description = res.user.description;
      // userValue.stacks = res.user.stacks;
      // userValue.image_id = res.user.image_id;

      if (userValue.nickname != "") {
        setLoading(true);

        console.log(JSON.stringify(userValue));
        console.log(loading);
      }
    });
  }

  useEffect(() => {
    userValue.userId = 49;
    getUserInfo();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <div>
            <h1>{userValue.nickname}님의 정보</h1>
            <div className="mb-6">
              <label>닉네임</label>
              <label>{userValue.nickname || ""}</label>
            </div>
            <div className="mb-6">
              <label>분야</label>
              <label>{userValue.position || ""}</label>
            </div>
            <div className="mb-6">
              <label>링크</label>
              <label>{userValue.link || ""}</label>
            </div>
            <div className="mb-6">
              <label>스택</label>
              <label>{userValue.stacks || ""}</label>
              {/* {stacks.map((item) => {
            if (item.HTML > 0) {
              console.log("dd")
            }
          })} */}
            </div>
            <div className="mb-6">
              <label>자기소개</label>
              <label>{userValue.description || ""}</label>
              {/* <TextField
            id="outlined-textarea"
            fullWidth
            rows={4}
            multiline
            value={inputState.description} */}
            </div>
            <div className="mb-6">
              <label>이미지</label>
              <label>{userValue.image_id || ""}</label>
            </div>{" "}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
