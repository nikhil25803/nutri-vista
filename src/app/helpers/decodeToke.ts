// import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export const getDatFromToken = (request: NextRequest) => {
//   console.log("here");
//   try {
//     const token = localStorage.getItem("token")!;
//     console.log("Token: ", token);

//     // Get the decoded token
//     const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

//     // Serve user id as response
//     return decodedToken;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };
