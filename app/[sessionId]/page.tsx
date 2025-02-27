"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { staatliches } from "../fonts/fonts";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [openTopTooltip, setOpenTopTooltip] = useState(false);
  const [openBottomTooltip, setOpenBottomTooltip] = useState(false);
  const pathname = usePathname().replace("/", "");

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    getSessionData();
  }, []);

  const getSessionData = async () => {
    try {
      const response = await fetch(`${endpoint}/get-session?sessionId=${pathname}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Session ID does not exist");
      }
      const responseJson = await response.json();
      setImages(responseJson);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        router.push("/");
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
      const response = await fetch(`${endpoint}/update-session`, {
        method: "POST",
        headers: {},
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
      await response.json();
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

  const handleCopy = async (text: string, tooltip: "top" | "bottom") => {
    try {
      await navigator.clipboard.writeText(text);
      if (tooltip === "top") {
        setOpenTopTooltip(true);
        setTimeout(() => setOpenTopTooltip(false), 700);
      } else if (tooltip === "bottom") {
        setOpenBottomTooltip(true);
        setTimeout(() => setOpenBottomTooltip(false), 700);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <div onClick={() => router.push("/")} className="header cursor-pointer mb-5">
        <h1 className={staatliches.className}>PickPix</h1>
      </div>
      <div className="flex flex-col items-center gap-[20px] w-full px-[40px]">
        <div className="flex flex-col gap-2 md:flex-row justify-around w-full">
          <h1> Rank These Photos!</h1>
          <div className="flex flex-row gap-2">
            <button
              onClick={handleClickOpen}
              className="secondary-btn p-0 rounded-full flex justify-center items-center w-[52px]"
            >
              <img src="/share-icon.svg" alt="share icon" className="w-3/4 h-3/4 object-contain" />
            </button>
            <button className="primary-btn flex-grow" onClick={handleSubmit}>
              SUBMIT RANKINGS
            </button>
          </div>
        </div>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              paddingBottom: "2rem",
            },
          }}
        >
          <DialogActions className="p-1">
            <button
              className={`{staatliches.className} hover:bg-gray-200 rounded-full w-8 h-8 flex justify-center items-center text-lg font-bold transition duration-100 ease-in-out`}
              onClick={handleClose}
            >
              &times;
            </button>
          </DialogActions>
          <div className="flex flex-col gap-4 px-6 pb-4">
            <h1 className={staatliches.className}>Copy the Session Link or ID Below</h1>
            <div className="flex flex-row gap-2">
              <div className="text-[18px] w-full outline-none px-4 py-2 rounded-[10px] bg-gray-100">
                {pathname}
              </div>
              <Tooltip
                onClose={() => setOpenTopTooltip(false)}
                open={openTopTooltip}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                arrow
                placement="top"
                title="Copied to Clipboard!"
                slotProps={{
                  popper: {
                    disablePortal: true,
                  },
                }}
              >
                <div
                  onClick={() => handleCopy(pathname, "top")}
                  className="w-[45px] flex justify-center items-center bg-gray-100 rounded-[10px] cursor-pointer hover:brightness-90"
                >
                  <img
                    src="/copy-icon.png"
                    alt="copy icon"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-row gap-2">
              <div className="text-[18px] w-full outline-none px-4 py-2 rounded-[10px] bg-gray-100 overflow-hidden whitespace-nowrap">
                {window.location.href}
              </div>
              <Tooltip
                onClose={() => setOpenBottomTooltip(false)}
                open={openBottomTooltip}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                arrow
                title="Copied to Clipboard!"
                slotProps={{
                  popper: {
                    disablePortal: true,
                  },
                }}
              >
                <div
                  onClick={() => handleCopy(window.location.href, "bottom")}
                  className="w-[45px] flex justify-center items-center bg-gray-100 rounded-[10px] cursor-pointer overflow-hidden hover:brightness-90"
                >
                  <img
                    src="/copy-icon.png"
                    alt="copy icon"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </Dialog>

        <div className="flex flex-row flex-wrap w-full justify-center items-center gap-5">
          {images.map((image) => {
            const clickIndex = clickOrder.indexOf(image.imageId);
            return (
              <div
                className="relative cursor-pointer rounded-[20px] md:max-w-[33%] lg:max-w-[25%] overflow-hidden"
                key={image.imageId}
                onClick={() => handleImageClick(image.imageId)}
              >
                <img src={image.imageUrl} alt={`Image ${image.imageId}`} className="w-full" />
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
