import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET!;

  try {
    const decodedToken: any = jwt.verify(token, TOKEN_SECRET);

    const response = {
        isvalid :true,
        data : decodedToken
    }

    return response;
  } catch (error) {
    
    const response = {
        isvalid: false,
        data: null
    }

    return response
  }
};
