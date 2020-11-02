import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';


function HomePage() {
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    
    const instanceId = useSelector(state => state.authentication.user.instanceId);
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({
        providedARN: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { providedARN } = inputs;
    const loggingIn = useSelector(state => {
        state.authentication.loggingIn
    });
    const location = useLocation();


    useEffect(() => {
        dispatch(userActions.listAll());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleListInstances(arn) {
        dispatch(userActions.listAll(arn));
    }

    function handleCreateEC2(arn) {
        console.log('&&&& ARN:', arn )
        dispatch(userActions.createec2(arn));
    }


    // function handleCreateEc2(e) {
    //     e.preventDefault();
    //     console.log(e);
    //     console.log('###########')
    //     setSubmitted(true);
    //     if (username && password) {
    //         // get return url from location state or default to home page
    //         const { from } = location.state || { from: { pathname: "/" } };
    //         console.log('dispatching')
    //         dispatch(userActions.createec2(username, password, from));
    //     }
    // }

    return (
        <div className="col-lg-10 offset-lg-2">


            <h1>Hi {user.firstName}!</h1>
            <h6>Sample ARN **</h6>
            <h6> arn:aws:iam::400525531427:role/react-node</h6>
            <br/>
                <div className="form-group">
                    <label>Role ARN</label>
                    <input type="text" name="providedARN" value={providedARN} onChange={handleChange} className={'form-control' + (submitted && !providedARN ? ' is-invalid' : '')} />
                </div>
                

            <span> t2-micro , us-east-1: <a onClick={() => handleCreateEC2(providedARN)} className="text-primary">Create Instance</a></span>
    <h4>Latest created instanceId: {instanceId ? instanceId : <span className="spinner-border spinner-border-sm mr-1"></span> }</h4>

    <br/>
    <span> Instances List: <a onClick={() => handleListInstances(providedARN)} className="text-primary">List Instances</a></span>
            {users.loading && <em>Loading users...</em>}
            {users.error && <span className="text-danger">ERROR: {users.error}</span>}
            {users.items &&
                <ul>
                    {users.items.map((user, index) =>
                        <li key={user.id}>
                            {user.firstName + ' ' + user.lastName}
                            {
                                user.deleting ? <em> - Deleting...</em>
                                : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                : <span> - <a onClick={() => handleCreateEC2(user.id)} className="text-primary">Delete</a></span>
                            }
                        </li>
                    )}
                </ul>
            }<br/>
            <br/><br/><br/><br/><br/>
            <p style={{float: 'right'}}>
                <Link to="/login">Logout</Link>
            </p>
        </div>
    );
}

export { HomePage };