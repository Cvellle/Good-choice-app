import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
  // uri: "https://n8nqw.sse.codesandbox.io",
  uri: "https://ki7up.sse.codesandbox.io/",
});

const wsLink = new WebSocketLink({
  uri: "wss://ki7up.sse.codesandbox.io/",
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    let definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
