import React//  { useContext, useState } 
  from 'react';

// import Web3Context from '../../store/web3-context';
// import MarketplaceContext from '../../store/marketplace-context';
// import web3 from '../../connection/web3';
// import { formatPrice } from '../../helpers/utils';

import {
  Navbar,
  Nav,
  InputGroup,
  Input,
  Form,
  NavItem,
  NavLink,
} from "reactstrap";

import "./Navigation.css";
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
    return (
      <Navbar class="navbar">
        <a href="/"><img class="logo" src={logo} alt="logo" /></a>
        <Nav>
          <Form class="search" inline style={{ marginRight: "100px" }}>
            <InputGroup
              // onFocus={this.toggleFocus}
              // onBlur={this.toggleFocus}
              className="input-group-no-border"
            >
              <Input
                id="search-input"
                placeholder="Search"
                style={{ borderBottomLeftRadius: 4, borderTopLeftRadius: 4 }}
              />
            </InputGroup>
          </Form>
          <NavItem >
            <NavLink href="/create" style={{ color: '#fff' }}>Mint</NavLink>
          </NavItem>
          <NavItem class="navlink">
            <NavLink class="navlink" href="/collection" style={{ color: '#fff' }}>Collection</NavLink>
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