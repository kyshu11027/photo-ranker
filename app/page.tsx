"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { staatliches } from "@/app/fonts/fonts";
import PickPixHero from "@/public/pickpix-hero.png";

const LandingPage = () => {
  const router = useRouter();

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
          <button className="secondary-btn w-[200px] md:w-[245px]"> RATE PHOTOS </button>
        </div>

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
