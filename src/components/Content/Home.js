import React from 'react';
import "./Home.css"

function Home() {

    return (
        <div>
            <div class="Buttons">
                <h1>Welcome to the world of NFTs! </h1>
                <h2>Discover, collect, and sell extraordinary NFTs.</h2>
                <a href="../collection" >
                    <button class="Discover">Discover </button>
                </a>
                <div class="divider" />
                <a href="../create">
                    <button type="button" class="Create">Create NFTs</button>
                </a>
            </div>

            <div class="NFT_Vorschau">
            </div>
        </div>
    );
}

export default Home;

