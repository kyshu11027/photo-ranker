import React from "react";
import Link from "next/link";
import { staatliches } from "../../fonts/fonts";

interface ImageData {
  imageUrl: string;
  imageId: string;
  ranking: number[];
  averageRanking: number;
}

const Results = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const sessionId = (await params).sessionId;
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Fetch data from your endpoint
    const response = await fetch(`${endpoint}/getSessionData?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error("Session ID does not exist");
    }

    const responseJson = await response.json();

    // Process the response and calculate averageRanking
    const images: ImageData[] = responseJson.map((image: ImageData) => {
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
    images.sort((a, b) => a.averageRanking - b.averageRanking);

    return (
      <>
        <Link href="/">
          <div className="header cursor-pointer mb-5">
            <h1 className={`${staatliches.className} text-4xl`}>PickPix</h1>
          </div>
        </Link>
        <div className="flex flex-col w-full justify-center items-center gap-5">
          <h1 className="text-2xl font-bold">Current Rankings</h1>
          <div className="flex flex-row flex-wrap w-full justify-center items-center gap-5">
            {images.map((image, index) => (
              <div
                key={image.imageId}
                className="flex flex-col justify-center items-center md:max-w-[33%] lg:max-w-[25%]"
              >
                <div className="relative rounded-[20px] overflow-hidden shadow-lg w-full h-full">
                  <img
                    src={image.imageUrl}
                    alt={`Image ${image.imageId}`}
                    className="w-full h-full object-contain"
                  />
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded ${
                      index <= 2 ? "bg-[#F6E27F] text-black" : "bg-[#33658A] text-white"
                    }`}
                  >
                    {index === 0 && <span className="text-sm font-bold">🥇 Top Photo!</span>}
                    {index === 1 && <span className="text-sm font-bold">🥈 Second Place!</span>}
                    {index === 2 && <span className="text-sm font-bold">🥉 Third Place!</span>}
                    {index > 2 && <span className="text-sm font-bold">#{index + 1}</span>}
                  </div>
                </div>
              </div>
            ))}
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
        <div className="flex justify-center items-center">
          <h1>Error: {error instanceof Error ? error.message : "Unknown Error"}</h1>
        </div>
      </div>
    );
  }
};

export default Results;
