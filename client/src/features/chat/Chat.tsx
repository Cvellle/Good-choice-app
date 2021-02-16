import React, { useState, useEffect } from "react";
import { useChat } from "./chat-hooks";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import styled, { css } from "styled-components";

const InputMessage = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = React.useState("");

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
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
    <ul>
      {messages.map((m, i) =>
        m.sender === currentSender ? (
          <div key={i} style={{ textAlign: "right" }}>
            {m.text} : <b>me</b>
          </div>
        ) : (
          <div key={i}>
            <b>{m.sender}</b> : {m.text}
          </div>
        )
      )}
    </ul>
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
    <>
      <InputMessage onSend={(text) => sendMessage(text)} />
      <MessageList currentSender={currentSender} messages={messages} />
    </>
  );
};
