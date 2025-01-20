"use client";

import React, { useState, useEffect } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const HealthDashboard = () => {
  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock healthcare data
    const data = [
      { country: "India", mortalityRate: 12.3, lifeExpectancy: 70.8, cases: 5000, healthcareSpending: 3.5 },
      { country: "USA", mortalityRate: 7.5, lifeExpectancy: 78.9, cases: 12000, healthcareSpending: 16.9 },
      { country: "UK", mortalityRate: 8.1, lifeExpectancy: 80.5, cases: 8000, healthcareSpending: 10.2 },
      { country: "Germany", mortalityRate: 9.2, lifeExpectancy: 81.1, cases: 6000, healthcareSpending: 11.3 },
      { country: "France", mortalityRate: 6.8, lifeExpectancy: 82.3, cases: 7000, healthcareSpending: 11.5 },
      { country: "Japan", mortalityRate: 5.2, lifeExpectancy: 84.2, cases: 3000, healthcareSpending: 10.9 },
      { country: "Canada", mortalityRate: 7.1, lifeExpectancy: 82.2, cases: 4500, healthcareSpending: 11.2 },
      { country: "Australia", mortalityRate: 6.9, lifeExpectancy: 83.4, cases: 4000, healthcareSpending: 9.6 },
    ];
    setMockData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  // Prepare data for visualizations
  const countries = mockData.map((item) => item.country);
  const mortalityRates = mockData.map((item) => item.mortalityRate);
  const lifeExpectancies = mockData.map((item) => item.lifeExpectancy);
  const cases = mockData.map((item) => item.cases);
  const healthcareSpendings = mockData.map((item) => item.healthcareSpending);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Healthcare Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Bar Chart: Mortality Rates */}
        <div style={{ width: "45%", height: "300px" }}>
          <h2>Mortality Rates by Country</h2>
          <Bar
            data={{
              labels: countries,
              datasets: [
                {
                  label: "Mortality Rate (per 1000)",
                  data: mortalityRates,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Mortality Rates" },
              },
            }}
          />
        </div>

        {/* Line Chart: Life Expectancy */}
        <div style={{ width: "45%", height: "300px" }}>
          <h2>Life Expectancy by Country</h2>
          <Line
            data={{
              labels: countries,
              datasets: [
                {
                  label: "Life Expectancy (years)",
                  data: lifeExpectancies,
                  borderColor: "rgba(153, 102, 255, 1)",
                  backgroundColor: "rgba(153, 102, 255, 0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Life Expectancy" },
              },
            }}
          />
        </div>

        {/* Pie Chart: Case Distribution */}
        <div style={{ width: "45%", height: "300px" }}>
          <h2>Case Distribution by Country</h2>
          <Pie
            data={{
              labels: countries,
              datasets: [
                {
                  label: "Cases",
                  data: cases,
                  backgroundColor: [
                    "rgba(34, 139, 34, 0.6)", // Forest Green
                    "rgba(60, 179, 113, 0.6)", // Medium Sea Green
                    "rgba(144, 238, 144, 0.6)", // Light Green
                    "rgba(0, 128, 0, 0.6)", // Green
                    "rgba(50, 205, 50, 0.6)", // Lime Green
                    "rgba(107, 142, 35, 0.6)", // Olive Drab
                    "rgba(0, 255, 0, 0.6)", // Lime
                    "rgba(0, 128, 0, 0.6)", // Dark Green
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Case Distribution" },
              },
            }}
          />
        </div>


        {/* Scatter Plot: Healthcare Spending vs Life Expectancy */}
        <div style={{ width: "45%", height: "300px" }}>
          <h2>Healthcare Spending vs Life Expectancy</h2>
          <Scatter
            data={{
              datasets: [
                {
                  label: "Healthcare Spending vs Life Expectancy",
                  data: mockData.map((item) => ({
                    x: item.healthcareSpending,
                    y: item.lifeExpectancy,
                  })),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Healthcare Spending vs Life Expectancy" },
              },
              scales: {
                x: {
                  type: "linear", // Explicitly define the scale type
                  position: "bottom",
                  title: {
                    display: true,
                    text: "Healthcare Spending (% of GDP)",
                  },
                  ticks: {
                    stepSize: 2, // Customize step size if needed
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Life Expectancy (years)",
                  },
                },
              },
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default HealthDashboard;
