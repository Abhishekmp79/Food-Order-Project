import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";

import { toast } from "react-toastify";
import BackButton from "../layout/BackButton";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, loading, error } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Login successful");
            navigate("/users/me");
        }

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    <BackButton to="/" />

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                        <form className="shadow-lg" onSubmit={submitHandler}>
                            <h1 className="mb-3">Login</h1>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Link to="/users/forgetPassword" className="float-right mb-4">
                                Forgot Password
                            </Link>

                            <button className="sh-btn w-100"><LOGIN></LOGIN></button>

                            <Link to="/users/signup" className="float-right mt-3">
                                NEW USER?
                            </Link>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;