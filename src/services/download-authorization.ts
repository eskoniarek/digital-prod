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
    // Assert the return value to be of type MyTokenPayload
    return jwt.verify(token, JWT_SECRET) as MyTokenPayload;
  }

  createToken(orderId: string, lineItemId: string, mediaId: string) {
    return jwt.sign(
      {
        orderId: orderId,
        lineItemId: lineItemId,
        mediaId: mediaId,
      },
      JWT_SECRET
    );
  }
}

export default DownloadAuthorizationService;
