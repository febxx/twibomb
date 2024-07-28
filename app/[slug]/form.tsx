import { useTwibbonCanvas } from "@/hooks/useTwibbonCanvas";
import { useEffect, useState } from "react";
import Canvas from "./canvas";
import { FaFileImage } from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus, FaDownload } from "react-icons/fa6";

interface Props {
  data: {
    title: string;
    slug: string;
    creator: string;
    image: string;
  }
}

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Form({ data }: Readonly<Props>) {
  const { image, title, slug } = data;
  const canvasHook = useTwibbonCanvas();

  const [fileName, setFileName] = useState<string>();
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (slug) {
      window.history.pushState({}, "", `/${slug}`);
    }

    canvasHook.addBackground(image);
  }, [image, slug, canvasHook]);

  useEffect(() => {
    canvasHook.setScaled(scale);
  }, [scale, canvasHook]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">
      <div className="flex justify-center items-center space-y-4 flex-col">
        <Canvas
          width={canvasHook.recommendedSize.width}
          height={canvasHook.recommendedSize.height}
          canvasid="twibbon"
          ref={canvasHook.canvasRef}
        />
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          className="rounded-full bg-primary p-3 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
          onClick={() => setScale((prev) => prev - 0.01)}
        >
          <FaCircleMinus className="text-xl" />
        </button>
        <input
          id="zoom"
          type="range"
          min="0.2"
          max="3"
          step="0.01"
          value={scale}
          onChange={(e) => {
            setScale(parseFloat(e.currentTarget.value));
          }}
          className="bg-primary hover:bg-primary/80 !w-[10rem] md:!w-[15rem] mx-2"
        />
        <button
          className="rounded-full bg-primary p-3 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
          onClick={() => setScale((prev) => prev + 0.01)}
        >
          <FaCirclePlus className="text-xl" />
        </button>
      </div>
      <div className="flex flex-row items-center justify-around">
        <input
          type="file"
          id="foto"
          accept="image/png, image/jpeg, image/jpg"
          onChange={async (ev) => {
            setFileName(ev.currentTarget.files?.[0]?.name);

            if (ev.currentTarget.files?.length) {
              canvasHook.addFrame(
                URL.createObjectURL(ev.currentTarget.files[0])
              );
            }
          }}
          hidden
        />
        <label
          htmlFor="foto"
          className="flex items-center gap-2 truncate max-w-[18rem] md:max-w-sm rounded-md bg-black/20 py-3 px-4 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30 cursor-pointer duration-100"
        >
          <FaFileImage /> Choose image
        </label>
        <button
          onClick={() => {
            const data = canvasHook.toDataUrl();
            if (data) {
              downloadURI(
                data,
                `Twibbon ${title}.jpg`
              );
            }
          }}
          className="rounded-md flex items-center gap-2 bg-primary py-3 px-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
        >
          <FaDownload /> Download
        </button>
      </div>
    </div>
  );
}