"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles";

const LandingPage = () => {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const imagePreviews = images.map((image) =>
                URL.createObjectURL(image)
            );
            setPreviews(imagePreviews);

            return () => {
                imagePreviews.forEach((url) => URL.revokeObjectURL(url));
            };
        }
    }, [images, mounted]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newImages = [...images, ...selectedFiles].slice(0, 10);
            setImages(newImages);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        images.forEach((image, index) =>
            formData.append(`image${index}`, image)
        );

        try {
            const response = await fetch(`${endpoint}createNewSession`, {
                method: "POST",
                headers: {},
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload images");
            }
            const responseJson = await response.json();
            router.push(`/${responseJson.sessionId}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Upload Your Images</h1>

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={styles.fileInput}
            />

            {previews.length > 0 && (
                <div style={styles.previewContainer}>
                    {previews.map((preview, index) => (
                        <div key={index} style={styles.imagePreview}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={styles.previewImage}
                            />
                            <button
                                onClick={() => removeImage(index)}
                                style={styles.removeButton}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {loading ? (
                <div style={styles.spinner}>Loading...</div>
            ) : (
                images.length > 0 &&
                images.length <= 10 && (
                    <button
                        onClick={handleSubmit}
                        style={{
                            ...styles.uploadButton,
                            backgroundColor: loading ? "#a3a3a3" : "#0044cc",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        disabled={loading}
                    >
                        Submit {images.length} Image
                        {images.length > 1 ? "s" : ""}
                    </button>
                )
            )}

            {images.length === 10 && (
                <p style={styles.limitText}>
                    You can upload a maximum of 10 images.
                </p>
            )}
        </div>
    );
};

export default LandingPage;
