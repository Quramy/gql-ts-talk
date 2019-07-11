import gql from "graphql-tag";

export const MY_QUERY = gql`
  query MyQuery {
    viewer {
      repositories(first: 3, orderBy: { field: STARGAZERS, direction: DESC }) {
        nodes {
          url,
          name,
          description,
          languages(first: 1) {
            nodes {
              name,
            }
          }
        }
      }
    }
  }
`;
