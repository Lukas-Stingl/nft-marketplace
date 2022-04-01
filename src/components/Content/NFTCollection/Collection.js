import React from 'react';
import './Collection_styles.css'; //tell this .js to use the Stylessheet
import eth from '../../../img/ethereum.svg';

function Collection() {
    return (
    <html>
    <head>
    </head>
    <style>
    </style>
        <body>
    <section class="heading">
            <h2 align="center">
                NFT Collection
            </h2>
            <p align="center">
                Explore the World of NFTs
            </p>
    </section>
  <section class="boxes">
          <div class="boxes-items one">
                <div class="nft">
                <i class="fa fa-4x fa-laptop">&nbsp;</i>
                <img src={eth} width="100" height="100" class="center"></img>
                </div>
                  <p class="name">Cat</p>
                  <p class="price"> 1 ETH </p>
          </div>
          <div class="boxes-items two">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2> NFT #2</h2>
                <p class="name">Human</p>
        </div>
          <div class="boxes-items three">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #3</h2>
                <p class="name">Dog</p>
         </div>
          <div class="boxes-items four">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #4</h2>
                <p class="name">Rabbit</p>
          </div>
          <div class="boxes-items five">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #5</h2>
                <p class="name">Horse</p>
          </div>
          <div class="boxes-items six">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #6</h2>
                <p class="name">Horse</p>
          </div>
          <div class="boxes-items seven">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #7</h2>
                <p class="name">Horse</p>
          </div>
          <div class="boxes-items eight">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #8</h2>
                <p class="name">Horse</p>
          </div>
          <div class="boxes-items nine">
                <i class="fa fa-4x fa-cog">&nbsp;</i>
                <h2>NFT #9</h2>
                <p class="name">Horse</p>
          </div>
  </section>
        </body>
    </html>   
    );
}

export default Collection;
