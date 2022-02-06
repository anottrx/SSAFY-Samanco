import React, { useState, useEffect } from "react";
import { getUserInfoAPI } from "../../pages/api/user";
import { TextField } from "@mui/icons-material";
import StackLevelList from "../Common/Stack/StackLevelList";
import LinkList from "../Common/LinkList";

export default function UserInfoPage() {
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
  const [links, setLinks] = useState([]);

  async function getUserInfo() {
    getUserInfoAPI(sessionStorage.getItem("userInfo")).then((res) => {
      console.log("res: " + JSON.stringify(res));
      if (res.statusCode == 200) {
      } else {
        // alert(`${res.userId}`);
      }
      userValue.userId = sessionStorage.getItem("userInfo");
      userValue.nickname = res.user.nickname;
      userValue.position = res.user.position;
      userValue.link = res.user.link;
      userValue.description = res.user.description;
      userValue.stacks = res.user.stacks;
      // setLinks(userValue.link.split(" "));
      // userValue.image_id = res.user.image_id;

      if (userValue.nickname != "") {
        setLoading(true);
        console.log(JSON.stringify(userValue.stacks));
        console.log(JSON.stringify(userValue));
        console.log(loading);
      }
    });
  }

  useEffect(() => {
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
              <LinkList items={links} />
              {/* <label>{userValue.link || ""}</label> */}
              {/* <div>
                {links.map((item, index) => {
                  return (
                    <a href={item} target="_blank" key={index}>
                      {item}&nbsp; 
                    </a>
                  );
                })}
              </div> */}
            </div>
            <div className="mb-6">
              <label>스택</label>
              <StackLevelList items={userValue.stacks} />
            </div>
            <div className="mb-6">
              <label>자기소개</label>
              <label>{userValue.description || ""}</label>
              {/* <TextField
                id="outlined-textarea"
                fullWidth
                rows={4}
                multiline
                value={userValue.description|| ""} 
                /> */}
            </div>
            <div className="mb-6">
              <label>이미지</label>
              {/* <label>{userValue.image_id || ""}</label> */}
            </div>{" "}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
