import { useNavigate } from "react-router-dom";
import "./home.css";

// Home 页面:登录成功后的落地页,显示欢迎信息
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-welcome">Welcome to CareerMate AI 🎉</h1>
        <p className="home-text">
          You have successfully logged in. This is your career dashboard —
          your AI career practice partner, from resume to offer.
        </p>

        {/* 退出登录:跳回登录页 */}
        <button className="home-logout" onClick={() => navigate("/login")}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Home;
