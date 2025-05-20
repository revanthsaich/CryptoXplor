import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Sparklines, SparklinesLine } from "react-sparklines";
import React from "react";
import { useNavigate } from "react-router-dom";

function CoinList({ coins }) {
  const navigate = useNavigate();

  if (!coins || coins.length === 0) return <p>No data</p>;

  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}?timeline=7d`);
  };

  return (
    <div className="w-full h-full table-auto overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>1h</TableHead>
            <TableHead>24h</TableHead>
            <TableHead>7d</TableHead>
            <TableHead>24h Volume</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Last 7 Days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin, index) => (
            <TableRow
              key={coin.id}
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => handleRowClick(coin.id)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-5 h-5"
                  />
                  {coin.name}
                </div>
              </TableCell>
              <TableCell>${coin.current_price.toLocaleString()}</TableCell>
              <TableCell
                className={
                  coin.price_change_percentage_1h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </TableCell>
              <TableCell
                className={
                  coin.price_change_percentage_24h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </TableCell>
              <TableCell
                className={
                  coin.price_change_percentage_7d_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </TableCell>
              <TableCell>${coin.total_volume.toLocaleString()}</TableCell>
              <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
              <TableCell>
                {coin.sparkline_in_7d?.price ? (
                  <Sparklines
                    data={coin.sparkline_in_7d.price}
                    width={100}
                    height={20}
                  >
                    <SparklinesLine
                      color={
                        coin.price_change_percentage_7d_in_currency > 0
                          ? "green"
                          : "red"
                      }
                    />
                  </Sparklines>
                ) : (
                  <span>No data</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CoinList;
