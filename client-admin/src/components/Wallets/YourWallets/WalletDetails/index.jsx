import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import BreadCrumb from "./BreadCrumb";
import { WalletDetailsCard } from "../../WalletCards";
import TransactionDetails from "./TransactionDetails";
import AuthorizationRecord from "./AuthorizationRecord";
const mainStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
  },
}));

export default function ({ viewWalletDetails }) {
  const classes = mainStyles();
  let { walletAddress } = useParams();
  const [authorizationRecord, setAuthorizationRecord] = useState(true);
  const [address] = useState(walletAddress);
  const [wallet, setWallet] = useState({});

  useEffect(() => {
    // TODO Fetch from API
    setWallet(walletData);
  }, [address]);

  return (
    <div className={classes.root}>
      <AuthorizationRecord
        authorizationRecord={authorizationRecord}
        setAuthorizationRecord={setAuthorizationRecord}
      />
      <BreadCrumb
        walletName={wallet.name}
        viewWalletDetails={viewWalletDetails}
      />
      <WalletDetailsCard
        name={wallet.name}
        currency={wallet.currency}
        tags={wallet.tags}
        symbol={wallet.symbol}
        amount={wallet.amount}
        amountUSD={wallet.amountUSD}
        feesUSD={wallet.feesUSD}
        address={wallet.address}
      />
      <TransactionDetails
        address={address}
        setAuthorizationRecord={setAuthorizationRecord}
      />
    </div>
  );
}

// Mock Wallet Data. Will come from API and be passed from parent class
const walletData = {
  name: "Ethereum wallet test 1",
  currency: "Ethereum",
  tags: ["Unicef HQ"],
  symbol: "ETH",
  amount: 25,
  amountUSD: "4692.75",
  feesUSD: "1.75",
  address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
};
