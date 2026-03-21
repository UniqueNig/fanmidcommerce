import gql from "graphql-tag";

const userType = gql`#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
   
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload

    updateUser(
      id: ID!
      name: String
      age: Int
      email: String
      address: String
    ): User

    deleteUser(id: ID!): User
  }
`;

export default userType;