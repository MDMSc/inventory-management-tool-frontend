import React, { useState } from 'react';
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

export default function PieChart({labels, title, data}) {
    let colors = [];
    let color;
    data.forEach(element => {
        color = Math.floor(Math.random()*16777215).toString(16);
        colors.push("#"+color);
    });
    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            backgroundColor: colors
        }]
    });
  return (
    <Pie data={chartData} />
  )
}
