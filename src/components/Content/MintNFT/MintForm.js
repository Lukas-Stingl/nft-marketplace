import React, { useContext, useEffect } from 'react';
import HelloWorld from '../../../abis/HelloWorld.json';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';



const MintForm = () => {
  useEffect(() => {
    const web3Ctx = useContext(Web3Context);
    const networkId = web3Ctx.loadNetworkId(web3);
    const helloWorldDeployedNetwork = HelloWorld.networks[networkId];
    const helloWorldContract = new web3.eth.Contract(HelloWorld, helloWorldDeployedNetwork);
    const helloWorld = helloWorldContract.methods.renderHelloWorld().send();
    console.log(helloWorld);
  }, []);

  return (
    <p title="Free Web tutorials"></p>
  );
};

export default MintForm;