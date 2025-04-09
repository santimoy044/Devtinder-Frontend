import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstname] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (age && (isNaN(age) || age < 18 || age > 100)) {
      setError("Age must be between 18 and 100");
      return false;
    }
    return true;
  };

  const saveProfile = async () => {
    setError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert skills string to array, trim whitespace, and filter out empty strings
      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      // Only include fields that have values
      const profileData = {};

      if (firstName.trim()) profileData.firstName = firstName.trim();
      if (lastName.trim()) profileData.lastName = lastName.trim();
      if (photoURL.trim()) profileData.photoURL = photoURL.trim();
      if (age) profileData.age = parseInt(age);
      if (gender.trim()) profileData.gender = gender.trim();
      if (about.trim()) profileData.about = about.trim();
      if (skillsArray.length > 0) profileData.skills = skillsArray;

      console.log("Sending profile data:", profileData);

      const res = await axios.post(BASE_URL + "/profile/update", profileData, {
        withCredentials: true,
      });

      console.log("Response from server:", res.data);

      if (res.data.message === "Profile Updated Successfully") {
        dispatch(addUser(res.data.data));
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response?.data);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10 max">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name *</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name *</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    min="18"
                    max="100"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">PhotoURL</span>
                  </div>
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="https://example.com/image.jpg"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Skills (comma separated)</span>
                  </div>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="JavaScript, React, Node.js"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <textarea
                    placeholder="Tell us about yourself"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="textarea textarea-bordered w-full max-w-xs"
                    rows="4"
                  ></textarea>
                </label>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="card-actions justify-center mt-2">
                <button
                  className="btn btn-primary"
                  onClick={saveProfile}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-300 w-96 shadow-xl">
          <figure>
            <img
              src={
                photoURL ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E"
              }
              alt="Profile"
              className="w-full h-64 object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{firstName + " " + lastName}</h2>
            {age && gender && <p>{age + ", " + gender}</p>}
            <p>{about}</p>
            {skills && skills.length > 0 && (
              <div>
                <h3 className="font-semibold">Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(skills) ? (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-sm">
                      {skills}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center pt-20">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
