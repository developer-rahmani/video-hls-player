"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls, { Level } from "hls.js";
import Qualities from "./Qualities";
import PlayButton from "./PlayButton";

const Player = () => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const src =
    "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
  const [qualities, setQualities] = useState<Level[]>([]);
  const [hls, setHls] = useState<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQuality, setCurrentQuality] = useState<number | string>("");

  const updateQuality = (newQuality: number | string) => {
    if (newQuality === "auto") {
      if (hls) {
        hls.currentLevel = -1;
        setCurrentQuality(-1);
      }

      return;
    }

    qualities?.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        if (hls) {
          hls.currentLevel = levelIndex;
          setCurrentQuality(levelIndex);
        }

        return;
      }
    });
  };

  useEffect(() => {
    if (ref.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          //   xhrSetup: function (xhr) {
          //     xhr.setRequestHeader(
          //       "Authorization",
          //       `Bearer ${cookies.get("accessToken")}`
          //     );
          //   },
        });

        hls.loadSource(src);
        hls.attachMedia(ref.current);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          setQualities(hls.levels);
          setCurrentQuality(hls.currentLevel);

          setHls(hls);
        });
      } else {
        setQualities([]);
        setHls(null);
        ref.current.src = src;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (isPlaying) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    console.log("currentQuality", currentQuality);
  }, [currentQuality]);

  return (
    <div className="flex flex-col items-center gap-[24px]">
      <div className="w-full max-w-[1000px] aspect-video">
        <video ref={ref} className="w-full h-full rounded-[8px]" />
      </div>

      <div className="grid grid-cols-[150px_150px] h-[48px] items-center gap-[24px]">
        <PlayButton
          isPlaying={isPlaying}
          setIsPlaying={(status) => setIsPlaying(status)}
        />

        <Qualities
          currentQuality={currentQuality}
          qualities={qualities}
          updateQuality={updateQuality}
        />
      </div>
    </div>
  );
};

export default Player;
