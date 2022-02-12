import styled from '@emotion/styled';
import { TextField, IconButton } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

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
  // overflow-y: scroll;

  .messages {
    padding: 10px 5px;
    overflow-y: scroll;
    height: 100%;
    max-width: 280px;
  }

  & .otherMessageWrapper {
    text-align: left;
    margin-bottom: 7px;
    align-items: flex-start;
    display: flex;
    align-content: flex-start;
    flex-direction: column;
    flew-wrap: wrap;
    max-width: 250px;

    & .otherWrapper{
      display: flex;
      flex-direction; row;
      align-items: center;

      & span {
        margin-top: 3px;
        margin-right: 5px;
      }
    }
  }

  & .otherMessage,
  .myMessage {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
    max-width: 210px;
    display: block;
    overflow-wrap: break-word;
  }

  .myMessage {
    margin: 0px 5px;
  }

  & .nickName {
    font-weight: bolder;
  }

  & .myMessageWrapper {
    text-align: right;
    margin-bottom: 7px;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    flew-wrap: wrap;
    max-width: 250px;
  }

  & .time {
    font-size: 11px;
    color: gray;
  }
`;
const MyChattingWrapper = styled.div`
  font: 13px Helvetica, Arial;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 10px;

  & input {
    width: calc(100%);
  }
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
              <div className="otherWrapper">
                <span className="otherMessage">{data.message}</span>
                <span className="time">{data.createAt}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <MyChattingWrapper>
          <>
            <TextField
              id="chatText"
              type="text"
              size="small"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  submitChatHandle(e);
                }
              }}
              sx={{ width: '100%' }}
            ></TextField>
            <IconButton
              color="primary"
              id="submitButton"
              onClick={submitChatHandle}
            >
              <SendIcon />
            </IconButton>
          </>
        </MyChattingWrapper>
      </div>
    </ChattingWrapper>
  );
}

export default Chatting;
