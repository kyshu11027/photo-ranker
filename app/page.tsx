"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { staatliches } from "@/app/fonts/fonts";
import PickPixHero from "@/public/pickpix-hero.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

const LandingPage = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const sessionSubmitted = () => {
    if (!sessionId) {
      window.alert("Session ID cannot be empty");
      return;
    }
    router.push("/" + sessionId);
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionId(e.target.value);
  };

  return (
    <div className="pt-20 md:pt-20 sm:pt-20 lg:pt-30">
      <div className="flex flex-row px-5 sm:px-10 md:px-20 w-[100vw] items-center gap-[15px]">
        <div className="flex flex-col md:gap-[31px] gap-[15px]">
          <h1 className={staatliches.className}> PickPix </h1>

          <h1>Welcome to PickPix, where your votes crown the ultimate photo champion! </h1>
          <p>
            Create or join a session to share photos and decide on the best ones with your friends{" "}
          </p>
          <button
            onClick={() => router.push("/new-session")}
            className="primary-btn w-[200px] md:w-[245px] mt-[20px] md:mt-[30px]"
          >
            CREATE A SESSION
          </button>
          <button onClick={handleClickOpen} className="secondary-btn w-[200px] md:w-[245px]">
            RATE PHOTOS
          </button>
        </div>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: "20px",
            },
          }}
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            <h1 className={staatliches.className}>Paste the Session ID Below</h1>
            <input
              className="text-[18px] w-full outline-none px-4 py-2 rounded-[10px] bg-slate-50"
              placeholder="Session ID"
              value={sessionId}
              onChange={handleInputChange}
            />
          </div>
          <DialogActions>
            <Button
              sx={{ fontFamily: "'Radley', sans-serif", borderRadius: "10px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{ fontFamily: "'Radley', sans-serif", borderRadius: "10px" }}
              onClick={sessionSubmitted}
              autoFocus
            >
              Go to Session
            </Button>
          </DialogActions>
        </Dialog>

        <div className="photo-hero hidden md:block">
          <Image
            src={PickPixHero}
            alt="PickPix Hero Image"
            className="md:max-2-[45vw] lg:max-w-[40vw] w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
