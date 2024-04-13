"use client";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function StatChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  useEffect(() => {
    const data = {
      labels: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "Z",
      ],
      datasets: [
        {
          label: "Calories",
          data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: "rgb(232, 97, 68)",
          backgroundColor: "rgb(57, 74, 98)",
          pointHoverBorderColor: "rgb(232, 97, 68)",
          tension: 0.1,
        },
      ],
    };

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: data,
        options: {
          scales: {
            x: {
              grid: {
                color: "rgb(232, 97, 68)",
              },
              ticks: {
                color: "white",
              },
            },
            y: {
              grid: {
                color: "rgb(232, 97, 68)",
              },
              ticks: {
                color: "white",
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="bg-backgroundDark mt-10 rounded-xl p-5">
      <div className="flex flex-col items-center">
        <h1 className="text-xl md:text-3xl">Last 30 Days Chart</h1>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-10 py-10 text-lg md:text-xl text-center">
          <button className="border-b-2 border-textDark">Calories</button>
          <button className="border-b-2 border-textWhite hover:border-textDark transition duration-300">
            Fat
          </button>
          <button className="border-b-2 border-textWhite hover:border-textDark transition duration-300">
            Carbs
          </button>
          <button className="border-b-2 border-textWhite hover:border-textDark transition duration-300">
            Sodium
          </button>
          <button className="border-b-2 border-textWhite hover:border-textDark transition duration-300">
            Sugars
          </button>
          <button className="border-b-2 border-textWhite hover:border-textDark transition duration-300">
            Protein
          </button>
        </div>
        <div className="w-full  bg-backgroundLight p-5 flex flex-row items-center justify-center">
          <canvas
            ref={canvasRef}
            id="acquisitions"
            className="w-full max-w-full self-center"
          ></canvas>
        </div>
      </div>
    </section>
  );
}
