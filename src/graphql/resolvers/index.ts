import { categoryResolvers } from "./categoryResolver";
import { orderResolvers } from "./orderResolver";
import { productResolvers } from "./productResolver";
import { settingsResolvers } from "./setingsResolver";
import { userResolvers } from "./userResolver";
import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([userResolvers, productResolvers, categoryResolvers, orderResolvers, settingsResolvers]);
