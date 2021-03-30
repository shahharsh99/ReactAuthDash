import React from 'react';
import { connect } from "react-redux"
import { toastr } from "react-redux-toastr";
import { auth } from '../../firebase/firebase.utils';
import { NavLink, withRouter } from "react-router-dom"
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
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/dashboard"
                                            className="nav-link">Dashboard</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/overview"
                                            className="nav-link">Overview</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/todo"
                                            className="nav-link">Task List</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/todo-dashboard"
                                            className="nav-link">Todo Dashboard</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            exact
                                            to="/profile"
                                            className="nav-link">Profile</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <a onClick={logout} className="nav-link">Logout</a>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink exact to="/profile" className="nav-item">
                                            <img src={currentUser?.photoUrl} className="avatar"></img>
                                        </NavLink>
                                    </li>
                                &nbsp;
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
