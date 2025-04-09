import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passWord, setpassWord] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [isLoginFrom, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          passWord,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (err) {
      setError(err.response.data);
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    try {
      if (!gender) {
        setError("Gender is required");
        return;
      }
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          email,
          passWord,
          gender,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Signup response:", res);

      // Check for successful signup message
      if (res.data === "User added Successfully") {
        try {
          // After successful signup, login with the same credentials
          const loginRes = await axios.post(
            BASE_URL + "/login",
            {
              email,
              passWord,
            },
            { withCredentials: true }
          );

          // Set user data from login response
          dispatch(addUser(loginRes.data.user));

          // Then try to fetch the feed
          try {
            const feedResponse = await axios.get(BASE_URL + "/user/feed", {
              withCredentials: true,
            });

            if (typeof feedResponse.data === "string") {
              dispatch(addFeed([]));
            } else {
              dispatch(addFeed(feedResponse.data.users || []));
            }
          } catch (feedError) {
            console.error("Error fetching feed:", feedError);
            dispatch(addFeed([]));
          }

          // Navigate to feed page
          return navigate("/");
        } catch (loginError) {
          console.error("Error logging in after signup:", loginError);
          setError(
            "Signup successful but login failed. Please try logging in."
          );
        }
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response?.data === "Email already exists") {
        setError("This email is already registered. Please try logging in.");
      } else {
        setError(error.response?.data || "An error occurred during signup");
      }
      console.log("Signup error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-96 bg-base-300 shadow-xl"
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-pink-400 mb-6">
            {isLoginFrom ? "Login" : "Sign Up"}
          </h2>
          {!isLoginFrom && (
            <>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </>
          )}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={passWord}
              onChange={(e) => setpassWord(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          {!isLoginFrom && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          {error && <p className="text-error text-sm mt-2">{error}</p>}
          <div className="card-actions justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary w-full"
              onClick={() => {
                isLoginFrom ? handleLogin() : handleSignUp();
              }}
            >
              {isLoginFrom ? "Login" : "Sign Up"}
            </motion.button>
          </div>
          <p className="text-center mt-4">
            {isLoginFrom ? "New to DevTinder? " : "Already have an account? "}
            <button
              className="text-pink-400 hover:underline"
              onClick={() => {
                setIsLoginForm(!isLoginFrom);
                setError("");
              }}
            >
              {isLoginFrom ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
