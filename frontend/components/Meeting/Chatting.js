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
    margin: 0px 5px;
  }

  & .nickName {
    font-weight: bolder;
  }

  & .myMessageWrapper {
    text-align: right;
    margin-bottom: 15px;
  }

  & .time {
    font-size: 11px;
    color: gray;
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

function Chatting({ session }) {
  const scrollEl = useRef(null);

  const scrollToBottom = () => {
    scrollEl.current?.scrollTo({
      top: scrollEl.current.scrollHeight - scrollEl.current.clientHeight,
    });
  };

  const [chatHistory, setChatHistory] = useState([]);
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState({
    text: '',
    nickname: '',
    time: '',
  });

  const submitChatHandle = (e) => {
    e.preventDefault();
    if (!chatText) return;

    return new Promise((resolve, reject) => {
      const mySession = session;
      const payload = {
        message: chatText,
        nickname: sessionStorage.getItem('nickname')
          ? sessionStorage.getItem('nickname')
          : 'unknown',
      };

      mySession.signal({
        data: JSON.stringify(payload),
        type: 'chat',
      });

      resolve();
      setChatText('');
    });
  };

  useEffect(() => {
    if (!session) return;

    const mySession = session;

    mySession.on('signal:chat', (event) => {
      if (!event.data) return;
      const today = new Date();
      let hours = today.getHours();
      let minutes = today.getMinutes();

      const data = JSON.parse(event.data);
      chatHistory.push({
        nickname: data.nickname,
        message: data.message,
        createAt: hours + ':' + minutes,
        connectionId: event.from?.connectionId,
      });

      setChatHistory([...chatHistory]);
      scrollToBottom();
    });
  }, [session]);

  return (
    <ChattingWrapper>
      <div className="messages" ref={scrollEl}>
        {chatHistory.map((data, index) => {
          return data.nickname == sessionStorage.getItem('nickname') ? (
            <div className="myMessageWrapper" key={index}>
              <span className="time">{data.createAt}</span>
              {/* <span className="nickName">{data.nickname}</span> */}
              <span className="myMessage">{data.message}</span>
            </div>
          ) : (
            <div className="otherMessageWrapper" key={index}>
              <span className="nickName">{data.nickname}</span>
              <span className="otherMessage">{data.message}</span>
              <span className="time">{data.createAt}</span>
            </div>
          );
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
