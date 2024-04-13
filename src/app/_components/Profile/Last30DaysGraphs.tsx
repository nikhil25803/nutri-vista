"use client";
import axios from "axios";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ReactTyped } from "react-typed";

interface ChartPoropsInterface {
  email: string;
  jwtToken: string;
}

interface CategoryPayloadInterface {
  userEmail: string;
  requestedCategory: string;
  jwtToken: string;
}

const DEFAULT_LABELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];

const DEFAULT_VALUES = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0,
];

export default function StatChart(props: ChartPoropsInterface) {
  // States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  // States
  const [currentValue, setCurrentValue] = useState("calories");
  const [fetchedState, setFetchedState] = useState("notfound");
  const [xLabelData, setXLabelData] = useState(DEFAULT_LABELS);
  const [yLabelData, setYLabelData] = useState(DEFAULT_VALUES);

  // Function to fetch category wise graph data
  const categoryGraphData = async (payload: CategoryPayloadInterface) => {
    // Call the API
    const dataResponse = await axios.get("/api/getDashboardGraph", {
      params: {
        useremail: payload.userEmail,
        category: payload.requestedCategory,
      },
      headers: {
        usertoken: payload.jwtToken,
      },
    });

    if (dataResponse.status === 200) {
      const res = {
        success: true,
        labels: dataResponse.data.labels,
        data: dataResponse.data.data,
      };

      return res;
    } else {
      const res = {
        success: false,
        labels: null,
        data: null,
      };

      return res;
    }
  };

  useEffect(() => {
    const callCategoryGraphData = async () => {
      setFetchedState("loading");

      const payload: CategoryPayloadInterface = {
        userEmail: props.email,
        requestedCategory: currentValue,
        jwtToken: props.jwtToken,
      };

      try {
        const graphData = await categoryGraphData(payload);

        if (graphData.success) {
          setXLabelData(graphData.labels);
          setYLabelData(graphData.data);

          setFetchedState("found");
        } else {
          setFetchedState("notfound");
        }
      } catch (error) {
        toast.error("Error fetching graph data.", {
          id: "error-while-fetching-data",
        });
        setFetchedState("notfound");
      }
    };

    callCategoryGraphData();
  }, [currentValue]);

  useEffect(() => {
    const data = {
      labels: xLabelData,
      datasets: [
        {
          label: currentValue.toUpperCase(),
          data: yLabelData,
          fill: true,
          borderColor: "rgb(232, 97, 68)",
          backgroundColor: "rgb(57, 74, 98)",
          pointHoverBorderColor: "rgb(232, 97, 68)",
          tension: 0.1,
        },
      ],
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current && fetchedState === "found") {
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [xLabelData, yLabelData, fetchedState]);

  return (
    <section className="bg-backgroundDark mt-10 rounded-xl p-5">
      <div className="flex flex-col items-center">
        <h1 className="text-xl md:text-3xl">Last 30 Days Chart</h1>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-10 py-10 text-lg md:text-xl text-center">
          <button
            className={
              currentValue === "calories"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("calories")}
          >
            Calories
          </button>
          <button
            className={
              currentValue === "fats"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("fats")}
          >
            Fat
          </button>
          <button
            className={
              currentValue === "carbs"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("carbs")}
          >
            Carbs
          </button>
          <button
            className={
              currentValue === "sodium"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("sodium")}
          >
            Sodium
          </button>
          <button
            className={
              currentValue === "sugars"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("sugars")}
          >
            Sugars
          </button>
          <button
            className={
              currentValue === "protein"
                ? "border-b-2 border-textDark"
                : "border-b-2 border-textWhite hover:border-textDark transition duration-300"
            }
            onClick={() => setCurrentValue("protein")}
          >
            Protein
          </button>
        </div>
        <div className="w-full  bg-backgroundLight p-5 flex flex-row items-center justify-center">
          {fetchedState === "found" ? (
            <canvas
              ref={canvasRef}
              id="acquisitions"
              className="w-full max-w-full self-center"
            ></canvas>
          ) : fetchedState === "loading" ? (
            <h1 className="text-3xl py-36 text-white">
              Loading{" "}
              <span>
                <ReactTyped
                  className="text-textDark"
                  strings={["..."]}
                  typeSpeed={75}
                  loop={false}
                  cursorChar="."
                />
              </span>
            </h1>
          ) : (
            <h1 className="text-3xl py-36 text-white">No data found</h1>
          )}
        </div>
      </div>
    </section>
  );
}
