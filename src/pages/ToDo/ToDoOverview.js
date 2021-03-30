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
            mydata: []
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

        const { user } = this.props
        console.log(this.state.mydata);
        return (
            <div>
                {
                    this.props.user ?
                        <div className="m-5">

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