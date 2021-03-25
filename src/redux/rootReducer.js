import { combineReducers } from "redux"

import { reducer as toastrReducer } from 'react-redux-toastr'
import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
    user: userReducer,
    toastr: toastrReducer
});

export default rootReducer;
