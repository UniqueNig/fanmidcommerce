import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // console.log("TOKEN BEING SENT:", token); 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});