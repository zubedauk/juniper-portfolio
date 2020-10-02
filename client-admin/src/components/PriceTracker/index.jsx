import React, { useState, useEffect } from "react";
import PriceTracker from "../templates/PriceTracker";
import PageLayout from "../../ui/Layout/PageLayout";

export default function PriceTracker({ prices, btcRate, ethRate }) {
  const [tabs] = useState(["Bitcoin", "Ethereum"]);

  return (
    <PageLayout tabs={tabs}>
      <PriceTracker
        currency={"Bitcoin"}
        prices={prices.bitcoin}
        currentPrice={btcRate}
      />
      <PriceTracker
        currency={"Ethereum"}
        prices={prices.ethereum}
        currentPrice={ethRate}
      />
    </PageLayout>
  );
}
