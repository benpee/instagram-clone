import React, { useState } from 'react';
import classes from './ImageUpload.module.css';
import { Button } from '@material-ui/core';
import db, { storage } from '../firebase';
import firebase from 'firebase'


function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).uploadTask(image);

        uploadTask.onChange(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )

                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message)
            },
            () => {
                // task completed then function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloaded()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })

                        setProgress(0);
                        setImage(null);
                        setCaption("");
                    })
            }
        )
    }
    return (
        <div className={classes.imageUpload}>
            {/* image input and caption */}
            <progress className={classes.imageUpload__progress} value={progress} max="100"></progress>
            <input
                type="text"
                value={caption}
                placeholder="Enter a caption..."
                onChange={(e) => setCaption(e.target.value)}
            />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
