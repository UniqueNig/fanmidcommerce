import gql from "graphql-tag";

const categoryType = gql`
  #graphql
  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    productCount: Int
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    image: String!
    category: Category # ✅ object now
    isNew: Boolean
  }

  type Query {
    products: [Product]
    categories: [Category] # ✅ NEW
  }

  type Mutation {
    createCategory(name: String!, slug: String!, description: String): Category
    updateCategory(id: ID!, name: String, description: String): Category
    deleteCategory(id: ID!): Category

    createProduct(
      name: String!
      price: Float!
      image: String
      category: ID! # ✅ send category ID
      isNew: Boolean
    ): Product
  }
`;

export default categoryType;
