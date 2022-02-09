import styled from '@emotion/styled';
import {
  TextField,
  FormGroup,
  FormControl,
  Button,
  Box,
  Form,
} from '@mui/material';
import { useRef, useEffect, useState } from 'react';

const ChattingWrapper = styled.div`
  font: 13px Helvetica, Arial;
  min-width: 300px;
  min-height: calc(100% - 35px);
  border: 1px solid gray;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: space-between;
  overflow-y: scroll;

  .messages {
    padding: 10px 5px;
    overflow-y: scroll;
    height: 100%;
  }

  & .otherMessageWrapper {
    text-align: left;
    margin-bottom: 15px;
  }

  & .otherMessage,
  .myMessage {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
  }

  & .nickName {
    font-weight: bolder;
    margin-right: 10px;
  }

  & .myMessageWrapper {
    text-align: right;
    margin-bottom: 15px;
  }
`;
const MyChattingWrapper = styled.div`
    font: 13px Helvetica, Arial;
    fullWidth;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    `;

function Chatting() {
  let index = [0, 0, 0, 0, 0, 0, 0, 0];
  const scrollEl = useRef(null);

  const scrollToBottom = () => {
    scrollEl.current?.scrollIntoView({
      // behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  };

  useEffect(() => {
    scrollToBottom();
  });

  const [chatHistory, setChatHistory] = useState([]);
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState({
    text: '',
    nickname: '',
    time: '',
  });

  const submitChatHandle = (event) => {
    event.preventDefault();
    if(chatText.length>0) {
      chat.text = chatText;
      chat.nickname = sessionStorage.getItem('nickname');
      chat.time = new Date().getTime();
      chatHistory.push(chat);
      console.log(chatHistory);
      setChatText('');
      setChat([]);
    }
  };

  return (
    <ChattingWrapper>
      <div className="messages" ref={scrollEl}>
        {chatHistory.map((idx) => {
          if (idx.nickname == sessionStorage.getItem('nickname')) {
            return (
              <>
                <div className="myMessageWrapper" key="message">
                  <span className="nickName">{idx.nickname}</span>
                  <span className="myMessage">{idx.text}</span>
                </div>
              </>
            );
          } else {
            return (
              <>
                <div className="otherMessageWrapper">
                  <span className="nickName">{idx.nickname}</span>
                  <span className="otherMessage">{idx.text}</span>
                </div>
              </>
            );
          }
        })}
      </div>
      <hr />
      <div>
        <MyChattingWrapper>
          <form onSubmit={submitChatHandle}>
            <TextField
              id="chatText"
              type="text"
              size="small"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            ></TextField>
            <Button id="submitButton" type="submit">
              입력
            </Button>
          </form>
        </MyChattingWrapper>
      </div>
    </ChattingWrapper>
  );
}

export default Chatting;
