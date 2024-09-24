import { FaArrowRight } from "react-icons/fa";
import "./App.css";
import { useState } from "react";
import { toast } from "react-toastify";
import logo from "./assets/logo.png";

function App() {
  const [videoId, setVideoId] = useState("");
  const [Loading, setLoading] = useState(false);
  const [DownloadingVideo, setDownloadingVideo] = useState(false);
  const [Duration, setDuration] = useState("");
  const [Title, setTitle] = useState("");
  const [Data, setData] = useState<{} | any>({});
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const extractYouTubeId = (url: any) => {
    let videoId = null;
  
    // Regex for normal YouTube links (watch?v=, embed, v, etc.)
    const normalLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)([\w-]{11})/;
    
    // Regex for short YouTube links (youtu.be/)
    const shortLinkRegex = /(?:https?:\/\/)?youtu\.be\/([\w-]{11})/;
    
    // Regex for YouTube Shorts (/shorts/)
    const shortsLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]{11})/;

    // Test the URL with each regex
    if (normalLinkRegex.test(url)) {
      videoId = url.match(normalLinkRegex)[1];
    } else if (shortLinkRegex.test(url)) {
      videoId = url.match(shortLinkRegex)[1];
    } else if (shortsLinkRegex.test(url)) {
      videoId = url.match(shortsLinkRegex)[1];
    }

    return videoId;
  };

  const downloadVideo = async () => {
    setDownloadingVideo(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/download?url=${videoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      toast.error("Error while downloading file.");
      setDownloadingVideo(false);
    } else {
      setDownloadingVideo(false);
    }
  };

  const decodeYouTubeDuration = (duration: any) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    const formattedHours = hours > 0 ? hours + ":" : "";
    const formattedMinutes =
      hours > 0 ? String(minutes).padStart(2, "0") : minutes;
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();

    const getVideoData = async () => {
      try {
        if (videoId.length == 0) {
          throw new Error("Enter video link.");
        }

        setVideoId(extractYouTubeId(videoId));

        if (videoId == null) {
          throw new Error("Invalid link.");
        }
        console.log(videoId);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          let res = await response.json();
          console.log(res);
          let body = res.items[0];
          console.log(body);
          setLoading(false);
          setData(body);
          setTitle(Data.snippet.localized.title);
          setDuration(decodeYouTubeDuration(body.contentDetails.duration));
        } else {
          setLoading(false);
          throw new Error("Error");
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    getVideoData();
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-x-hidden overflow-y-auto">
        <nav className="w-full md:w-3/4 mx-auto h-20 flex flex-row items-center px-4 pt-6 pb-5 border-b border-gray-400">
          <a
            href="/"
            className="font-light text-4xl flex flex-row items-center gap-x-4"
          >
            <img src={logo} alt="logo" className="w-14 h-14" />
            SaveMe
          </a>
        </nav>
        <div className="flex flex-col justify-center items-center px-2 py-16">
          <h3 className="text-center text-4xl text-gray-900 font-light">
            Free Online video downloader
          </h3>
          <form
            className="w-full md:w-2/3 lg:w-2/5 rounded-3xl flex flex-row border-2 border-blue-500 mt-24"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="flex flex-grow text-xl p-5 py-4 rounded-tl-3xl rounded-bl-3xl"
              placeholder="Paste video link here..."
              onInput={(e: any) => setVideoId(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`cursor-pointer ${
                Loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              } text-gray-50 text-xl flex items-center justify-center w-16 rounded-tr-3xl rounded-br-3xl -mr-1`}
            >
              <FaArrowRight></FaArrowRight>
            </button>
          </form>

          <div className="my-10 w-full md:w-auto">
            {Loading && <div className="loader mx-auto my-10"></div>}
            {Object.keys(Data).length != 0 && Data != undefined && (
              <div className="flex flex-col md:flex-row justify-center border border-gray-500 p-5 w-full md:w-auto">
                <div
                  className="w-full md:w-80 h-48 bg-gray-200 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${Data.snippet.thumbnails.high.url}')`,
                  }}
                ></div>
                <div className="flex flex-col justify-evenly w-full md:w-auto md:px-8 px-1 py-2 gap-y-2">
                  <div className="flex flex-col">
                    <h3 className="text-xl"> {Title} </h3>
                    <h3 className="font-light">{Duration}</h3>
                  </div>
                  <button
                    className={`px-8 py-3 w-full md:w-auto flex justify-center items-center ${
                      DownloadingVideo == true
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-gray-50 text-2xl`}
                    onClick={downloadVideo}
                  >
                    {DownloadingVideo == false ? (
                      "Download"
                    ) : (
                      <svg
                        fill="#ffffff"
                        className="animate-spin text-primary mr-1 w-7 h-7"
                        aria-label="Loading..."
                        aria-hidden="true"
                        data-testid="icon"
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4.99787 2.74907C5.92398 2.26781 6.95232 2.01691 7.99583 2.01758V3.01758C7.10643 3.01768 6.23035 3.23389 5.44287 3.64765C4.6542 4.06203 3.97808 4.66213 3.47279 5.39621C2.9675 6.13029 2.64821 6.97632 2.54245 7.86138C2.51651 8.07844 2.5036 8.29625 2.50359 8.51367H1.49585C1.49602 8.23118 1.51459 7.94821 1.55177 7.66654C1.68858 6.62997 2.07326 5.64172 2.67319 4.78565C3.27311 3.92958 4.07056 3.23096 4.99787 2.74907Z"></path>
                        <path
                          opacity="0.15"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8 14.0137C11.0376 14.0137 13.5 11.5512 13.5 8.51367C13.5 5.47611 11.0376 3.01367 8 3.01367C4.96243 3.01367 2.5 5.47611 2.5 8.51367C2.5 11.5512 4.96243 14.0137 8 14.0137ZM8 15.0137C11.5899 15.0137 14.5 12.1035 14.5 8.51367C14.5 4.92382 11.5899 2.01367 8 2.01367C4.41015 2.01367 1.5 4.92382 1.5 8.51367C1.5 12.1035 4.41015 15.0137 8 15.0137Z"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <h3 className="text-4xl text-center w-full px-2 md:w-2/3 text-gray-900 mt-24">
            Guide to use SaveMe
          </h3>
          <h3 className="text-xl text-gray-900 text-center w-full px-2 md:w-2/3 mt-5">
            Easily download videos and music with SaveMe, the top Online
            Video Downloader. Get your favorite media straight from the web
            without needing extra software. Our intuitive platform makes video
            downloading fast and hassle-free. Access a wide variety of content,
            from popular movies and trending TV shows to thrilling sports clips.
            Simply paste the video URL into the designated field and click the
            Download button.
          </h3>
          <h3 className="text-4xl text-center w-full px-2 md:w-2/3 text-gray-900 mt-24">
            Download High-Quality Videos
          </h3>
          <h3 className="text-xl text-gray-900 text-center w-full px-2 md:w-2/3 mt-5">
            Streaming videos online with a fast connection offers instant
            access, but offline playback has its benefits. SaveFrom.Net delivers
            a robust video downloader that preserves video quality, allowing you
            to download videos in crisp, high-definition MP4 format. With our
            trusted service, you can enjoy your favorite videos anytime,
            anywhere by converting and saving them as high-quality HD MP4 files.
          </h3>
        </div>

        <div className="w-full md:w-3/4 mx-auto h-20 flex flex-row items-center justify-center px-4 py-6 pt-20 border-t border-gray-400">
          <h3 className="font-light  flex flex-col gap-y-2 mt-6 py-6 pb-16">
            <span className="text-4xl">SaveMe</span>
            <span className="font-light text-gray-900">© 2008-2024</span>
          </h3>
        </div>
      </div>
    </>
  );
}

export default App;
