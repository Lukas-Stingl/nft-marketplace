import React from 'react';
import "./mint.css"

class Create extends React.Component {



    render() {
        return (
            <section class="createform">
                <h1>Create new Item</h1>
                <h3>Name</h3>
                <div>
                    <input
                        placeholder="Asset Name"
                        onChange={e => {
                            this.nftName = e;
                        }} />
                </div>
                <h3>NFT Description</h3>
                <h4>The description will be included on the item's detail page underneath its image. </h4>
                <div>
                    <textarea
                        placeholder="Provide a detailed description of your Item"

                        onChange={e => {
                        }}
                    />
                </div>
                <h3>NFT Price</h3>
                <h4>Here you can input a price for your NFT</h4>
                <div>
                    <input
                        placeholder="Asset Price in Eth"
                        type="number"
                        onChange={e => {
                        }}
                    />
                </div>
                <h3>Title</h3>
                <h4>Here you can upload a picture of your NFT</h4>
                <div>
                    <input
                        type="file"
                        name="Asset"
                        className="my-4"
                        onChange={e => {
                        }}
                    />
                </div>
                {/* {
                    fileUrl && (

                    <Image
                        src={fileUrl}
                        alt="Picture of the author"
                        className="rounded mt-4"
                        width={350}
                        height={500}
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                    />
                    )
                } */}

                <div>
                    <button onClick={e => {

                    }}
                    >Create NFT
                    </button>
                </div>
            </section>
        );
    }
}

export default Create;