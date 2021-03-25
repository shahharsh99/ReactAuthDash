import React from 'react';
import { connect } from "react-redux"
import { toastr } from "react-redux-toastr";
import { auth } from '../../firebase/firebase.utils';
import { Link, NavLink, withRouter } from "react-router-dom"
import "./Navbar.scss"

const loggedOut = (
    <ul className="navbar-nav">
        <li className="nav-item">
            <NavLink
                activeClassName="active"
                exact
                to="/login"
                className="nav-link">Login</NavLink>
        </li>
        <li className="nav-item">
            <NavLink
                activeClassName="active"
                exact
                to="/signup" className="nav-link">Sign Up</NavLink>
        </li>
    </ul>
);

const Navbar = ({ history, currentUser }) => {
    const logout = async () => {
        try {
            await auth.signOut();
            toastr.success('Success!', 'Succesfully logged out');
            history.push("/login");
        } catch (e) {
            toastr.error('Success!', 'Something went wrong while logging out.');
        }
    }
    console.log("''''''''''''''''", currentUser);
    // const { photoUrl, firstName, lastName, quote, id, bio } = currentUser;

    const handleWelcome = () => {
        if ({ currentUser }) {
            return <>{currentUser?.firstName}</>
        }

    }
    return (
        <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
            <div className="container">
                <span className="navbar-brand">Welcome {handleWelcome()}</span>
                <div className="page-links">
                    {
                        currentUser ?
                            <center>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <NavLink exact to="/profile" className="nav-item">
                                            <img alt="profile" src={currentUser?.photoUrl} className="avatar"></img>
                                        </NavLink>
                                    </li>
                                    &nbsp;
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/profile"
                                            className="nav-link">Profile</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <Link onClick={logout} className="nav-link">Logout</Link>
                                    </li>
                                </ul>
                            </center> :
                            loggedOut
                    }
                </div>
            </div>
        </nav>
    );
};

export default connect(
    (state) => ({
        currentUser: state.user.currentUser
    })
)(withRouter(Navbar));
