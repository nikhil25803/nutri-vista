// import jwt from "jsonwebtoken";

// export const getDatFromToken = (token: string) => {
//   try {
//     const TOKEN_SECRET = process.env.TOKEN_SECRET!;
//     console.log(TOKEN_SECRET);
//     const decodedToken: any = jwt.verify(token, TOKEN_SECRET);
//     console.log("Decoded token function: ", decodedToken);
//     const response = {
//       tokenValid: true,
//       decodedData: decodedToken,
//     };
//     return response;
//   } catch (error: any) {
//     const response = {
//       tokenValid: false,
//     };
//     console.log("Error decoding JWT: ", error);
//     return response;
//   }
// };
