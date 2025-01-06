import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Image from "next/image";

export default function Home() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
      });
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
      setIsLoaded(true);
    };

    loadFFmpeg();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setErrorMessage("");
    const files = e.dataTransfer.files;
    let image = null;
    let audio = null;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        image = file;
      } else if (file.type.startsWith("audio/")) {
        audio = file;
      }
    }

    if (image) {
      setImageFile(image);
    }
    if (audio) {
      setAudioFile(audio);
    }
    if (!image && !audio) {
      setErrorMessage("Veuillez déposer une image et un fichier audio.");
    }
  };

  const handleFileSelect = (e) => {
    setErrorMessage("");
    const files = e.target.files;
    let image = null;
    let audio = null;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        image = file;
      } else if (file.type.startsWith("audio/")) {
        audio = file;
      }
    }

    if (image) {
      setImageFile(image);
    }
    if (audio) {
      setAudioFile(audio);
    }
    if (!image && !audio) {
      setErrorMessage("Veuillez sélectionner une image et un fichier audio.");
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      alert("FFmpeg is not loaded yet");
      return;
    }

    if (!imageFile || !audioFile) {
      alert("Veuillez sélectionner une image et un fichier audio.");
      return;
    }

    setIsProcessing(true);

    const getAudioDuration = async (file) => {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        audio.src = URL.createObjectURL(file);
      });
    };

    const audioDuration = await getAudioDuration(audioFile);
    const videoDuration = Math.ceil(audioDuration);

    ffmpeg.FS("writeFile", "image.jpg", await fetchFile(imageFile));
    ffmpeg.FS("writeFile", "audio.wav", await fetchFile(audioFile));

    ffmpeg.setLogger(({ message }) => {
      const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const seconds = parseInt(timeMatch[3], 10);
        const centiseconds = parseInt(timeMatch[4], 10);
        const currentTime =
          hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
        const progressPercentage = (currentTime / audioDuration) * 100;
        setProgress(Math.min(progressPercentage, 100));
      }
    });

    await ffmpeg.run(
      "-framerate",
      "1",
      "-loop",
      "1",
      "-r",
      "1",
      "-i",
      "image.jpg",
      "-i",
      "audio.wav",
      "-c:v",
      "libx264",
      "-tune",
      "stillimage",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black",
      "-t",
      videoDuration.toString(),
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(videoBlob);

    const audioFileName = audioFile.name.split(".").slice(0, -1).join(".");

    setVideoUrl(videoUrl);
    setVideoFileName(`${audioFileName}.mp4`);
    setIsProcessing(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white bg-gradient-background text-black h-screen text-center">
      <div className="flex justify-center items-end">
        <h1 className="text-5xl p-24 font-sans font-bold">
          Video<strong className="font-bold text-red-600">Maker</strong>
        </h1>
      </div>
      <div className="w-full flex flex-col items-center">
        {videoUrl ? (
          <div className=" lg:w-2/4 w-2/3 flex flex-col items-center">
            <div className="shadow-[10px_10px_20px_#c4c4c4,_-10px_-10px_20px_#ffffff] bg-[#e6e6e6] p-3 rounded-2xl">
              <video
                id="outputVideo"
                controls
                src={videoUrl}
                className="w-full rounded-xl"
              ></video>
            </div>
            <div className="pt-24 flex justify-center space-x-4">
              <a
                href={videoUrl}
                download={videoFileName}
                className="relative button p-3 rounded-2xl z-10 shadow-[5px_5px_10px_#c4c4c4,_-5px_-5px_10px_#ffffff] bg-[#e6e6e6]"
              >
                <span className="relative z-20">Télécharger la vidéo</span>
              </a>
              <button
                onClick={handleRefresh}
                className="relative button p-3 rounded-2xl z-10 shadow-[5px_5px_10px_#c4c4c4,_-5px_-5px_10px_#ffffff] bg-[#e6e6e6]"
              >
                <span className="relative z-20">Créer une nouvelle vidéo</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            id="mediaForm"
            onSubmit={handleSubmit}
            className="lg:w-2/4 w-2/3 flex flex-col"
          >
            {!isProcessing && (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleButtonClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="drop-zone h-96 rounded-2xl flex flex-col items-center justify-center transition duration-200 ease-in-out cursor-pointer bg-[#e6e6e6] shadow-[inset_10px_10px_20px_#c4c4c4,_inset_-10px_-10px_20px_#ffffff] hover:shadow-[inset_15px_15px_30px_#c4c4c4,_inset_-15px_-15px_30px_#ffffff]"
              >
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  multiple
                  onChange={handleFileSelect}
                />
                {imageFile && <p>{imageFile.name}</p>}
                {audioFile && <p>{audioFile.name}</p>}
                {!imageFile && !audioFile && (
                  <div
                    className={`rounded-lg transition duration-200 ease-in-out flex flex-col items-center justify-center ${
                      hovered ? "scale-95" : "scale-100"
                    }`}
                  >
                    <div className="relative w-16 h-16 p-2">
                      <Image
                        src="/images/folder1.svg"
                        alt="Folder"
                        width={50}
                        height={50}
                        className={`transition duration-200 ease-in-out absolute z-10 ${
                          hovered ? "opacity-0" : "opacity-100"
                        }`}
                      />
                      <Image
                        src="/images/folder2.svg"
                        alt="Folder"
                        width={50}
                        height={50}
                        className="transition duration-200 ease-in-out absolute"
                      />
                    </div>
                    <div className="p-4">
                      <p className={`transition duration-200 ease-in-out`}>
                        Ajoutez une image et un fichier audio
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {errorMessage && <p className="error">{errorMessage}</p>}
            {isProcessing && (
              <div className="h-96 flex flex-col justify-center items-center">
                <div className="w-full bg-[#e6e6e6] shadow-[inset_10px_10px_20px_#c4c4c4,_inset_-10px_-10px_20px_#ffffff] rounded-full h-5 ">
                  <div
                    className=" h-5 rounded-lg shadow-[5px_5px_10px_#c4c4c4,_-5px_-5px_10px_#ffffff] bg-gradient-red transition duration-200 ease"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="p-10">Chargement...</div>
              </div>
            )}
            <div className="pt-24 flex justify-center">
              {!isProcessing && (
                <button
                  type="submit"
                  className="relative button p-3 rounded-2xl z-10 shadow-[5px_5px_10px_#c4c4c4,_-5px_-5px_10px_#ffffff] bg-[#e6e6e6]"
                >
                  <span className="relative z-20">Créer la vidéo</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
