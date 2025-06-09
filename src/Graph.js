import React, {} from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const Graph = ({ workoutsByDay }) => {
    // Convert workoutsByDay into a sorted array
    const data = Object.entries(workoutsByDay)
      .filter(([_, value]) => value.weight)
      .map(([date, value]) => ({
        date,
        weight: parseFloat(value.weight)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    return (
      <div className = "graph-container">
        <h2 className="graph-header">Body Weight Progress</h2>
        <div className="graph-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    );
  };

export default Graph;
