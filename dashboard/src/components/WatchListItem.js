import React from "react";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import WatchListAction from "./WatchListAction";

function WacthListItem({ stock }) {
  const [showWatchListActions, SetShowWatchListActions] = React.useState(false);

  const handleMouseEnter = (e) => SetShowWatchListActions(true);

  const handleMouseExit = (e) => SetShowWatchListActions(false);

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}>
      <div className="item">
        <div className="stock-name-section">
          <p className="stock-name">{stock.name}</p>
          {stock.exchange && <span className="exchange">{stock.exchange}</span>}
        </div>
        <div className="item-info">
          <span className={`change-value ${stock.isDown ? "down" : "up"}`}>
            {stock.change > 0 ? "+" : ""}{stock.change}
          </span>
          <span className={`percent ${stock.isDown ? "down" : "up"}`}>
            {stock.isDown ? <KeyboardArrowDown className="arrow-icon down" /> : <KeyboardArrowUp className="arrow-icon up" />}
            {stock.percent}
          </span>
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchListActions && <WatchListAction uid={stock.name} symbol={stock.symbol || stock.name} bse={`₹${stock.price}`} nse={`₹${stock.price}`} />}
    </li>
  );
}

export default WacthListItem;
