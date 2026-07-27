import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const { isAuthenticated, loading, error } = useSelector((state) => state.user);

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

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="sh-card">
      <BackButton to="/" />
      <h2 className="sh-title">Welcome Back</h2>
      <p className="sh-subtitle">Login to your account</p>

      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="sh-input form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="sh-input form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Link to="/users/password/forgot" style={{ fontSize: "14px", color: "#e63946" }}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="sh-btn w-100">
          LOGIN
        </button>
      </form>

      <p className="text-center mt-4 mb-0" style={{ fontSize: "14px" }}>
        NEW USER?{" "}
        <Link to="/users/signup" style={{ color: "#e63946", fontWeight: 600 }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;