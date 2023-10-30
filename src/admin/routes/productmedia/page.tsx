import { RouteConfig } from "@medusajs/admin";
import Table from "../../components/table";
import { Container } from "../../components/shared/container";
import { useAdminCustomQuery } from "medusa-react";
import { ListProductMediaRes } from "../../../types/product-media";
import { ProductMediaListParams } from "../../../api/routes/admin/product-media/list-product-media";

const ProductMediaList = () => {
  // Here we are using the custom hook you've defined.
  // Ensure that the query key is an array
  const { data, isLoading } = useAdminCustomQuery<ProductMediaListParams, ListProductMediaRes>(
    `/product-media`, // path
    ["product-medias"] // queryKey
  );
  // Check if loading is in progress and handle the loading state accordingly.
  if (isLoading) {
    // Render loading state, this could be a spinner or a loading message
    return <div>Loading...</div>;
  }

  // Once data is loaded, access the product_medias array
  const productMedia = data?.product_medias || [];

  return (
    <Container>
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Media</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {productMedia.map((media) => (
            <Table.Row clickable linkTo={`${media.id}`} key={media.id}>
            <Table.Cell>
                <div className="w-[100px] h-[100px] overflow-hidden p-3">
                  <img
                    className="w-full h-full object-contain"
                    src={media.file}
                    alt={media.name}
                  />
                </div>
              </Table.Cell>
              <Table.Cell>{media.mime_type}</Table.Cell>
              <Table.Cell>{media.name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default ProductMediaList;
export const config: RouteConfig = {
  link: {
    label: "Product Media",
    // Adjust the path according to your actual route structure
  },
};
