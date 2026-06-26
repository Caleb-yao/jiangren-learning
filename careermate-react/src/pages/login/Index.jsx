import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Index.css";

// Login 页面:标题 + Email 输入框 + Password 输入框 + Login 按钮
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 路由跳转

  // 提交登录(此处仅作演示,真实项目会先校验账号密码再跳转)
  const handleSubmit = (e) => {
    e.preventDefault();
    // 登录成功后跳转到首页
    navigate("/home");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        {/* 品牌名 */}
        <h2 className="login-brand">CareerMate AI</h2>

        {/* Login 标题 */}
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Welcome back! Please sign in to continue.</p>

        {/* Email 输入框 */}
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password 输入框 */}
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login 按钮 */}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
