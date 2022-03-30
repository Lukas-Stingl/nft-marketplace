import React from 'react';

function Create() {
    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => {
                    }}
                />
                <textarea
                    placeholder="Asset description"
                    className="mt-2 border rounded p-4"
                    onChange={e => {
                    }}
                />
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-8 border rounded p-4"
                    type="number"
                    onChange={e => {
                    }}
                />
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={e => {
                    }}
                />
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
                <button onClick={e => {
                }}
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                >Create NFT</button>
            </div>
        </div>);
}

export default Create;