import type { ImagesResults } from "@/models/Images";
import { ImageSchema } from "@/models/Images";

export default async function fetchImages(
  url: string
): Promise<ImagesResults | undefined> {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY as string,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) throw new Error("Fetch Images Error\n");

    const ImagesResults: ImagesResults = await res.json();

    const parsedData = ImageSchema.parse(ImagesResults);

    if (parsedData.total_results === 0) return undefined;

    return parsedData;
  } catch (err) {}
}
