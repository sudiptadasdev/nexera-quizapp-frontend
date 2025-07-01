import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState("");

  
  useEffect(() => {
    setNameInput("");
    setBioInput("");
    setFormError("");
  }, []);

const submitChanges = async () => {
  setFormError("");

  if (!bioInput.trim()) {
    setFormError("About section is required.");
    return;
  }

  try {
    setIsUpdating(true);
    const token = localStorage.getItem("token");

    const payload = { about: bioInput.trim() };
    if (nameInput.trim()) {
      payload.full_name = nameInput.trim();
    }

    const res = await fetch("http://localhost:8000/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    
    if (res.ok) {
      navigate("/profile/view");
    } else {
      let errorMsg = "Failed to update profile.";
      try {
        const data = await res.json();
        if (data?.detail) {
          errorMsg = data.detail;
        }
      } catch (_) {
        // silent fail
      }
      setFormError(errorMsg);
    }
  } catch (err) {
    console.error("Profile update failed:", err);
    setFormError("An error occurred while updating.");
  } finally {
    setIsUpdating(false);
  }
};

  return (
    <div>
      <h4 className="mb-4">Edit Your Information</h4>

      <label>Full Name</label>
      <input
        type="text"
        className="form-control mb-2"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Enter your full name"
      />

      <label>
        About You <span className="text-danger">*</span>
      </label>
      <textarea
        className="form-control"
        rows={3}
        value={bioInput}
        onChange={(e) => setBioInput(e.target.value)}
        placeholder="Write something about yourself"
      />
      {formError && (
        <small className="text-danger d-block mt-1">{formError}</small>
      )}

      <button
        className="btn btn-success mt-3"
        onClick={submitChanges}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
