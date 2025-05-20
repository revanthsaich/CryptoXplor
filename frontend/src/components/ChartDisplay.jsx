import React, { useEffect, useRef } from "react";
import { CandlestickSeries, createChart } from "lightweight-charts";

function formatTime(timestamp, selectedRange) {
  const date = new Date(timestamp * 1000);
  if (selectedRange === "1d") {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

const ChartDisplay = ({ data, selectedRange }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  const getThemeOptions = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
      layout: {
        background: { color: isDark ? "#111827" : "#ffffff" },
        textColor: isDark ? "#d1d5db" : "#1f2937",
      },
      grid: {
        vertLines: { color: isDark ? "#374151" : "#e5e7eb" },
        horzLines: { color: isDark ? "#374151" : "#e5e7eb" },
      },
      timeScale: {
        borderColor: isDark ? "#4b5563" : "#d1d5db",
      },
    };
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      ...getThemeOptions(),
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      watermark: { visible: false },
      timeScale: {
        ...getThemeOptions().timeScale,
        rightOffset: 1,
        barSpacing: 1,
        fixLeftEdge: true,
        fixRightEdge: true,
        borderVisible: true,
        tickMarkFormatter: (time) => formatTime(time, selectedRange),
      },
      localization: {
        priceFormatter: (price) =>
          price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }),
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#059669",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#059669",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 8,
        minMove: 0.00000001,
      },
    });

    const formattedData = data.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candlestickSeries.setData(formattedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // === 🔁 Detect theme changes dynamically ===
    const observer = new MutationObserver(() => {
      const themeOptions = getThemeOptions();
      chart.applyOptions(themeOptions);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [data, selectedRange]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg bg-white dark:bg-gray-900"
    />
  );
};

export default ChartDisplay;
