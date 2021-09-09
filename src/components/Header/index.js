import React from 'react';
import classes from './Header.module.css';

function Header() {

    return (
        <div className={classes.header}>
            <div className={classes.header__left}>
                <img
                    src="https://www.instagram.com/static/images/web/mobile"
                    alt="Instagram logo"
                    className={classes.app__headerImage}
                />
            </div>
            <div className={classes.header__center}></div>
            <div className={classes.header__right}></div>
        </div>
    )
}

export default Header
