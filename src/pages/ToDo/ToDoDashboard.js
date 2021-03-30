import React, { Component } from 'react';
import { connect } from "react-redux"
import Spinner from "../../components/Spinner/Spinner";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

class ToDoDashboard extends Component {

    constructor() {
        super();

        this.state = {
            mydata: []
        }
    }

    getTodoData = async () => {
        await firebase.firestore().collection('users').doc(this.props.user.id).collection('todos').get()
            .then((snapshot) => {
                // console.log(snapshot);
                snapshot.forEach((doc, key) => {
                    let data = [];
                    let date = new Date()
                    let dateFormat = formatDate(date)

                    console.log("Date", dateFormat);
                    console.log("Date", date);
                    snapshot.forEach((doc, key) => {
                        if(doc.data().taskDate === dateFormat){
                            data.push({
                            taskName: doc.data().taskName, taskDescription: doc.data().taskDescription, 
                        });}
                    });
                    console.log("%%%%%%%%%%%",data);
                    this.setState({ mydata: data });
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
            
                return [year, month, day].join('-');
            }

    }

    componentDidMount() {
        this.getTodoData()
    }


    render() {
        console.log("dddddddddddd", this.state.mydata);
        const columns = [
            {
                name: "Task Name",
                selector: "taskName",
                sortable: true
            },
            {
                name: "Task Description",
                selector: "taskDescription",
                sortable: false
            },
        ];

        return (

            <>
                {
                    this.props.user ?
                        <div className="m-5">
                            <DataTable
                                title="Today's Task"
                                // actions={<div className='m-2' onClick={() => history.push("add-movie")}>{FloatingActionButtons()}</div>}
                                striped
                                columns={columns}
                                data={this.state.mydata}
                                defaultSortField="name"
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ToDoDashboard);
