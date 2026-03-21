import { resolvers, typeDefs } from "@/src/graphql";
import { ApolloServer } from "@apollo/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 👇 ADD THIS TYPE HERE (optional but clean)
type AuthUser = JwtPayload & {
  id: string;
  role: string;
};

const handler = startServerAndCreateNextHandler(server, {
   context: async (req: Request) => {  // 👈 add Request type here
    console.log("🔥 REQ:", req);

    const authHeader = req.headers.get("authorization");
    console.log("🔥 AUTH HEADER:", authHeader);

    if (!authHeader) return { user: null };

    const token = authHeader.replace("Bearer ", "");

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
      console.log("🔥 DECODED USER:", user);
      return { user };
    } catch (err) {
      console.log("🔥 JWT ERROR:", err);
      return { user: null };
    }
  },
});

// ⚠️ move DB connection inside handler (important for serverless)
export async function GET(req: NextRequest) {
  await connectDB();
  return handler(req);
}

export async function POST(req: NextRequest) {
  await connectDB();
  return handler(req);
}