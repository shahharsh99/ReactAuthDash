import React from 'react';
import { Link, useHistory } from "react-router-dom"
import { toastr } from 'react-redux-toastr'
import { auth } from '../../firebase/firebase.utils';
import "./ForgotPassword.scss"

const ForgotPassword = () => {
    const emailRef = React.useRef()
    // const { resetPassword } = 
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState('')
    const history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await auth.sendPasswordResetEmail(emailRef.current.value)
            toastr.success("Check your inbox for further Information")
            history.push("/login")
        } catch (err) {
            console.log(err);
            toastr.error('Failed to Reset Password')
        }
    };

    return (
        <div className="container-wrapper container d-flex justify-content-center align-items-center">
            <div className="form-wrapper text-center">
                <h2 className="text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="email" className="form-control" ref={emailRef} id="email-input" placeholder="Enter Email" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

                <small><Link to="/login">Login</Link></small><br />
                <small><Link to="/signup">Signup</Link></small>
                {/* <Link to="/signup"><button className="btn btn-secondary m-1 w-25">Signup</button></Link>
                <Link to="/login"><button className="btn btn-secondary m-1 w-25">Login</button></Link> */}
            </div>
        </div >
    );
};

export default ForgotPassword;
