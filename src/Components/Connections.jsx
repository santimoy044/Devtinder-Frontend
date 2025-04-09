import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection, removeConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  console.log("Connections data:", connections);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      dispatch(removeConnection());

      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      console.log("API response data:", response.data);

      // Check if response is a string (error message) or has connections property
      if (typeof response.data === "string") {
        // Backend returned a string message like "Connections list is empty"
        dispatch(addConnection([]));
      } else {
        // Backend returned JSON with connections array
        const connectionData = response.data.connections || [];
        dispatch(addConnection(connectionData));
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      dispatch(addConnection([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, connectionsList.length - itemsPerPage)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center m-10 text-2xl">
        Loading connections...
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

  if (!connections) {
    return (
      <div className="flex justify-center m-10 text-2xl">
        No connection data available
      </div>
    );
  }

  // Ensure connections is an array
  const connectionsList = Array.isArray(connections) ? connections : [];

  if (connectionsList.length === 0) {
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-green-300 mb-2">
          No Connections Yet
        </h1>
        <p className="text-gray-400 text-center max-w-md">
          Start exploring and connecting with other developers to build your
          network!
        </p>
      </div>
    );
  }

  const visibleConnections = connectionsList.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="text-center my-10 relative">
      <h1 className="font-bold text-3xl text-pink-400 mb-8">
        Connections ({connectionsList.length})
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
          {visibleConnections.map((connection) => {
            const { _id, firstName, lastName, photoURL, age, gender, about } =
              connection;

            return (
              <div
                key={_id}
                className="flex items-center m-2 p-2 rounded-lg bg-base-300 w-1/2 mx-auto"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center text-white font-semibold">
                  {photoURL ? (
                    <img
                      alt="Profile"
                      className="w-full h-full object-cover"
                      src={photoURL}
                      onError={(e) => {
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
              </div>
            );
          })}
        </div>
        {currentIndex + itemsPerPage < connectionsList.length && (
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

export default Connections;
