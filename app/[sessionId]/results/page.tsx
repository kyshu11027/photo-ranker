import React from "react";
import Link from "next/link";
import { staatliches } from "../../fonts/fonts";

interface ImageData {
  imageUrl: string;
  imageId: string;
  ranking: number[];
  averageRanking: number;
}

const Results = async ({ params }: { params: { sessionId: string } }) => {
  const sessionId = params.sessionId;
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Fetch data from your endpoint
    const response = await fetch(`${endpoint}/getSessionData?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error("Session ID does not exist");
    }

    const responseJson = await response.json();

    // Process the response and calculate averageRanking
    const images: ImageData[] = responseJson.map((image: any): ImageData => {
      const rankings = image.ranking;
      const averageRanking =
        rankings.length > 0
          ? rankings.reduce((a: number, b: number) => a + b, 0) / rankings.length
          : Infinity;

      return {
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        ranking: rankings,
        averageRanking,
      };
    });

    // Sort images by averageRanking (ascending)
    const sortedImages = images
      .sort((a, b) => a.averageRanking - b.averageRanking)
      .map(({ averageRanking, ...rest }) => rest);

    return (
      <>
        <Link href="/">
          <div className="header cursor-pointer mb-5">
            <h1 className={staatliches.className}>PickPix</h1>
          </div>
        </Link>
        <div className="flex flex-col w-full justify-center items-center gap-5">
          <h1>Current Rankings</h1>
          <div className="flex flex-row flex-wrap w-full justify-center items-center gap-5">
            {images.map((image, index) => {
              return (
                <div className="flex flex-col justify-center items-center md:max-w-[33%] lg:max-w-[25%]">
                  <h1> {index + 1} </h1>
                  <div
                    className="relative cursor-pointer rounded-[20px] overflow-hidden"
                    key={image.imageId}
                  >
                    <img src={image.imageUrl} alt={`Image ${image.imageId}`} className="w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <div>
        <Link href="/">
          <div className="header cursor-pointer mb-5">
            <h1 className={staatliches.className}>PickPix</h1>
          </div>
        </Link>
        <h1>Error: {error instanceof Error ? error.message : "Unknown Error"}</h1>
      </div>
    );
  }
};

export default Results;
