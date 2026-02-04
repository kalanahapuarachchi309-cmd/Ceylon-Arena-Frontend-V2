import React from "react";
import "./SignPage.css";

const SignPage: React.FC = () => {
  return (
    <div className="sign-page-container">
      <h2>Sign In</h2>
      <form className="sign-form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignPage;
