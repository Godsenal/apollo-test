import ApolloClient from "apollo-boost";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  typeDefs,
  resolvers,
  request: operation => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
});

export default client;
