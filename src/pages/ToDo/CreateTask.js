import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import AlgoliaPlaces from 'algolia-places-react';
import { toastr } from "react-redux-toastr";
import firebase, { firestore } from 'firebase';
import { connect } from 'react-redux';

class CreateTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeArray: ["Priority 1", "Priority 2, Priority 3"],
            taskName: "",
            taskDescription: "",
            taskWhere: "",
            taskDate: "",
            taskStatus: "active",
            taskType: "",
            error: null
        }
    }

    async componentDidMount() {
        if (this.props.match.params.id) {
            await firebase.firestore().collection('users').doc(this.props.user.id).collection('todos').get()
                .then((snapshot) => {
                    // console.log(snapshot);
                    snapshot.forEach((doc, key) => {
                        let data = [];

                        snapshot.forEach((doc, key) => {
                            if (doc.id === this.props.match.params.id) {
                                this.setState({
                                    taskName: doc.data().taskName,
                                    taskDescription: doc.data().taskDescription,
                                    taskWhere: doc.data().taskWhere,
                                    taskDate: doc.data().taskDate,
                                    taskAllDay: doc.data().taskAllDay,
                                    taskStatus: doc.data().taskStatus,
                                    taskType: doc.data().taskType
                                })
                            }
                        });
                        // this.setState({  });
                        console.log(this.state.taskName);
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log(this.state);
        const { taskName, taskDate, taskDescription, taskWhere, taskStatus, taskType } = this.state;
        const { user } = this.props
        if (
            taskName === "" ||
            taskDescription === "" ||
            taskWhere === "" ||
            taskDate === "" ||
            taskType === ""
        ) {
            return this.setState({ error: 'Please fill all details' });
        } else {
            if (this.props.match.params.id === undefined) {
                console.log("&&&&&&&&");
                try {
                    await firebase.firestore().collection('users').doc(user.id).collection('todos').add({
                        taskName: taskName,
                        taskDescription: taskDescription,
                        taskWhere: taskWhere,
                        taskDate: taskDate,
                        taskStatus: taskStatus,
                        taskType: taskType
                    })
                    toastr.success("Successfully Added")
                    this.setState({
                        taskName: "",
                        taskDescription: "",
                        taskWhere: "",
                        taskDate: "",
                        taskStatus: "active",
                        taskType: "",
                        error: null
                    })
                    this.props.history.push("/todo")
                } catch (error) {
                    toastr.error('Error!', error);
                }
            }
            else {
                try {
                    await firebase.firestore().collection('users').doc(user.id).collection('todos').doc(this.props.match.params.id).update({
                        taskName: taskName,
                        taskDescription: taskDescription,
                        taskWhere: taskWhere,
                        taskDate: taskDate,
                        taskStatus: taskStatus,
                        taskType: taskType
                    })
                    toastr.success("Successfully Updated")
                    this.setState({
                        taskName: "",
                        taskDescription: "",
                        taskWhere: "",
                        taskDate: "",
                        taskType: "",
                        error: null
                    })
                    this.props.history.push("/todo")
                } catch (error) {
                    toastr.error('Error!', error);
                }
            }
        }
    };

    render() {
        console.log(this.state);
        return (
            <div className="container-wrapper container d-flex justify-content-center align-items-center">
                <div className="form-wrapper text-center">
                    <h2 className="text-center"> {(this.props.match.params.id !== undefined) ? "Edit Task" : "Add Task"} </h2>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <div className="form-group task-name w-100">
                                <input
                                    type="text"
                                    name="taskName"
                                    className="form-control"
                                    id="task-input"
                                    placeholder="Task"
                                    value={this.state.taskName}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group task-description w-100">
                                <input
                                    type="textarea"
                                    name="taskDescription"
                                    className="form-control"
                                    id="task-description-input"
                                    placeholder="Task Description"
                                    value={this.state.taskDescription}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group task-type w-100">
                                <select
                                    name="taskType"
                                    className="form-control"
                                    id="task-type-input"
                                    value={this.state.taskType}
                                    onChange={this.handleChange}
                                >
                                    <option value="" disabled="disabled" selected={this.state.taskType === "" ? "selected" : ""}>Please select a type</option>
                                    <option value="Priority 1" selected={this.state.taskType === "Priority 1" ? "selected" : ""}>Priority 1</option>
                                    <option value="Priority 2" selected={this.state.taskType === "Priority 2" ? "selected" : ""}>Priority 2</option>
                                    <option value="Priority 3" selected={this.state.taskType === "Priority 3" ? "selected" : ""}>Priority 3</option>
                                </select>
                            </div>
                            <div className="form-group task-where w-100">
                                <input
                                    type="text"
                                    name="taskWhere"
                                    className="form-control"
                                    id="task-where-input"
                                    placeholder="Where"
                                    value={this.state.taskWhere}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group task-date w-100">
                                <input
                                    type="date"
                                    name="taskDate"
                                    className="form-control"
                                    id="task-date-input"
                                    value={this.state.taskDate}
                                    onChange={this.handleChange}
                                />
                            </div>
                            {/* <div className="form-group task-allday first-name">
                                <input
                                    style={{ display: "inline-block", width: "20px" }}
                                    type="checkbox"
                                    name="taskAllDay"
                                    id="task-allday-input"
                                    value={this.state.taskAllDay}
                                    onChange={this.handleChange}
                                />
                                <label style={{ display: "inline-block" }} for="taskAllDay">All Day</label>
                            </div> */}
                            <button type="submit" className="btn btn-primary">{(this.props.match.params.id !== undefined) ? "Update" : "Add"}</button>
                        </div>
                    </form>
                    {this.state.error !== null ? (
                        <div className="alert alert-danger mt-3">{this.state.error}</div>
                    ) : <></>}

                </div>
            </div >
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(CreateTask);
