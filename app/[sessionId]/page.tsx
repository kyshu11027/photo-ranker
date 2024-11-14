"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface ImageData {
    imageUrl: string;
    imageId: string;
}

export default function ImageGallery() {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [images, setImages] = useState<ImageData[]>([]);
    const [clickOrder, setClickOrder] = useState<string[]>([]);
    const pathname = usePathname().replace("/", "");

    useEffect(() => {
        getSessionData();
    }, []);

    const getSessionData = async () => {
        try {
            const response = await fetch(
                `${endpoint}getSessionData?sessionId=${pathname}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload images");
            }
            const responseJson = await response.json();
            setImages(responseJson);
        } catch (error) {}
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
        </div>
    );
}
