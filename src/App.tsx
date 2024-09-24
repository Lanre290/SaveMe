// import { useState } from 'react'
import { FaArrowRight, FaSave } from "react-icons/fa";
import "./App.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [videoId, setVideoId] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Duration, setDuration] = useState("");
  const [Title, setTitle] = useState("");
  const [Data, setData] = useState<{} | any>({});
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const extractYouTubeId = (url: any) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const decodeYouTubeDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    // Format hours, minutes, and seconds into h:mm:ss
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

        // setVideoId(extractYouTubeId(videoId));
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
          setDuration(body.contentDetails.duration);
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
          <h3 className="font-light text-4xl flex flex-row gap-x-4">
            <FaSave className="text-blue-500"></FaSave>
            SaveMe
          </h3>
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
                  className="w-full md:w-80 h-48 bg-gray-200"
                  style={{
                    backgroundImage: `url('${Data.snippet.thumbnails.high.url}')`,
                  }}
                ></div>
                <div className="flex flex-col justify-evenly w-full md:w-auto md:px-8 px-1 py-2 gap-y-2">
                  <h3 className="text-xl"> {Title} </h3>
                  <h3 className="font-light">{Duration}</h3>
                  <button className="px-8 py-3 w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-gray-50 text-2xl">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          <h3 className="text-4xl text-center w-full px-2 md:w-2/3 text-gray-900 mt-24">
            Guide to use SaveMe
          </h3>
          <h3 className="text-xl text-gray-900 text-center w-full px-2 md:w-2/3 mt-5">
            Easily download videos and music with SaveFrom.Net, the top Online
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
            <h3 className="text-4xl">SaveMe</h3>
            <h5 className="font-light text-gray-900">© 2008-2024</h5>
          </h3>
        </div>
      </div>

      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
