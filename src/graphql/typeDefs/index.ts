import { mergeTypeDefs } from "@graphql-tools/merge";

import userType from "./user";
import productType from "./product";
import categoryType from "./category";

// import orderType from "./order";

export const typeDefs = mergeTypeDefs([
  userType,
  productType,
  categoryType
  //   orderType,
]);
