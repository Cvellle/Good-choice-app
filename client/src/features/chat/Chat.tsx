import React, { useState, useEffect } from "react";
import { useChat } from "./chat-hooks";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { createBreakpoint, createMap } from "styled-components-breakpoint";

import { loggedUser } from "../login/loginSlice";

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const breakpoint = createBreakpoint(breakpoints);

interface IViewProps {
  kind: "primary" | "secondary";
}

interface IVisibleChatProps {
  chatIsVisible: "visible" | "hidden";
}

const Root = styled.div<IVisibleChatProps>`
  position: fixed;
  background: white;
  min-height: 60vh;
  right: 0;
  top: 25vh;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 10;
  padding: 6vw;
  font-family: sans-serif;
  text-align: center;
  align-content: flex-start;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 60vw;
  overflow-y: scroll;

  ${breakpoint("md")`
  width: 40vw;
`}

  ${breakpoint("xl")`
  width: 30vw;
`}

  ${(props) =>
    props.chatIsVisible === "visible" &&
    css`
      color: blue;
      display: flex;
    `};

  ${(props) =>
    props.chatIsVisible === "hidden" &&
    css`
      display: none;
      width: 0vw;
      height: 0vw;
    `};
`;

const Message = styled.div<IViewProps>`
  height: 7vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 70vw;
  border-radius: ${(props) => (props.kind === "secondary" ? 8 : 0)}px;
  background-color: blue;
  color: white;
  font-size: 3vw;
  padding: 0 1vw 0 0;
  border-radius: 1vw;
  margin: 1.5vw 0;

  ${breakpoint("md")`
  width: 40vw;
`}

  ${breakpoint("xl")`
  width: 30vw;
  height: 4vw;
  font-size: 1.2vw;
`}


  ${(props) =>
    props.kind === "secondary" &&
    css`
      background-color: purple;
      justify-content: flex-start;
      padding: 0 0 0 1vw;
    `};
`;

const SendInput = styled.input`
  flex: 0 1 100%;
  margin-right: auto;
  height: 6vw;

  ${breakpoint("md")`
  width: 40vw;
  height:8vw;
`}

  ${breakpoint("xl")`
  width: 4vw;
  height:3vw;
  border-radius: 1vw;
`}
`;

const SendButton = styled.div`
  height: 5vw;
  max-height: 5vw;
  background: purple;
  margin: 1vw 0;
  padding: 1vw;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1 30%;
  margin-top: 2vw;
  transition: 0.3s;

  ${breakpoint("md")`
  margin-top: 4vw;
  height: 4vw;
  max-height: 4vw;
  width: 40vw;
`}

  ${breakpoint("xl")`
  margin-top: 2vw;
  width: 4vw;
  height: 2vw;
  max-height: 2vw;
`}


&:hover {
    opacity: 0.5;
    transition: 0.8s;
  }
`;

const InputMessage = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = React.useState("");

  return (
    <>
      <SendInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "45vw" }}
      />
      <SendButton
        onClick={() => {
          onSend(text);
          setText("");
        }}
      >
        Send
      </SendButton>
    </>
  );
};

export type IMessage = { sender: string; text: string };

const MessageList = ({
  messages,
  currentSender,
}: {
  messages: IMessage[];
  currentSender: string;
}) => {
  return (
    <>
      {messages.map((m, i) =>
        m.sender === currentSender ? (
          <Message kind={"primary"} key={i} style={{ textAlign: "right" }}>
            <b>me</b>: {m.text}
          </Message>
        ) : (
          <Message kind={"secondary"} key={i}>
            <b>{m.sender}</b> : {m.text}
          </Message>
        )
      )}
    </>
  );
};

const GET_MESSAGES = gql`
  query {
    getChatMessages {
      text
      channel
      sender
    }
  }
`;
export default (chatVisible: any) => {
  const loggedUserSelector = useSelector(loggedUser);
  const currentSender = loggedUserSelector.firstName;
  const { loading, error, data } = useQuery(GET_MESSAGES);

  const [messages, setMessages] = React.useState<IMessage[]>([]);
  let a = data && [...data.getChatMessages];

  useEffect(() => {
    getMessages();
  }, [data]);

  const getMessages = () => {
    data && console.log(data.getChatMessages);
    data && setMessages([...data.getChatMessages]);
  };

  const sendMessage = useChat(currentSender, "test", (msg: IMessage) => {
    addMessage(msg);
  });

  const addMessage = (msg: IMessage) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  return (
    <div>
      <Root chatIsVisible={chatVisible ? "visible" : "hidden"}>
        <InputMessage onSend={(text) => sendMessage(text)} />
        <MessageList currentSender={currentSender} messages={messages} />
      </Root>
    </div>
  );
};
