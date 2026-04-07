// import { resolvers, typeDefs } from "@/src/graphql";
// import { ApolloServer } from "@apollo/server";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { connectDB } from "@/src/lib/db";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import { NextRequest } from "next/server";

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// // 👇 ADD THIS TYPE HERE (optional but clean)
// type AuthUser = JwtPayload & {
//   id: string;
//   role: string;
// };

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req: Request) => {
//     // 👈 add Request type here
//     // console.log("🔥 REQ:", req);

//     const authHeader = req.headers.get("authorization");
//     console.log("🔥 AUTH HEADER:", authHeader);

//     // if (!authHeader) return { user: null };

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       console.log("❌ No auth header");
//       return {};
//     }

//     // const token = authHeader.replace("Bearer ", "");

//     const token = authHeader.split(" ")[1];

//     try {
//       const user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
//       // console.log("🔥 DECODED USER:", user);
//       return { user };
//     } catch (err) {
//       // console.log("🔥 JWT ERROR:", err);
//       return { user: null };
//     }
//   },
// });

// // ⚠️ move DB connection inside handler (important for serverless)
// export async function GET(req: NextRequest) {
//   await connectDB();
//   return handler(req);
// }

// export async function POST(req: NextRequest) {
//   await connectDB();
//   return handler(req);
// }


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

type AuthUser = JwtPayload & {
  id: string;
  role: string;
};

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: Request) => {
    let token: string | null = null;

    // ✅ 1. Try Authorization header first
    const authHeader = req.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ✅ 2. Fallback: Try cookies (useful if header is missing)
    if (!token) {
      const cookieHeader = req.headers.get("cookie");

      if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        token = match ? match[1] : null;
      }
    }

    // 🔍 Debug (optional)
    console.log("🔥 TOKEN:", token);

    // ❌ No token → unauthenticated
    if (!token) {
      return { user: null };
    }

    try {
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as AuthUser;

      return { user };
    } catch (err) {
      console.log("❌ JWT ERROR:", err);
      return { user: null };
    }
  },
});

// ✅ DB connection per request (good for serverless)
export async function GET(req: NextRequest) {
  await connectDB();
  return handler(req);
}

export async function POST(req: NextRequest) {
  await connectDB();
  return handler(req);
}