import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const getFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      // Check if the response is a string (message) or an object with users
      if (typeof response.data === "string") {
        dispatch(addFeed([])); // Set empty array for no users
      } else {
        dispatch(addFeed(response.data.users || []));
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load feed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  console.log("Current feed state:", feed);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, feed.length - 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="flex justify-center m-52 text-3xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center m-52 text-3xl text-red-500">
        {error}
      </div>
    );
  }

  if (!feed || !Array.isArray(feed)) {
    console.log("Feed is not an array:", feed);
    return (
      <div className="flex justify-center m-52 text-3xl">
        No feed data available
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <motion.svg
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </motion.svg>
        <h1 className="text-2xl font-semibold text-pink-400 mb-2">
          No More Users to Show
        </h1>
        <p className="text-gray-400 text-center max-w-md">
          You've seen all the developers in your feed. Check back later for new
          profiles!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center my-10 relative pb-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-3xl text-pink-400 mb-8"
      >
        Discover Developers
      </motion.h1>
      <div className="relative h-[600px] mb-10">
        {currentIndex > 0 && (
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(236, 72, 153, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="absolute left-10 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-2xl z-10 w-16 h-16 border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white transition-all duration-300 shadow-lg"
          >
            <motion.span
              animate={{ x: [-5, 0, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
          </motion.button>
        )}
        <div className="flex justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute"
            >
              <UserCard
                key={feed[currentIndex]._id}
                user={feed[currentIndex]}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {currentIndex < feed.length - 1 && (
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(236, 72, 153, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-2xl z-10 w-16 h-16 border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white transition-all duration-300 shadow-lg"
          >
            <motion.span
              animate={{ x: [5, 0, 5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Feed;
