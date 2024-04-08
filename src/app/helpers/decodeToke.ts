import jwt from "jsonwebtoken";

export const getDatFromToken = (token: string) => {
  try {
    // Get the decoded token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);

    const response = {
      tokenValid: true,
      decodedData: decodedToken,
    };
    return response;
  } catch (error: any) {
    const response = {
      tokenValid: false,
    };
    return response;
  }
};
