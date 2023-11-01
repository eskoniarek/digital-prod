import { wrapHandler } from "@medusajs/utils";
import { Request, Response } from "express";
import ProductMediaService from "../../../../services/product-media";
import DownloadAuthorizationService, { MyTokenPayload } from "../../../../services/download-authorization";

async function handler(req: Request, res: Response) {
  const { token } = req.params;

  const productMediaService: ProductMediaService = req.scope.resolve("productMediaService");
  const authorizationService: DownloadAuthorizationService = req.scope.resolve("downloadAuthorizationService");

  console.log("Received token:", token);

  let verificationResult: MyTokenPayload;
  try {
    verificationResult = authorizationService.validateToken(token);
    console.log("Token validation successful. Media ID:", verificationResult.mediaId);
  } catch (err) {
    console.error("Token validation failed:", err);
    res.status(401).json({ message: "Token is invalid" });
    return;
  }

  // Now TypeScript knows that verificationResult will have a mediaId property
  console.log("Retrieving product media for media ID:", verificationResult.mediaId);
  const productMedia = await productMediaService.retrieve(verificationResult.mediaId);

  if (!productMedia) {
    console.error("Product media not found for media ID:", verificationResult.mediaId);
    res.status(404).json({ message: "Product media not found" });
    return;
  }

  console.log("Redirecting to product media file:", productMedia.file);
  res.redirect(productMedia.file);
}

export default [wrapHandler(handler)];
