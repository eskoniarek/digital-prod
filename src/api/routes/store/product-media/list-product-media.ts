import { wrapHandler } from "@medusajs/utils";
import validateQuery from "./validate-query";
import { Request, Response } from "express";
import { z } from "zod";
import ProductMediaService from "../../../../services/product-media";
import {
  ProductMediaVariantDTO,
  ResponseProductMedia,
  FilterableProductMediaFields,
} from "../../../../types/product-media";
import { ProductMediaVariantType } from "../../../../models/product-media-variant";

const requestSchema = z.object({
  variant_id: z.string().or(z.array(z.string())).optional(),
  limit: z.coerce.number().int().positive().optional().default(10),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
  expand: z.array(z.enum(["variants"])).optional(),
});

export type ProductMediaListParams = z.infer<typeof requestSchema>;

async function handler(req: Request, res: Response) {
  console.log("List Product Media Handler: Request started");
  const productMediaService: ProductMediaService = req.scope.resolve(
    "productMediaService"
  );

  // Log the query parameters
  console.log("List Product Media Handler: Query parameters", req.query);

  const { limit, offset, expand, ...query } =
    req.query as ProductMediaListParams;

  // Log the constructed selector
  console.log("List Product Media Handler: Selector", query);

  const selector: FilterableProductMediaFields = {
    ...query,
    attachment_type: ProductMediaVariantType.PREVIEW,
  };

  try {
    const [productMedia, count] = await productMediaService.listAndCount(
      selector,
      {
        take: limit,
        skip: offset,
      }
    );

    console.log(`List Product Media Handler: Retrieved ${productMedia.length} items`);

    const result: ResponseProductMedia[] = productMedia;

    if (expand?.includes("variants")) {
      const mediaIds = productMedia.map((m) => m.id);

      // Log the media IDs for which variants are being retrieved
      console.log("List Product Media Handler: Retrieving variants for media IDs", mediaIds);

      const variants = await productMediaService.listVariants(mediaIds);
      const variantMap = new Map<string, ProductMediaVariantDTO[]>();

      variants.forEach((v) => {
        if (!variantMap.has(v.product_media_id)) {
          variantMap.set(v.product_media_id, []);
        }
        variantMap.get(v.product_media_id).push(v);
      });

      result.forEach((m) => {
        m.variants = variantMap.get(m.id) || [];
      });
    }

    console.log("List Product Media Handler: Sending response");
    res.json({
      product_medias: result,
      count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("List Product Media Handler: Error occurred", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default [validateQuery(requestSchema), wrapHandler(handler)];
