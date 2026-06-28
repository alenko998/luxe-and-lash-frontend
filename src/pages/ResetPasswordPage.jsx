import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #FAF6F3; --ink: #1E1220; --acc: #B8826A;
    --muted: #7A5E6A; --border: #DDD0C8;
    --fd: 'Cormorant Garamond', Georgia, serif;
    --fb: 'DM Sans', system-ui, sans-serif;
    --t: 0.3s ease;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--fb); background: var(--bg); color: var(--ink); }

  .rp-wrap {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 20px;
    background: var(--ink);
  }
  .rp-box {
    background: #fff; width: 100%; max-width: 420px;
    padding: 48px; border-radius: 2px;
  }
  .rp-eyebrow {
    font-size: .7rem; letter-spacing: .22em; text-transform: uppercase;
    color: var(--acc); margin-bottom: 14px; display: block;
  }
  .rp-title {
    font-family: var(--fd); font-size: 2.4rem; font-weight: 300;
    line-height: 1.1; color: var(--ink); margin-bottom: 28px;
  }
  .rp-title em { font-style: italic; color: var(--acc); }
  .rp-form { display: flex; flex-direction: column; gap: 14px; }
  .rp-field { display: flex; flex-direction: column; gap: 6px; }
  .rp-field label {
    font-size: .67rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted);
  }
  .rp-field input {
    background: var(--bg); border: 1px solid var(--border);
    color: var(--ink); font-family: var(--fb); font-size: .9rem; font-weight: 300;
    padding: 12px 15px; border-radius: 2px; outline: none; width: 100%;
    transition: border-color var(--t);
  }
  .rp-field input:focus { border-color: var(--acc); }
  .btn {
    display: inline-block; font-family: var(--fb); font-size: .74rem;
    font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; border: none; padding: 14px 32px; border-radius: 2px;
    transition: background var(--t); line-height: 1; width: 100%; margin-top: 8px;
  }
  .btn-primary { background: var(--acc); color: #fff; }
  .btn-primary:hover { background: #A0705A; }
  .btn:disabled { opacity: .6; cursor: not-allowed; }
  .rp-error { color: #e05c5c; font-size: .82rem; }
  .rp-success { color: #4a9a5a; font-size: .92rem; line-height: 1.6; }
  .rp-back {
    font-size: .78rem; color: var(--muted); text-align: center;
    margin-top: 16px; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px;
  }
  .rp-back:hover { color: var(--ink); }
`;

export default function ResetPasswordPage() {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const userId = searchParams.get("userId");
  const token  = searchParams.get("token");

  const handleSubmit = async () => {
    const password = document.getElementById("rp-password").value;
    const confirm  = document.getElementById("rp-confirm").value;

    if (!password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }
    if (password.length < 6)   { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");
    try {
      await resetPassword({ userId, token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="rp-wrap">
        <div className="rp-box">
          <span className="rp-eyebrow">Account</span>
          <h1 className="rp-title">Reset your <em>password.</em></h1>

          {success ? (
            <>
              <p className="rp-success">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button className="btn btn-primary" style={{ marginTop: 24 }}
                onClick={() => navigate("/")}>
                Go to Sign in
              </button>
            </>
          ) : (
            <div className="rp-form">
              <div className="rp-field">
                <label>New password</label>
                <input id="rp-password" type="password" placeholder="••••••••" />
              </div>
              <div className="rp-field">
                <label>Confirm new password</label>
                <input id="rp-confirm" type="password" placeholder="••••••••" />
              </div>
              {error && <p className="rp-error">{error}</p>}
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Resetting..." : "Reset password"}
              </button>
              <p className="rp-back" onClick={() => navigate("/")}>Back to home</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}