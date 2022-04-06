import React, { useContext, useState } from 'react';

import Web3Context from '../../store/web3-context';
import MarketplaceContext from '../../store/marketplace-context';
import web3 from '../../connection/web3';
import userAvatar from "../../img/icon.svg";
import ethereum from "../../img/ethereum.svg";
import { useToggle, formatPrice } from '../../helpers/utils';

import {
  Navbar,
  Nav,
  InputGroup,
  Input,
  NavItem,
  NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  ListGroup,
} from "reactstrap";

import "./Navigation.css";
import logo from "../../img/logo.svg";
import CollectionContext from '../../store/collection-context';

const Navigation = () => {
  const [fundsLoading, setFundsLoading] = useState(false);
  const [accountOpen, setAccountOpen] = useToggle(false);


  const web3Ctx = useContext(Web3Context);
  const marketplaceCtx = useContext(MarketplaceContext);
  const collectionCtx = useContext(CollectionContext);

  const connectWalletHandler = async () => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }

    // Load accounts
    web3Ctx.loadAccount(web3);
  };

  const claimFundsHandler = () => {
    marketplaceCtx.contract.methods.claimFunds().send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        setFundsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        setFundsLoading(false);
      });
  }

  // Event ClaimFunds subscription 
  if (marketplaceCtx.contract && marketplaceCtx.account) {
    marketplaceCtx.contract.events.ClaimFunds()
      .on('data', (event) => {
        marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
        setFundsLoading(false);
      })
      .on('error', (error) => {
        console.log(error);
      });
  }


  const etherscanUrl = "https://kovan.etherscan.io/";


  return (
    <Navbar>
      <a href="/"><img className="logo" src={logo} alt="logo" style={{ backgroundColor: "#131313" }} /></a>
      <Nav>
        <InputGroup className="search">
          <Input
            id="search-input"
            placeholder="Search"
            style={{ borderBottomLeftRadius: 4, borderTopLeftRadius: 4 }}
          />
        </InputGroup>
        <NavItem >
          <NavLink href="/marketplace" style={{ color: '#fff' }}>Marketplace</NavLink>
        </NavItem>
        <NavItem >
          <NavLink href="/create" style={{ color: '#fff' }}>Mint</NavLink>
        </NavItem>
        <Dropdown isOpen={accountOpen} toggle={setAccountOpen}>
          <DropdownToggle className="avatar rounded-circle">
            <img src={userAvatar} alt="Profile Icon" />

          </DropdownToggle>
          <DropdownMenu style={{ marginTop: 13, paddingTop: 0 }}>
            <ListGroup style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, paddingTop: 0, alignItems: "center" }}>
              {collectionCtx.contract && <DropdownItem href={`/collection?owner=${web3Ctx.account}`} style={{ height: 52, display: 'flex', alignItems: "center" }}>
                My Collection
              </DropdownItem>}
              <hr className="solid" style={{ marginTop: 0, marginBottom: 0, width: "100%" }} />
              <DropdownItem href={`${etherscanUrl}/address/${web3Ctx.account}`} style={{ height: 52, display: 'flex', alignItems: "center" }}>
                Transactions
              </DropdownItem>
              <hr className="solid" style={{ marginTop: 0, width: "100%" }} />
              {marketplaceCtx.userFunds && !fundsLoading &&
                <div style={{}}>
                  <div style={{ display: "flex" }}>
                    <img src={ethereum} alt="Ether Logo" style={{ height: "24px", paddingRight: "10px" }} />
                    <p style={{ textAlign: "center" }}>{formatPrice(marketplaceCtx.userFunds)}</p>
                  </div>
                  {marketplaceCtx.userFunds > 0 && <button onClick={claimFundsHandler} style={{ height: "2em", backgroundColor: "#32a189", border: "none" }}>Withdraw</button>}
                </div>
              }
              {fundsLoading && <div className="d-flex justify-content-center text-info">
                <div className="spinner-border" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>}

            </ListGroup>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  );

};

/* <nav className="navbar navbar-expand-sm navbar-light bg-white p-0">
<ul className="navbar-nav ms-auto">
  <li>
    <Link to="/">Home</Link>
  </li>
  <li>
    <Link to="/create">Create</Link>
  </li>
  <li>
    <Link to="/collection">Explore</Link>
  </li>
</ul>
</nav> */

export default Navigation;

/* <li className="nav-item">
          {marketplaceCtx.userFunds > 0 && !fundsLoading &&
            <button
              type="button"
              className="btn btn-info btn-block navbar-btn text-white"
              onClick={claimFundsHandler}
            >
              {`CLAIM ${formatPrice(marketplaceCtx.userFunds)} ETH`}
            </button>}
          {fundsLoading &&
            <div className="d-flex justify-content-center text-info">
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>}
        </li>
        <li className="nav-item">
          {web3Ctx.account &&
            <a
              className="nav-link small"
              href={`${etherscanUrl}/address/${web3Ctx.account}`}
              target="blank"
              rel="noopener noreferrer"
            >
              {web3Ctx.account}
            </a>}
          {!web3Ctx.account &&
            <button
              type="button"
              className="btn btn-info text-white"
              onClick={connectWalletHandler}
            >
              Connect your wallet
            </button>}
        </li> */