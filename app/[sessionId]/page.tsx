"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { staatliches } from "../fonts/fonts";
import styles from "@/app/styles";

interface ImageData {
  imageUrl: string;
  imageId: string;
}

interface RankingData {
  imageId: string;
  newRanking: number;
}

export default function ImageGallery() {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [clickOrder, setClickOrder] = useState<string[]>([]);
  const pathname = usePathname().replace("/", "");

  useEffect(() => {
    getSessionData();
  }, []);

  const getSessionData = async () => {
    try {
      const response = await fetch(`${endpoint}/getSessionData?sessionId=${pathname}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
      const responseJson = await response.json();
      setImages(responseJson);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleSubmit = async () => {
    const rankings: RankingData[] = [];

    clickOrder.forEach((id, index) => {
      rankings.push({
        imageId: id,
        newRanking: index + 1,
      });
    });
    const body = {
      sessionId: pathname,
      rankings: rankings,
    };

    try {
      const response = await fetch(`${endpoint}/updateSession`, {
        method: "POST",
        headers: {},
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
      const responseJson = await response.json();
      console.log(responseJson);
      router.push(`/${pathname}/results`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleImageClick = (imageId: string) => {
    setClickOrder((prevOrder) => {
      const isAlreadyClicked = prevOrder.includes(imageId);

      if (isAlreadyClicked) {
        return prevOrder.filter((id) => id !== imageId);
      } else {
        return [...prevOrder, imageId];
      }
    });
  };

  return (
    <>
      <div onClick={() => router.push("/")} className="header cursor-pointer mb-5">
        <h1 className={staatliches.className}>PickPix</h1>
      </div>
      <div className="flex flex-col items-center gap-[20px] w-full px-[40px]">
        <div className="flex flex-col gap-2 md:flex-row justify-around w-full">
          <h1> Rank These Photos!</h1>
          <button className="primary-btn" onClick={handleSubmit}>
            SUBMIT RANKINGS
          </button>
        </div>
        {/* "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 flex-wrap w-full items-center" */}
        <div className="flex flex-row flex-wrap w-full justify-center items-center gap-5">
          {images.map((image) => {
            const clickIndex = clickOrder.indexOf(image.imageId);
            return (
              <div
                className="relative cursor-pointer rounded-[20px] md:max-w-[33%] lg:max-w-[25%] overflow-hidden"
                key={image.imageId}
                onClick={() => handleImageClick(image.imageId)}
              >
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.imageId}`}
                  className="w-full h-full"
                />
                {clickIndex !== -1 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex justify-center items-center text-lg font-bold">
                    {clickIndex + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
