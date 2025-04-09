import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } =
    user;

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Request response:", res.data);
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card w-96 bg-base-300 shadow-xl overflow-hidden max-h-[550px]"
    >
      <div className="h-56 w-full overflow-hidden">
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
            {firstName?.[0]}
            {lastName?.[0]}
          </div>
        )}
      </div>

      <div className="card-body py-4 px-6">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-pink-400 text-center">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-pink-400/10 text-pink-400 rounded-full text-sm border border-pink-400/20">
                {age} years
              </span>
              <span className="px-3 py-1 bg-pink-400/10 text-pink-400 rounded-full text-sm border border-pink-400/20">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </span>
            </div>
          )}
        </div>

        {about && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-pink-400 mb-1">About</h3>
            <p className="text-gray-300 text-sm">{about}</p>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-pink-400 mb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(skills) ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-400/10 text-pink-400 rounded-full text-sm border border-pink-400/20"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-pink-400/10 text-pink-400 rounded-full text-sm border border-pink-400/20">
                  {skills}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary w-48"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-error w-48"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
