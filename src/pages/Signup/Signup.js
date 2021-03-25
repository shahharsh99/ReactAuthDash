import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import AlgoliaPlaces from 'algolia-places-react';
import { toastr } from "react-redux-toastr";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            error: ""
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { firstName, email, password, lastName, confirmPassword, address, city, state, country, pincode } = this.state;
        if (
            firstName === '' ||
            lastName === '' ||
            email === '' ||
            password === '' ||
            confirmPassword === "",
            address === '' ||
            city === '' ||
            state === '' ||
            country === '' ||
            pincode === ''
        ) {
            return this.setState({ error: 'Please fill all details' });
        } else if (password.length < 6 || confirmPassword.length < 6) {
            return this.setState({ error: 'Please enter at least 6 characters...' });
        } else if (password !== confirmPassword) {
            return this.setState({ error: 'Both passwords must be same' });
        } else {
            try {
                const { user } = await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );
                await createUserProfileDocument(user, {
                    firstName,
                    lastName,
                    // default avatar
                    photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-874ea.appspot.com/o/default-avatar.jpg?alt=media&token=e294ee8a-3a09-4225-a768-85bbc9988c22',
                    address,
                    city,
                    state,
                    country,
                    pincode
                });
                await user.updateProfile({
                    displayName: firstName + " " + lastName,
                });
                this.setState({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: ""
                })
                toastr.success("Successfully Signed Up")
            } catch (error) {
                const message = error ? error.message : 'Can\'t register';
                toastr.error('Error!', message);
            }
        }
    };

    handlePlaces = (suggestion) => {
        this.setState({
            address: suggestion.value,
            city: (suggestion.city) ? suggestion.city : suggestion.name,
            state: suggestion.administrative,
            country: suggestion.country,
            pincode: suggestion.postcode
        })
    }

    render() {
        return (
            <div className="container-wrapper container d-flex justify-content-center align-items-center">
                <div className="form-wrapper text-center">
                    <h2 className="text-center">Sign Up</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="name-wrapper d-flex">

                            <div className="form-group first-name mr-2">
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    id="first-name-input"
                                    placeholder="First Name"
                                    value={this.state.firstName}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group last-name">
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    id="last-name-input"
                                    placeholder="Last Name"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <AlgoliaPlaces
                            placeholder='Write an address here'

                            options={{
                                styles: "true"
                            }}

                            onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => {
                                console.log('Fired when suggestion selected in the dropdown or hint was validated.', suggestion)
                                return this.handlePlaces(suggestion);
                            }
                            }


                            onSuggestions={({ rawAnswer, query, suggestions }) =>
                                console.log('Fired when dropdown receives suggestions. You will receive the array of suggestions that are displayed.')}

                            onCursorChanged={({ rawAnswer, query, suggestion, suggestonIndex }) =>
                                console.log('Fired when arrows keys are used to navigate suggestions.')}

                            onClear={() =>
                                console.log('Fired when the input is cleared.')}

                            onLimit={({ message }) =>
                                console.log('Fired when you reached your current rate limit.')}

                            onError={({ message }) =>
                                console.log('Fired when we could not make the request to Algolia Places servers for any reason but reaching your rate limit.')}
                        />

                        <div className="form-group">
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                id="city-input"
                                placeholder="Enter city"
                                value={this.state.city}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="state"
                                className="form-control"
                                id="state-input"
                                placeholder="Enter state"
                                value={this.state.state}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="country"
                                className="form-control"
                                id="country-input"
                                placeholder="Enter country"
                                value={this.state.country}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="pincode"
                                className="form-control"
                                id="pincode-input"
                                placeholder="Enter pincode"
                                value={this.state.pincode}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="email-input"
                                placeholder="Enter Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password-input"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                id="password-input"
                                placeholder="Confirm Password"
                                value={this.state.confirmPassword}
                                onChange={this.handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <small><Link to="/login">Already have an Account?</Link></small>
                    {this.state.error.length ? (
                        <div className="alert alert-danger mt-3">{this.state.error}</div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Signup;
