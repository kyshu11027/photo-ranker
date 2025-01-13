"use client";
import React, { useState, useEffect } from "react";
import { staatliches } from "../fonts/fonts";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Upload from "@/public/upload.png";

interface PreviewFile extends File {
  preview: string;
}

const NewSession = () => {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [images, setImages] = useState<PreviewFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (images.length === 0) return;
    setLoading(true);
    // const formData = new FormData();
    // images.forEach((image, index) => formData.append(`image${index}`, image));

    try {
      const response = await fetch(`${endpoint}/createNewSession`, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          numImages: images.length,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      const responseJson = await response.json();

      const imageInfo = responseJson.imageIds;

      const uploadPromises = imageInfo.map((imageData: { url: string }, index: number) => {
        const file = images[index];
        return fetch(imageData.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type, // Set the correct MIME type
          },
          body: file,
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Upload failed for image ${index + 1}: ${res.statusText}`);
          }
          console.log(`Upload successful for image ${index + 1}`);
        });
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

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

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const onDrop = (acceptedFiles: File[]) => {
    // Limit the total number of images to 9
    if (images.length + acceptedFiles.length > 9) {
      alert("You can only upload up to 9 images.");
      return;
    }

    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    ) as PreviewFile[]; // Ensure proper casting here

    setImages((prev) => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Specify the type here
    },
    multiple: true, // Allow multiple files
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);

    // Check if adding these files would exceed the 9-image limit
    if (images.length + selectedFiles.length > 9) {
      alert("You can only upload up to 9 images.");
      return;
    }

    const newImages = selectedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    ) as PreviewFile[]; // Cast to PreviewFile[]

    setImages((prev) => [...prev, ...newImages]);
  };

  const triggerFileInput = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <>
      <div onClick={() => router.push("/")} className="header cursor-pointer">
        <h1 className={staatliches.className}>PickPix</h1>
      </div>
      <div className="pt-20 md:pt-20 sm:pt-20 lg:pt-30">
        <div className="flex flex-row px-5 sm:px-10 md:px-20 w-[100vw] items-center gap-[15px]">
          <div className="flex flex-col md:gap-[31px] gap-[15px] justify-center">
            <h1>Create a New Session</h1>
            <p>
              Upload your photos and send your unique session ID to your friends. You can submit 9
              photos per session. Let the ranking begin!
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              className="primary-btn flex md:hidden flex-row mt-[10px] gap-[10px] justify-center items-center space-y-4"
              onClick={triggerFileInput}
            >
              <Image
                src={Upload}
                alt="PickPix Hero Image"
                className="md:h-[20px] h-[18px] md:w-[20px] w-[18px]"
              />
              Upload Your Photos
            </button>
            <button
              onClick={handleSubmit}
              className={`secondary-btn mt-[20px] md:mt-[30px] flex justify-center items-center ${
                loading || images.length === 0 ? "disabled opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <CircularProgress size="25px" sx={{ color: "#F6E27F" }} />
              ) : (
                "CREATE SESSION"
              )}
            </button>
            {images.length > 0 && (
              <div className="md:hidden relative p-[10px] rounded-[20px] outline-2 outline-dashed outline-gray-400 transition-colors cursor-pointer text-center">
                <div className=" grid gap-[10px] grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index}`}
                        className=" object-cover rounded-[20px]"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="badge"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="drag-drop justify-center w-full hidden md:flex">
            <div
              {...getRootProps()}
              className={`relative p-[10px] h-[385px] w-[385px] lg:h-[490px] lg:w-[490px] rounded-[20px] outline-2 outline-dashed outline-gray-400 transition-colors cursor-pointer text-center
              ${isDragActive ? "bg-gray-300/20" : "bg-transparent"}`}
            >
              <div className="grid gap-[10px] grid-cols-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Preview ${index}`}
                      className="w-[115px] h-[115px] lg:w-[150px] lg:h-[150px] object-cover rounded-[20px]"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="badge"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input {...getInputProps()} />
              {images.length === 0 && (
                <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4">
                  <Image src={Upload} alt="PickPix Hero Image" className="h-12 w-12" />
                  <p className="text-[20px] md:text-[24px] font-semibold text-black">
                    Upload Your Photos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSession;
