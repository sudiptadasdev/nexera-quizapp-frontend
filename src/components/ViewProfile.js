import React, { useEffect, useState } from "react";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in or unable to load profile.</p>;

  return (
    <div>
      <h4 className="mb-4">Your Profile Overview</h4>
      <p><strong>Name:</strong> {user.full_name || "N/A"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>About:</strong> {user.about || "N/A"}</p>
    </div>
  );
};

export default ViewProfile;
