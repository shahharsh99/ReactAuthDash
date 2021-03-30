import React, { Component } from 'react';
import { connect } from "react-redux"
import "./Dashboard.scss"
import Spinner from "../../components/Spinner/Spinner";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            mydata: []
        }
    }

    getUsers = async () => {
        await firebase.firestore().collection('users').get()
            .then((snapshot) => {
                console.log(snapshot);
                snapshot.forEach((doc, key) => {
                    let data = [];
                    snapshot.forEach((doc, key) => {
                        data.push({
                            firstName: doc.data().firstName, lastName: doc.data().lastName, email: doc.data().email, city: doc.data().city, address: doc.data().address
                        });
                    });
                    this.setState({ mydata: data });
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });


    }

    componentDidMount() {
        this.getUsers()
    }


    render() {

        const columns = [
            {
                name: "First Name",
                selector: "firstName",
                sortable: true
            },
            {
                name: "Last Name",
                selector: "lastName",
                sortable: true
            },
            {
                name: "Email",
                selector: "email",
                sortable: false
            },
            {
                name: "Address",
                selector: "address",
                sortable: false
            },
            {
                name: "City",
                selector: "city",
                sortable: true
            },
        ];

        return (

            <>
                {
                    this.props.user ?
                        <div className="m-5">
                            <DataTable
                                title="Members"
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

export default connect(mapStateToProps)(Dashboard);
