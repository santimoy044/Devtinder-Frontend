import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  console.log("Requests data:", requests);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, requestsList.length - itemsPerPage)
    );
  };

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log("Review response:", res.data);
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error("Error reviewing request:", error);
      setError(error.response?.data?.message || "Failed to process request");
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(BASE_URL + "/user/requests/interested", {
        withCredentials: true,
      });

      console.log("API response data:", response.data);

      if (typeof response.data === "string") {
        dispatch(addRequests([]));
      } else {
        const requestsData = response.data.connectionRequest || [];
        dispatch(addRequests(requestsData));
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center m-10 text-2xl">
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center m-10 text-2xl text-amber-500">
        {error}
      </div>
    );
  }

  if (!requests) {
    return (
      <div className="flex justify-center m-10 text-2xl">
        No request data available
      </div>
    );
  }

  // Ensure requests is an array
  const requestsList = Array.isArray(requests) ? requests : [];

  if (requestsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-pink-400 mb-2">
          No Connection Requests
        </h1>
        <p className="text-gray-400 text-center max-w-md">
          When other developers show interest in connecting with you, their
          requests will appear here.
        </p>
      </div>
    );
  }

  const visibleRequests = requestsList.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="text-center my-10 relative">
      <h1 className="font-bold text-3xl text-pink-400 p-4 mb-4">
        Requests ({requestsList.length})
      </h1>
      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-10 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-2xl z-10"
          >
            ←
          </button>
        )}
        <div className="flex flex-col items-center gap-4">
          {visibleRequests.map((request) => {
            console.log("Full request data:", request);
            console.log("FromUserid data:", request.fromUserid);
            console.log("Photo URL:", request.fromUserid?.photoURL);

            if (!request || !request.fromUserid) {
              console.warn("Invalid request data:", request);
              return null;
            }

            const { _id, firstName, lastName, photoURL, age, gender, about } =
              request.fromUserid;

            console.log("Extracted photoURL:", photoURL);

            return (
              <div
                key={_id}
                className="flex justify-between items-center m-2 p-2 rounded-lg bg-base-300 w-2/3 mx-auto"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center text-white font-semibold">
                  {photoURL ? (
                    <img
                      alt="Profile"
                      className="w-full h-full object-cover"
                      src={photoURL}
                      onError={(e) => {
                        console.log("Image failed to load:", e.target.src);
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `${firstName?.[0]}${lastName?.[0]}`;
                      }}
                    />
                  ) : (
                    <span>
                      {firstName?.[0]}
                      {lastName?.[0]}
                    </span>
                  )}
                </div>
                <div className="text-left m-4 p-4 flex-1">
                  <h2 className="font-bold text-xl">
                    {firstName + " " + lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-gray-400">{age + " • " + gender}</p>
                  )}
                  {about && <p className="mt-1 text-gray-300">{about}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {currentIndex + itemsPerPage < requestsList.length && (
          <button
            onClick={handleNext}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-2xl z-10"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
};

export default Requests;
