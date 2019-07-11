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
