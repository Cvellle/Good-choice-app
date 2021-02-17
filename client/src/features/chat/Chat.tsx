import React, { useState, useEffect } from "react";
import { useChat } from "./chat-hooks";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import styled, { css } from "styled-components";

interface IViewProps {
  kind: "primary" | "secondary";
}

const Root = styled.div<IViewProps>`
  position: relative;
  z-index: 10;
  margin-top: 10vh;
  margin-left: 15vw;
  background: white;
  padding: 5vw;
  font-family: sans-serif;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  ${(props) =>
    props.kind === "primary" &&
    css`
      color: blue;
    `};

  ${(props) =>
    props.kind === "secondary" &&
    css`
      color: red;
    `};
`;

const Message = styled.div<IViewProps>`
  min-height: 4vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50vw;
  border-radius: ${(props) => (props.kind === "secondary" ? 8 : 0)}px;
  background-color: blue;
  color: white;
  font-size: 1.2vw;
  padding: 0 1vw 0 0;
  border-radius: 1vw;
  margin: 0.5vw 0;

  ${(props) =>
    props.kind === "secondary" &&
    css`
      background-color: purple;
      justify-content: flex-start;
      padding: 0 0 0 1vw;
    `};
`;

const InputMessage = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = React.useState("");

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "45vw" }}
      />
      <button
        onClick={() => {
          onSend(text);
          setText("");
        }}
      >
        Send
      </button>
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
            {m.text}: <b>me</b>
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

const currentSender = "sender" + 3;
const GET_MESSAGES = gql`
  query {
    getChatMessages {
      text
      channel
      sender
    }
  }
`;
export default () => {
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
    <Root kind={"primary"}>
      <InputMessage onSend={(text) => sendMessage(text)} />
      <MessageList currentSender={currentSender} messages={messages} />
    </Root>
  );
};
