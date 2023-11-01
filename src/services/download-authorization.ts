import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.PRODUCT_MEDIA_JWT_SECRET || "secret";

// Define the shape of your payload
export interface MyTokenPayload extends JwtPayload {
  orderId: string;
  lineItemId: string;
  mediaId: string;
}

class DownloadAuthorizationService {
  validateToken(token: string): MyTokenPayload {
    try {
      // Assert the return value to be of type MyTokenPayload
      const decodedToken = jwt.verify(token, JWT_SECRET) as MyTokenPayload;
      console.log("Token validation successful. Decoded token:", decodedToken);
      return decodedToken;
    } catch (error) {
      console.error("Token validation failed:", error);
      throw new Error("Token validation failed");
    }
  }

  createToken(orderId: string, lineItemId: string, mediaId: string) {
    const tokenPayload: MyTokenPayload = {
      orderId: orderId,
      lineItemId: lineItemId,
      mediaId: mediaId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET);
    console.log("Created token:", token);
    return token;
  }
}

export default DownloadAuthorizationService;
