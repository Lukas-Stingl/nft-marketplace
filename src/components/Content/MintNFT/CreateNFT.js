import React from 'react';
import "./mint.css"

function Create() {
    return (
        <section class="createform">
            <h1>FIOEZGBCOEIUZGBFOUI</h1>
            <h3>Title</h3>
            <h4>Subtitle</h4>
            <div>
                <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => {
                    }} />
            </div>
            <h3>Title</h3>
            <h4>Subtitle</h4>
            <div>
                <textarea
                    placeholder="Asset description"
                    className="mt-2 border rounded p-4"
                    onChange={e => {
                    }}
                />
            </div>
            <h3>Title</h3>
            <h4>Subtitle</h4>
            <div>
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-8 border rounded p-4"
                    type="number"
                    onChange={e => {
                    }}
                />
            </div>
            <h3>Title</h3>
            <h4>Subtitle</h4>
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

export default Create;