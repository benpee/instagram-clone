import React, { useState, useEffect } from 'react';
import classes from './Posts.module.css';
import { Avatar } from '@material-ui/core';
import db from '../../firebase';

function Post({ username, imageUrl, caption, postId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;

        unsubscribe = db
            .collection("posts")
            .doc("postId")
            .collection('comments')
            .onSnapShot(snapshot => (
                setComments(
                    snapshot.docs.map(doc => doc.data9)
                )
            ));

        return () => {
            unsubscribe()
        }
    }, []);

    const postComment = (event) => { }
    return (
        <div className={classes.post}>
            <div className={classes.post__header}>
                {/* Avatar + username */}
                <Avatar src={imageUrl} alt="User photo" className={classes.post__avatar} />
                <h3>{username}</h3>
            </div>
            <img src="" alt="" className={classes.post__image} />
            <h4 className={classes.postText}><strong>{username}</strong> {caption}</h4>
            <div className={classes.post__text}>
                {/* username + caption */}
            </div>
            <div className={classes.post.comment}>
                {
                    comments.map((comment) => {
                        <p>
                            <b>{comment.username}</b> {comment.Test}
                        </p>
                        return;
                    })
                }
            </div>
            <form className={classes.commentBox}>
                <input
                    type="text"
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.vaue)}
                />
                <button
                    className={classes.post__button}
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post</button>
            </form>
        </div>
    )
}

export default Post
