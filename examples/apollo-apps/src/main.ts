import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MY_QUERY } from "./query";

import { MyQuery } from "./__generated__/MyQuery";

async function main() {
  const clinet = new ApolloClient({
    link: createHttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        Authorization: "bearer XXXXXXXXXXXXXXX",
      },
    }),
    cache: new InMemoryCache(),
  });

  const { data } = await clinet.query<MyQuery>({
    query: MY_QUERY,
  });

  console.log(data.viewer.repositories.nodes);
}
