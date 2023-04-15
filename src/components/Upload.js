import React from 'react';
import { useState } from "react";

import lighthouse from '@lighthouse-web3/sdk';

const Upload = ({ contract, account, provider }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const [fileURL, setFileURL] = useState("");
    const [data, setData] = useState([]);

    const [items, setItems] = useState([]);

    const [cid, setCID] = useState("");




    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };

    const deploy = async (e) => {
        e.preventDefault();
        
        // Push file to lighthouse node
        // Both file and folder supported by upload function

        const output = await lighthouse.upload(e, "6dd6ec11.39c98da96a2c4a06824928c360b3777f", progressCallback);
        console.log('File Status:', output);
        // console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);

        setData([...data, 'https://gateway.lighthouse.storage/ipfs/' + output.data.Hash]);
        setFileURL('https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);
        contract.add(account, fileURL);
        // console.log(data);
        const link = JSON.stringify(data);
        console.log(link);
        // localStorage.setItem('myData', link);
        

        // console.log('https://gateway.lighthouse.storage/ipfs'+output.data.Hash)
    }

    const retreiveFile = (e) => {
        const data = e.target.files[0]; //files array of files object
        // console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        };
        setFileName(e.target.files[0].name);
        e.preventDefault();
    }




    const get = async () => {
        // const item = localStorage.getItem('myData');
        // console.log(item);
        const lighthouse = require('@lighthouse-web3/sdk');
        const uploads = await lighthouse.getUploads(account);
        setItems(uploads.data.fileList);
        // console.log(items);
        setCID(uploads.data.fileList[0].cid);

        items.map((i) => {
            console.log(i.cid)
        })
        // console.log('https://gateway.lighthouse.storage/ipfs/'+cid)
    }

    return (
        <div>
            <form onChange={e => deploy(e)}>
                <label htmlFor="file-upload" className="choose">
                    Choose Image
                </label>
                <input
                    disabled={!account}
                    id="file-upload"
                    name="data"
                    // onChange={e => deploy(e)}
                    onChange={retreiveFile}
                    type="file"
                />
                <span className="textArea">Image: {fileName}</span>
            </form>
            {/* {fileURL && (
                <div>
                    <img src={fileURL}></img>
                </div>
            )} */}
            {data !== undefined &&
                <div className='files'>
                    <ul>
                        {data.map((file, i) =>
                            <>
                                <img src={file}></img>
                            </>
                        )}

                    </ul>

                </div>
            }
            <button onClick={get}>Get</button>

            
            {items && 
                <>
                {items.map((item) =>
                    <>
                    <img src={`https://gateway.lighthouse.storage/ipfs/${item.cid}`} />
                      
                    </>
                  )}
                </>
            }




        </div>
    );
}

export default Upload;
