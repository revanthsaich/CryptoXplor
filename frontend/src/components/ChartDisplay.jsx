import React, { useEffect, useRef } from "react";
import { CandlestickSeries, createChart } from "lightweight-charts";

const ChartDisplay = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "black",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries,{
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Convert your chart `data` into candlestick format
    const formattedData = data.map((item) => ({
      time: item.time, // Must be UNIX timestamp (seconds) or ISO string
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candlestickSeries.setData(formattedData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-full"
    />
  );
};

export default ChartDisplay;
