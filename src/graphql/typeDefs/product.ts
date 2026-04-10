import gql from "graphql-tag";

const productType = gql`
  #graphql
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String
    stock: Int!
    category: Category # ✅ FIXED
    isNew: Boolean
    createdBy: ID
    createdAt: String
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      price: Float!
      image: String
      stock: Int!
      category: Category! # ✅ FIXED
      isNew: Boolean
    ): Product

    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      image: String
      stock: Int
     category: ID!   # ✅ CORRECT
      isNew: Boolean
    ): Product

    deleteProduct(id: ID!): Product
  }
`;

export default productType;
