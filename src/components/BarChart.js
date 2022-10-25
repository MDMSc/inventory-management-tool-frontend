import React, { useState } from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

export default function BarChart({labels, title, data}) {
    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            backgroundColor: ["green"]
        }]
    });
  return (
    <Bar data={chartData} />
  )
}
