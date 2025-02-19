import React from "react";

const UserCard = ({ user }) => {
  console.log(user);
  const { firstName, lastName, age, gender, about, photoURL } = user;
  return (
    <div className="card bg-base-300 w-96 shadow-xl p-3">
      <figure>
        <img src={photoURL} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button className="btn btn-secondary">Intrested</button>
          <button className="btn btn-accent">Ignore</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
