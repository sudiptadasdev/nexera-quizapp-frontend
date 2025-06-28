import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/api';

const WeeklyScoreChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("user/dashboard/weekly-scores", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setData(res.data));
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Your Weekly Performance</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="average_score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyScoreChart;
