import { getPlaiceholder } from "plaiceholder";
import type { Photo, ImagesResults } from "@/models/Images";

const getBase64 = async (imageURL: string) => {
  // const buffer = await fetch(src);
  // const res = async (res) => {
  //   Buffer.from(await res.arrayBuffer())
  // }

  // const { base64 } = await getPlaiceholder(buffer);

  try {
    const res = await fetch(imageURL);

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (err) {
    if (err instanceof Error) console.log(err.stack);
  }
};

const addBlurredDataUrls = async (images: ImagesResults): Promise<Photo[]> => {
  const base64Promises = images.photos.map((photo) =>
    getBase64(photo.src.large)
  );

  const base64Results = await Promise.all(base64Promises);
  const blurredPhotos: Photo[] = images.photos.map((photo, i) => {
    photo.blurredDataUrl = base64Results[i];
    return photo;
  });

  return blurredPhotos;
};

export default addBlurredDataUrls;
