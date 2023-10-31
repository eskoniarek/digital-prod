import { wrapHandler } from "@medusajs/utils";
import { Request, Response } from "express";
import ProductMediaService from "../../../../services/product-media";
import DownloadAuthorizationService, { MyTokenPayload } from "../../../../services/download-authorization";

async function handler(req: Request, res: Response) {
  const { token } = req.params;

  const productMediaService: ProductMediaService = req.scope.resolve("productMediaService");
  const authorizationService: DownloadAuthorizationService = req.scope.resolve("downloadAuthorizationService");

  let verificationResult: MyTokenPayload;
  try {
    verificationResult = authorizationService.validateToken(token);
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
    return;
  }

  // Now TypeScript knows that verificationResult will have a mediaId property
  const productMedia = await productMediaService.retrieve(verificationResult.mediaId);

  res.redirect(productMedia.file);
}

export default [wrapHandler(handler)];
