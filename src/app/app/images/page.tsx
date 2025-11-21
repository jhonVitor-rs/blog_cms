import { ImagesList } from "./_components/images-list";
import { getUserImages } from "./actions";

export default async function ImagesPage() {
  const imagesData = await getUserImages();

  return <ImagesList data={imagesData} />;
}
