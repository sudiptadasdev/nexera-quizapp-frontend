import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user details when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await res.json();
        setNameInput(userData.full_name || "");
        setBioInput(userData.about || "");
      } catch (err) {
        console.error("Could not load profile info:", err);
      }
    };

    fetchUserData();

    
    return () => {
      setNameInput("");
      setBioInput("");
    };
  }, []);

  // Submit profile changes
  const submitChanges = async () => {
    if (!nameInput.trim()) {
      alert("Name is required.");
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        full_name: nameInput,
        about: bioInput,
      };

      const res = await fetch("http://localhost:8000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Your profile was updated.");
      navigate("/profile/view");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to save changes.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>

      <label>Full Name</label>
      <input
        type="text"
        className="form-control mb-2"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Your name here"
      />

      <label>About You</label>
      <textarea
        className="form-control mb-3"
        rows={3}
        value={bioInput}
        onChange={(e) => setBioInput(e.target.value)}
        placeholder="Write something about yourself"
      />

      <button
        className="btn btn-success"
        onClick={submitChanges}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
