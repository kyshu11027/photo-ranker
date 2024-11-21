"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
      const response = await fetch(`${endpoint}getSessionData?sessionId=${pathname}`, {
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
      const response = await fetch(`${endpoint}updateSession`, {
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
        // Remove the imageId from the click order if already clicked
        return prevOrder.filter((id) => id !== imageId);
      } else {
        // Add the imageId to the click order if not clicked yet
        return [...prevOrder, imageId];
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>Image Gallery</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {images.map((image) => {
          const clickIndex = clickOrder.indexOf(image.imageId);
          return (
            <div
              key={image.imageId}
              onClick={() => handleImageClick(image.imageId)}
              style={{
                position: "relative",
                cursor: "pointer",
                border: "2px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                width: "200px",
                height: "200px",
              }}
            >
              <img
                src={image.imageUrl}
                alt={`Image ${image.imageId}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {clickIndex !== -1 && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {clickIndex + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={handleSubmit}
          style={{
            ...styles.uploadButton,
          }}
        >
          Submit Ranking
        </button>
      </div>
    </div>
  );
}
