import gql from "graphql-tag";

const userType = gql`
  #graphql
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    address: String
    role: String
    createdAt: String!
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
    register(
      name: String!
      email: String!
      phone: String
      address: String
      password: String!
    ): User
    login(email: String!, password: String!): AuthPayload

    updateUser(id: ID!, name: String, email: String, phone: String): User

    # ✅ ADD THIS
    updateProfile(name: String!, email: String!, phone: String, address: String, ): User

    changePassword(currentPassword: String!, newPassword: String!): Boolean!

    deleteUser(id: ID!): User

    deleteAccount: Boolean!
  }
`;

export default userType;
