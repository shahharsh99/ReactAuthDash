import firebase from 'firebase';
import React, { Component } from 'react'
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { toastr } from 'react-redux-toastr';

class ToDoOverview extends Component {

    constructor() {
        super();

        this.state = {
            filterType: null,
            filterDate: null,
            mydata: [],
            filterData: []
        }
    }


    componentDidMount() {
        this.getTodoData();
    }



    getTodoData = async () => {
        await firebase.firestore().collection('users').doc(this.props.user.id).collection('todos').get()
            .then((snapshot) => {
                // console.log(snapshot);
                snapshot.forEach((doc, key) => {
                    let data = [];

                    snapshot.forEach((doc, key) => {
                        data.push({
                            taskId: doc.id,
                            taskName: doc.data().taskName, taskDescription: doc.data().taskDescription, taskDate: doc.data().taskDate, taskStatus: doc.data().taskStatus, taskType: doc.data().taskType
                        });
                    });
                    this.setState({ mydata: data });
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            })
    }

    handleEdit(userId, taskId) {
        console.log(userId);
        this.props.history.push(`todo/${userId}/edit-task/${taskId}`)

    }

    handleStatusComplete(userId, taskId, taskStatus) {
        console.log(taskStatus);
        if (taskStatus === "active") {
            firebase.firestore().collection('users').doc(userId).collection('todos').doc(taskId).update({
                taskStatus: "inactive"
            })
        }
        else {
            firebase.firestore().collection('users').doc(userId).collection('todos').doc(taskId).update({
                taskStatus: "active"
            })
        }
        this.getTodoData()
    }

    handleDelete(userId, taskId) {
        if (window.confirm("Are You Sure?")) {
            firebase.firestore().collection('users').doc(userId).collection('todos').doc(taskId).delete().then(() => {
                toastr.success("Successfully Deleted")
            }).catch((error) => {
                toastr.error(error)
            })
            this.getTodoData()
        }
    }

    handleChangeTaskType = (e) => {
        console.log(e.target.value);
        this.setState({ filterType: e.target.value })
    };

    handleChangeTaskDate = (e) => {
        console.log(e.target.value);
        this.setState({ filterDate: e.target.value })
    };

    handleSubmit = (e) => {
        e.preventDefault()
        {
            const filterData = []
            this.state.mydata.map(data => {
                if (this.state.filterDate === data.taskDate && this.state.filterType === null) {
                    filterData.push(data)
                    console.log(filterData);
                }
                else if (this.state.filterType === data.taskType && this.state.filterDate === null) {
                    filterData.push(data)
                    console.log(filterData);
                }
                else if (data.taskDate === this.state.filterDate && data.taskType === this.state.filterType) {
                    filterData.push(data)
                    console.log(filterData);
                }
            })
            this.setState({ filterData })
        }
        // (d.taskDate === this.state.filterDate) && (d.taskType === this.state.filterType)
        // console.log(this.state);
    }


    render() {


        const columns = [

            {
                name: "Task Name",
                selector: "taskName",
                sortable: false
            },
            {
                name: "Task Date",
                selector: "taskDate",
                sortable: true
            },
            {
                name: "Task Type",
                selector: "taskType",
                sortable: true
            },
            {
                name: "Actions",
                cell: row => <div data-tag="allowRowEvents">
                    <Link to={"/todo"} style={{ color: "#0099ff", fontSize: "15px", cursor: "pointer" }} className="m-3 fa fa-eye"></Link>
                </div>,
            },
        ];

        return (
            <div>
                {
                    this.props.user ?
                        <div className="mt-5">
                            <div className="  justify-content-center align-items-center">
                                <div className=" text-center">
                                    <h2 className="text-center"> Filter</h2>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="name-wrapper d-flex">

                                            <div className="form-group task-date w-100 m-3">
                                                <input
                                                    type="date"
                                                    name="filterDate"
                                                    className="form-control"
                                                    id="task-date-input"
                                                    value={this.state.filterDate}
                                                    onChange={(e) => this.handleChangeTaskDate(e)}
                                                />
                                            </div>
                                            <div className="form-group task-type w-100 m-3">
                                                <select
                                                    name="filterType"
                                                    className="form-control"
                                                    id="filter-type-input"
                                                    value={this.state.filterType}
                                                    onChange={(e) => this.handleChangeTaskType(e)}
                                                >
                                                    <option value="" selected="selected">Please select a type</option>
                                                    <option value="Priority 1" >Priority 1</option>
                                                    <option value="Priority 2" >Priority 2</option>
                                                    <option value="Priority 3" >Priority 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-sm w-25 m-3" style={{ height: "35px" }}>Apply Filter</button>
                                    </form>
                                </div>
                            </div >
                            <hr />
                            <DataTable
                                title="Filtered Data"
                                actions={<Link to={"/todo/create-task"} className="btn btn-primary">Add Task</Link>}
                                striped
                                columns={columns}
                                data={this.state.filterData}
                                defaultSortField="taskDate"
                                // sortIcon={<SortIcon />}
                                sortable
                                pagination
                                highlightOnHover
                                responsive
                            // selectableRows
                            // onSelectedRowsChange={handleChange}
                            />
                            <DataTable
                                title="Overview"
                                actions={<Link to={"/todo/create-task"} className="btn btn-primary">Add Task</Link>}
                                striped
                                columns={columns}
                                data={this.state.mydata}
                                defaultSortField="taskDate"
                                // sortIcon={<SortIcon />}
                                sortable
                                pagination
                                highlightOnHover
                                responsive
                            // selectableRows
                            // onSelectedRowsChange={handleChange}
                            />
                        </div> :
                        <Spinner />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ToDoOverview);