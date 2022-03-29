import React, { useEffect } from 'react';
import HelloWorld from '../../../abis/HelloWorld.json';
import web3 from '../../../connection/web3';



const MintForm = () => {

  useEffect(async () => {
    // const accounts = await web3.eth.getAccounts();
    // const account = accounts[0];
    const networkId = await web3.eth.net.getId();
    const helloWorldDeployedNetwork = HelloWorld.networks[networkId];
    const helloWorldContract = new web3.eth.Contract(HelloWorld.abi, helloWorldDeployedNetwork);
    helloWorldContract.options.address = "0x512B84BEAe1d67cE82EbcAeddE336f0F78Da2ac0"
    helloWorldContract.methods.renderHelloWorld().call().then((res) => {
      console.log(res);
    }

    );
    ;
  }, []);

  return (
    <p title="Free Web tutorials"></p>
  );
};

export default MintForm;