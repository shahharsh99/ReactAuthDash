import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom"
import { toastr } from 'react-redux-toastr'
import { firestore, imageUpload } from "../../firebase/firebase.utils";

import "./EditProfile.scss"

class EditProfile extends Component {
    state = {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        address: this.props.user.address,
        city: this.props.user.city,
        state: this.props.user.state,
        country: this.props.user.country,
        pincode: this.props.user.pincode,
        photoUrl: this.props.user.photoUrl,
        isImageUploading: false,
        imageUploadedPercentage: 0
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    };

    updateUser = () => {
        const { id } = this.props.user;
        const updateRef = firestore.collection('users').doc(id);
        return updateRef
            .update({
                ...this.state
            })
            .then(this.props.history.push('/profile'))
            .catch(function (error) {
                toastr.error('Error updating document: ', error);
            });
    };

    uploadImage = (e) => {
        const file = e.target.files[0];
        const filePath = `${file.name}_${this.props.user.id}`;
        const uploadTask = imageUpload(file, filePath);

        this.setState({
            isImageUploading: true
        })

        uploadTask.on('state_changed',
            (snapshot) => {
                // in proggress
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                this.setState({
                    imageUploadedPercentage: progress
                });
            },
            (error) => {
                // error
                toastr.error('Error!', error.message);
                this.setState({
                    isImageUploading: false
                })
            },
            () => {
                // completed
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.setState({
                        photoUrl: downloadURL,
                        isImageUploading: false
                    }, () => toastr.success('Success!', 'Image successfully uploaded'));
                })
            }
        )
    };

    render() {
        const { firstName, lastName, address, city, state, country, pincode, photoUrl } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <img src={photoUrl} alt="profile-pic" className="rounded-circle mx-auto d-block profile-pic" />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input type="file" onChange={this.uploadImage} accept="image/x-png,,image/jpeg" />
                    </div>
                </div>

                {
                    this.state.isImageUploading &&
                    <div className="row justify-content-center">
                        <div
                            className="col-xs-12 col-sm-8 col-md-6 progress">
                            <div
                                className="progress-bar"
                                style={{
                                    width: this.imageUploadedPercentage + 'px'
                                }}
                            >{this.imageUploadedPercentage}%
                            </div>
                        </div>
                    </div>
                }

                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 justify-content-center d-flex">
                        <input name="firstName" type="text" value={firstName} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 justify-content-center d-flex">
                        <input name="lastName" type="text" value={lastName} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 text-center address">
                        <textarea name="address" rows="5" value={address} onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 city">
                        <input name="city" type="text" value={city} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 state">
                        <input name="state" type="text" value={state} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 country">
                        <input name="country" type="text" value={country} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 pincode">
                        <input name="pincode" type="text" value={pincode} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 text-center">
                        <button onClick={this.updateUser} className="btn btn-primary">Save Profile</button>
                    </div>
                </div>
            </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
};

export default connect(mapStateToProps)(withRouter(EditProfile));
