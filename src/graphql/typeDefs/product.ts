import gql from "graphql-tag";


const productType = gql`#graphql
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String!
    stock: Int
    category: ID!
    createdBy: ID
    createdAt: String
    updatedAt: String
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
      image: String!
      category: ID!
      stock: Int
    ): Product

    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      image: String
      category: ID
      stock: Int
    ): Product

    deleteProduct(id: ID!): Product
  }
`;

export default productType;