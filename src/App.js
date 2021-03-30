import React from 'react';
import { connect } from "react-redux"
import firebase from "firebase";
import { createUserProfileDocument } from './firebase/firebase.utils';
import { Switch, Route, withRouter, Redirect } from "react-router-dom"
import ReduxToastr from 'react-redux-toastr'
import Navbar from "./components/Navbar/Navbar";
import { setCurrentUser, clearUser } from './redux/user/user.actions';
import "./styles/styles.scss";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import EditProfile from "./pages/EditProfile/EditProfile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import Dashboard from './pages/Dashboard/Dashboard';
import CreateTask from './pages/ToDo/CreateTask';
import ToDoList from './pages/ToDo/ToDoList';
import ToDoDashboard from './pages/ToDo/ToDoDashboard';
import ToDoOverview from './pages/ToDo/ToDoOverview';

function App({ setUser, history, removeUser, auth }) {
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const userRef = await createUserProfileDocument(user);
                userRef.onSnapshot(snapShot => {
                    setUser({ id: snapShot.id, ...snapShot.data() });
                });
                history.push('/');
            } else {
                history.push('/login');
                removeUser();
            }
        });
    }, []);
    return (
        <div className="App">
            <Navbar />
            <Switch>
                <PrivateRoute auth={auth} exact path="/overview" component={ToDoOverview} />
                <PrivateRoute auth={auth} exact path="/todo/create-task" component={CreateTask} />
                <PrivateRoute auth={auth} exact path="/todo/:id/edit-task/:id" component={CreateTask} />
                <PrivateRoute auth={auth} exact path="/todo" component={ToDoList} />
                <PrivateRoute auth={auth} exact path="/todo-dashboard" component={ToDoDashboard} />
                <PrivateRoute auth={auth} exact path="/profile" component={Profile} />
                <PrivateRoute auth={auth} exact path="/profile/:id/edit" component={EditProfile} />
                <PrivateRoute auth={auth} exact path="/dashboard" component={Dashboard} />
                <PrivateRoute auth={{ isAuthenticated: !auth.isAuthenticated, loading: auth.loading }}
                    exact path="/login" component={Login} redirectTo={'/dashboard'} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route path="*" render={() => <Redirect to="/dashboard" />} />
            </Switch>
            <ReduxToastr
                timeOut={4000}
                newestOnTop={false}
                preventDuplicates
                position="top-right"
                getState={(state) => state.toastr}
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick />
        </div>
    )

}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    auth: {
        isAuthenticated: state.user.currentUser,
        loading: state.user.loading
    }

});

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setCurrentUser(user)),
    removeUser: () => dispatch(clearUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
