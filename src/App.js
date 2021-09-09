import React, { useState, useEffect, useRef } from 'react';
import classes from './App/module.css';
import Header from './components/Header';
import Post from './components/Post';
import db, { auth } from './firebase';
import { Modal, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed'

// npm i react-instagram-embed

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}))

const postList = [
    {
        id: 1,
        username: "ajibolaPius",
        imageUrl: "",
        caption: "Another great day in the church"
    },
    {
        id: 2,
        username: "ajibolaPius",
        imageUrl: "",
        caption: "Another great day in the church"
    },
    {
        id: 3,
        username: "ajibolaPius",
        imageUrl: "",
        caption: "Another great day in the church"
    },
    {
        id: 4,
        username: "ajibolaPius",
        imageUrl: "",
        caption: "Another great day in the church"
    },
];


function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState(postList);
    const [open, setOpen] = useState(false)
    const inputUserRef = useRef("");
    const inputEmailRef = useRef("");
    const inputPasswordRef = useRef("");
    const [user, setUser] = useState(null);
    const [openSiginIn, setOpenSiginIn] = useState(false)

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        })

        return () => {
            unsubscribe();
        }
    }, [user, inputUserRef])

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc')
            .onSnapShot(snapshot => (
                setPosts(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                )
            ))
    }, []);

    const signUp = (e) => {
        e.preventDefault();
        const username = inputUserRef.current.value;
        const email = inputEmailRef.current.value;
        const password = inputPasswordRef.current.value;

        auth
            .createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));

        inputEmailRef.current.value = "";
        inputPasswordRef.current.value = "";
        inputUserRef.current.value = "";
        setOpen(false);
    }

    const signIn = (event) => {
        event.preventDefault()
        const email = inputEmailRef.current.value;
        const password = inputPasswordRef.current.value;

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message))
        inputPasswordRef.current.value = inputEmailRef.current.value = "";
        setOpenSiginIn(false);
    }

    return (
        <div className={classes.app}>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className={classes.app__signup}>
                        <center>
                            <img
                                className={classes.app__headerImage}
                                src="https://www.instagram.com/static/images/web/mobile"
                                alt="Instagram logo"
                            />
                        </center>
                        <input
                            type="text"
                            value={inputUserRef}
                            placeholder="username"
                        />
                        <input
                            type="text"
                            value={inputEmailRef}
                            placeholder="email"
                        />
                        <input
                            type="text"
                            value={inputPasswordRef}
                            placeholder="password"
                        />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={openSiginIn}
                onClose={() => setOpenSiginIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className={classes.app__signup}>
                        <center>
                            <img
                                className={classes.app__headerImage}
                                src="https://www.instagram.com/static/images/web/mobile"
                                alt="Instagram logo"
                            />
                        </center>
                        <input
                            type="text"
                            value={inputEmailRef}
                            placeholder="email"
                        />
                        <input
                            type="text"
                            value={inputPasswordRef}
                            placeholder="password"
                        />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>
            <div className={classes.app__header}>
                <img
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo/png/735"
                    alt="Instagram logo"
                    className={classes.app__headerImage}
                />
                {user ?
                    <Button onClick={() => auth.signOut()}>Log Out</Button> :
                    <div className={classes.app__loginContainer}>
                        <Button type="submit" onClick={setOpenSiginIn(true)}>Sign In</Button>
                        <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                }
            </div>

            <div className={classes.app_posts}>
                <div className={classes.app__postsLeft}>
                    {
                        posts.map(({ post: { username, imageUrl, caption }, id }) => (
                            <Post
                                key={id}
                                postId={id}
                                username={username}
                                imageUrl={imageUrl}
                                caption={caption}
                            />
                        ))
                    }
                </div>
                <div className={classes.app_postsRight}>
                    <InstagramEmbed
                        url="https://instagr.am/p/Zw9o4"
                        maxwidth={320}
                        hideCaption={false}
                        conatainerTagName="div"
                        protocol=""
                        injectScript
                        onLoading={() => { }}
                        onSuccess={() => { }}
                        onAfterRender={() => { }}
                        onFailure={() => { }}
                    />
                </div>
            </div>

        </div >
    )
}

export default App
