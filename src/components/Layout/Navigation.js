import React//  { useContext, useState } 
  from 'react';

// import Web3Context from '../../store/web3-context';
// import MarketplaceContext from '../../store/marketplace-context';
// import web3 from '../../connection/web3';
// import { formatPrice } from '../../helpers/utils';

import {
  Navbar,
  Nav,
  InputGroupText,
  InputGroup,
  Input,
  Form,
  NavItem,
  NavLink,
} from "reactstrap";

import s from "./Navigation.css";
import logo from "../../img/logo.svg";

class Navigation extends React.Component {
  // const [fundsLoading, setFundsLoading] = useState(false);

  // const web3Ctx = useContext(Web3Context);
  // const marketplaceCtx = useContext(MarketplaceContext);

  // const connectWalletHandler = async () => {
  //   try {
  //     // Request account access
  //     await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   // Load accounts
  //   web3Ctx.loadAccount(web3);
  // };

  // const claimFundsHandler = () => {
  //   marketplaceCtx.contract.methods.claimFunds().send({ from: web3Ctx.account })
  //     .on('transactionHash', (hash) => {
  //       setFundsLoading(true);
  //     })
  //     .on('error', (error) => {
  //       window.alert('Something went wrong when pushing to the blockchain');
  //       setFundsLoading(false);
  //     });
  // };

  // // Event ClaimFunds subscription 
  // marketplaceCtx.contract.events.ClaimFunds()
  //   .on('data', (event) => {
  //     marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
  //     setFundsLoading(false);
  //   })
  //   .on('error', (error) => {
  //     console.log(error);
  //   });

  // let etherscanUrl;

  // if (web3Ctx.networkId === 3) {
  //   etherscanUrl = 'https://ropsten.etherscan.io'
  // } else if (web3Ctx.networkId === 4) {
  //   etherscanUrl = 'https://rinkeby.etherscan.io'
  // } else if (web3Ctx.networkId === 5) {
  //   etherscanUrl = 'https://goerli.etherscan.io'
  // } else {
  //   etherscanUrl = 'https://etherscan.io'
  // }

  render() {
    return (<Navbar
      className={`${s.root} d-print-none`}
      style={{ zIndex: 100, backgroundColor: '#323232' }}
    >
      <NavItem className={`${s.toggleSidebarNav} d-md-none d-flex mr-2`}>
        <NavLink
          className={s.logo}
          id="toggleSidebar"
          onClick={e => {
          }}
        >
          <img src={logo} height="66px" alt="logo" className="mb-2" />
        </NavLink>
      </NavItem>
      {/* <NavItem className={"d-md-down-block d-md-none ml-auto"}>
        <img
          src={search}
          alt="search"
          width="24px"
          height="23px"
          style={{ marginRight: 12 }}
        />
      </NavItem> */}
      <Form className={`d-md-down-none`} inline>
        <InputGroup
          // onFocus={this.toggleFocus}
          // onBlur={this.toggleFocus}
          className="input-group-no-border"
        >
          <Input
            id="search-input"
            placeholder="Search"
            className={s.headerSearchInput}
            style={{ borderBottomLeftRadius: 4, borderTopLeftRadius: 4 }}
          />
          <InputGroupText addonType={"prepend"}>
            Search
          </InputGroupText>
        </InputGroup>
      </Form>
      <Nav>
        <NavItem>
          <NavLink href="/create">Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/collection">Link</NavLink>
        </NavItem>
      </Nav>

    </Navbar>

    );
  }

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
            <div class="d-flex justify-content-center text-info">
              <div class="spinner-border" role="status">
                <span class="sr-only"></span>
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