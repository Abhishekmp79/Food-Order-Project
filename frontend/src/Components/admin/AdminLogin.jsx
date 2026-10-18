import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        toast.success("Welcome back, Admin");
        navigate("/admin");
      } else {
        toast.error("This account does not have admin access");
        dispatch(logout());
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, user, error, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  if (loading) return <div className="text-center py-5">Loading…</div>;

  return (
    <div className="sh-card">
      <h2 className="sh-title">🔐 Admin Login</h2>
      <p className="sh-subtitle">Restricted area — staff access only</p>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Admin Email</label>
          <input type="email" className="sh-input form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="sh-input form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button type="submit" className="sh-btn w-100">SIGN IN TO DASHBOARD</button>
      </form>
      <p className="text-center mt-4 mb-0" style={{ fontSize: "14px" }}>
        <Link to="/" style={{ color: "#bf4722", fontWeight: 600 }}>← Back to website</Link>
      </p>
    </div>
  );
};

export default AdminLogin;