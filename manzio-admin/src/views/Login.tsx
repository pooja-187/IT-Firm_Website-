import React, { useState } from 'react';
import { apiService } from '../utils/api';

interface LoginProps {
  onLoginSuccess: (token: string, user: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await apiService.auth.login({ username, password });
      setLoading(false);
      onLoginSuccess(data.token, data.username || 'Admin');
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.non_field_errors) {
        setErrorMsg(err.response.data.non_field_errors[0]);
      } else if (err.response && err.response.status === 400) {
        setErrorMsg('Invalid username or password');
      } else {
        setErrorMsg(err.message || 'Unable to connect to backend server');
      }
    }
  };

  return (
    <div className="login-page" id="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">M</div>
          <span>manzio</span>
        </div>
        <p className="login-subtitle">Sign in to your admin dashboard</p>
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="btn-text">Signing In...</span>
            ) : (
              <span className="btn-text">Sign In</span>
            )}
          </button>
          
          {errorMsg && (
            <div className="login-error show" id="login-error">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default Login;
