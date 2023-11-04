import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.PRODUCT_MEDIA_JWT_SECRET || "secret";

export interface CustomTokenPayload extends JwtPayload {
  mediaId: string;
}

class DownloadAuthorizationService {
  validateToken(token: string): CustomTokenPayload {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === 'object' && 'mediaId' in payload) {
      return payload as CustomTokenPayload;
    }
    throw new Error('Token payload is not valid');
  }

  createToken(orderId: string, lineItemId: string, mediaId: string): string {
    const tokenPayload: CustomTokenPayload = {
      orderId: orderId,
      lineItemId: lineItemId,
      mediaId: mediaId,
    };
    return jwt.sign(tokenPayload, JWT_SECRET);
  }
}

export default DownloadAuthorizationService;
