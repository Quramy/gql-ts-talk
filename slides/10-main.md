## About me

- Yosuke Kurami (@Quramy)
- :heart: TypeScript
- Front-end tech adviser at FiNC

---

## Agenda

- GraphQL introduction
- TypeScript + GraphQL client dev tips:
  - Type generation
  - Ahead of time query parsing
  - Editor support

---

### What's GraphQL ?

---

### GraphQL is a query language for API

- Describe what’s possible with a **type system** (schema)
- **Ask for what you need**, get exactly that
- Get many resources in a single request

[https://graphql.org/](https://graphql.org/)

---

#### Query example (GitHub v4 API)

```graphql
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
```

---

![Image from Gyazo](https://i.gyazo.com/438943ab41d2aa3c1dc069e1882d6d7e.png)

---

#### Query result

```javascript
{
  "data": {
    "viewer": {
      "repositories": {
        "nodes": [
          {
            "url": "https://github.com/Quramy/tsuquyomi",
            "name": "tsuquyomi",
            "description": "A Vim plugin for TypeScript",
            "languages": {
              "nodes": [
                {
                  "name": "Shell"
                }
              ]
            }
          },
          {
            "url": "https://github.com/Quramy/lerna-yarn-workspaces-example",
            "name": "lerna-yarn-workspaces-example",
            "description": "How to build TypeScript mono-repo project with yarn and lerna",
            "languages": {
              "nodes": [
                {
                  "name": "TypeScript"
                }
              ]
            }
          },
          {
            "url": "https://github.com/Quramy/typed-css-modules",
            "name": "typed-css-modules",
            "description": "Creates .d.ts files from css-modules .css files",
            "languages": {
              "nodes": [
                {
                  "name": "JavaScript"
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

---

## JavaScript client libs

- **Apollo** (powered by Meteor)
- Relay (powered by Facebook)

---

```javascript
const clinet = new ApolloClient({
  link: createHttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      Authorization: "bearer XXXXXXXXXXXXXXX",
    },
  }),
  cache: new InMemoryCache(),
});

const MY_QUERY = gql`query MyQurey { viewer { #...  } }`;

const { data } = await clinet.query({
  query: MY_QUERY,
});

console.log(data.viewer);
```

---

## 1. What's type of query result ? :thinking_face:

---

### Generate TypeScript types from GraphQL queries

[https://github.com/apollographql/apollo-tooling](https://github.com/apollographql/apollo-tooling)

---

#### i. Write queries

```javascript
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
```

---

#### ii. Run codegen command

```bash
$ npx apollo client:codegen --target typescript
```

---

#### and get generated types

```javascript
/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyQuery
// ====================================================

export interface MyQuery_viewer_repositories_nodes_languages_nodes {
  __typename: "Language";
  /**
   * The name of the current language.
   */
  name: string;
}

export interface MyQuery_viewer_repositories_nodes_languages {
  __typename: "LanguageConnection";
  /**
   * A list of nodes.
   */
  nodes: (MyQuery_viewer_repositories_nodes_languages_nodes | null)[] | null;
}

export interface MyQuery_viewer_repositories_nodes {
  __typename: "Repository";
  /**
   * The HTTP URL for this repository
   */
  url: any;
  /**
   * The name of the repository.
   */
  name: string;
  /**
   * The description of the repository.
   */
  description: string | null;
  /**
   * A list containing a breakdown of the language composition of the repository.
   */
  languages: MyQuery_viewer_repositories_nodes_languages | null;
}

export interface MyQuery_viewer_repositories {
  __typename: "RepositoryConnection";
  /**
   * A list of nodes.
   */
  nodes: (MyQuery_viewer_repositories_nodes | null)[] | null;
}

export interface MyQuery_viewer {
  __typename: "User";
  /**
   * A list of repositories that the user owns.
   */
  repositories: MyQuery_viewer_repositories;
}

export interface MyQuery {
  /**
   * The currently authenticated user.
   */
  viewer: MyQuery_viewer;
}
```

---

#### iii. Use generated types

```javascript
import { MY_QUERY } from "./query";
import { MyQuery } from "./__generated__/MyQuery";

// ...

// Use generated types as type parameter
const { data } = await clinet.query<MyQuery>({
  query: MY_QUERY,
});

console.log(data.viewer); 
```

:smile:

---

## 2. Ahead of time parsing

---

### What does `gql` do ?

```javascript
import gql from "graphql-tag";

const MY_QUERY = gql`
  query {
    #...
  }
`;
```

---

### It parses query to **GraphQL AST at runtime**

```javascript
// parsed GraphQL AST
const MY_QUERY = {
  "kind": "Document",
  "definitions": [
    {
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "MyQuery"
      },
      "variableDefinitions": [],
      "directives": [],
      "selectionSet": { ... },
    }
  ]
};
```

---

### We want to parse in **build procedure**

---

### Use TypeScript custom transformer

- Custom transformers **invades TypeScript compilation**
  - Public TypeScript API. But not available with `tsc` :cry:
- [ts-transform-graphql-tag](https://github.com/firede/ts-transform-graphql-tag)
  - It transforms `gql` tagged template literals to GraphQL AST

---

### Example: with ts-loader


```javascript
const getTransformer = require("ts-transform-graphql-tag").getTransformer

const config = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          // ... other loader"s options
          getCustomTransformers: () => ({ before: [getTransformer()] })
        }
      }
    ]
  }
  // ...
};
```

---

## 3. Editor support

---

### Language service plugin

- LS plugin extends TypeScript's **functions for editors**
- Configurable with tsconfig.json :smile:
- You can customize editor behavior
  - e.g. error checking, completion, etc...

---

### ts-graphql-plugin

```javascript
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-graphql-plugin",
        "schema": "schema.json",
        "tag": "gql"
      }
    ],
    "target": "es2015",
    // ...
  }
}
```

---

![](https://raw.githubusercontent.com/Quramy/ts-graphql-plugin/master/capture.gif)

---

## Summary

- Both TypeScript and GraphQL have static type system
- So developer experience depends on static analysis tools

---

# Thank you ! (and we're hiring :sunglasses: )


