import { useEffect } from "react";
import { apolloClient } from "./api";
import gql from "graphql-tag";
import { IMessage } from "./Chat";

export type onReceive = (message: IMessage) => void;

let ROOT_QUERY = gql`
  query {
    getChatMessages {
      text
      channel
      sender
    }
  }
`;

function subscribeToMessage(channel: string, onReceive: onReceive) {
  return apolloClient
    .subscribe({
      query: gql`
        subscription Message($channel: String!) {
          message(channel: $channel) {
            text
            channel
            sender
          }
        }
      `,
      variables: { channel },
    })
    .subscribe({
      next(response) {
        onReceive(response.data.message);
      },
    });
}

function sendMessage(text: string, channel: string, sender: string) {
  return apolloClient.mutate({
    mutation: gql`
      mutation Send($text: String!, $channel: String!, $sender: String!) {
        sendMessage(text: $text, channel: $channel, sender: $sender) {
          text
          channel
          sender
        }
      }
    `,
    variables: { text, channel, sender },
    refetchQueries: [{ query: ROOT_QUERY }],
  });
}

function getMessages() {
  return apolloClient.query({
    query: gql`
      query {
        getChatMessages {
          text
          channel
          sender
        }
      }
    `,
  });
}

export const useChat = (
  sender: string,
  channel: string,
  onReceive: onReceive
) => {
  useEffect(() => {
    const observer = subscribeToMessage(channel, onReceive);
    return () => observer.unsubscribe();
  });

  return (text: string) => sendMessage(text, channel, sender);
};
