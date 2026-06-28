import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllAppointments, updateStatus } from "../api/appointments";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:      #FAF6F3;
    --ink:     #1E1220;
    --acc:     #B8826A;
    --acc-lt:  #E4C5B4;
    --muted:   #7A5E6A;
    --surface: #F2ECE8;
    --border:  #DDD0C8;
    --white:   #FFFFFF;
    --fd: 'Cormorant Garamond', Georgia, serif;
    --fb: 'DM Sans', system-ui, sans-serif;
    --t: 0.3s ease;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--fb); background: var(--bg); color: var(--ink); }

  .adm-nav {
    height: 64px; background: var(--ink);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; position: sticky; top: 0; z-index: 100;
  }
  .adm-logo {
    font-family: var(--fd); font-size: 1.3rem; font-weight: 300;
    letter-spacing: .1em; text-transform: uppercase; color: #FAF6F3;
  }
  .adm-logo span { color: var(--acc); }
  .adm-nav-right { display: flex; align-items: center; gap: 20px; }
  .adm-label {
    font-size: .72rem; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(250,246,243,.45);
  }

  .btn {
    display: inline-block; font-family: var(--fb); font-size: .72rem;
    font-weight: 500; letter-spacing: .16em; text-transform: uppercase;
    cursor: pointer; border: none; padding: 10px 22px; border-radius: 2px;
    transition: background var(--t), transform var(--t); line-height: 1;
  }
  .btn-primary { background: var(--acc); color: #fff; }
  .btn-primary:hover { background: #A0705A; }
  .btn-outline {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-outline:hover { border-color: var(--muted); color: var(--ink); }
  .btn-sm { padding: 7px 14px; font-size: .68rem; }
  .btn-danger { background: transparent; color: #e05c5c; border: 1px solid rgba(224,92,92,.3); }
  .btn-danger:hover { background: rgba(224,92,92,.08); }
  .btn-success { background: transparent; color: #6aad7a; border: 1px solid rgba(106,173,122,.3); }
  .btn-success:hover { background: rgba(106,173,122,.08); }
  .btn:disabled { opacity: .5; cursor: not-allowed; }

  .adm-wrap { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }

  .adm-header { margin-bottom: 40px; }
  .adm-title {
    font-family: var(--fd); font-size: 2.8rem; font-weight: 300;
    line-height: 1.1; color: var(--ink); margin-bottom: 8px;
  }
  .adm-title em { font-style: italic; color: var(--acc); }
  .adm-sub { font-size: .88rem; color: var(--muted); }

  .adm-tabs { display: flex; gap: 0; margin-bottom: 32px; border-bottom: 1px solid var(--border); }
  .adm-tab {
    font-size: .72rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); cursor: pointer; padding: 12px 24px;
    border-bottom: 2px solid transparent; transition: color var(--t), border-color var(--t);
    user-select: none;
  }
  .adm-tab:hover { color: var(--ink); }
  .adm-tab.active { color: var(--acc); border-bottom-color: var(--acc); }

  .adm-filters { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
  .filter-btn {
    font-family: var(--fb); font-size: .68rem; letter-spacing: .12em;
    text-transform: uppercase; cursor: pointer; padding: 7px 16px;
    border-radius: 2px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); transition: all var(--t);
  }
  .filter-btn:hover { border-color: var(--muted); color: var(--ink); }
  .filter-btn.active { background: var(--ink); color: #FAF6F3; border-color: var(--ink); }

  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th {
    font-size: .67rem; letter-spacing: .16em; text-transform: uppercase;
    color: var(--muted); font-weight: 400; padding: 12px 16px;
    border-bottom: 1px solid var(--border); text-align: left;
  }
  .adm-table td {
    padding: 16px; border-bottom: 1px solid var(--border);
    font-size: .88rem; color: var(--ink); vertical-align: top;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: var(--surface); }

  .status-badge {
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase;
    font-weight: 500; padding: 4px 10px; border-radius: 20px; display: inline-block;
  }
  .status-Pending   { background: rgba(201,147,106,.12); color: #C9936A; }
  .status-Confirmed { background: rgba(106,173,122,.12); color: #4a9a5a; }
  .status-Rejected  { background: rgba(224,92,92,.12);  color: #e05c5c; }
  .status-Cancelled { background: rgba(0,0,0,.06);      color: #888; }

  .adm-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  .adm-empty {
    text-align: center; padding: 64px 0;
    font-size: .95rem; color: var(--muted);
  }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(30,18,32,.5); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .modal-box {
    background: #fff; width: 100%; max-width: 400px;
    padding: 40px; position: relative; border-radius: 2px;
  }
  .modal-title {
    font-family: var(--fd); font-size: 1.8rem; font-weight: 300;
    color: var(--ink); margin-bottom: 20px; line-height: 1.1;
  }
  .modal-title em { font-style: italic; color: var(--acc); }
  .modal-close {
    position: absolute; top: 16px; right: 18px;
    background: none; border: none; cursor: pointer;
    font-size: 1rem; color: var(--muted);
  }
  .reason-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    color: var(--ink); font-family: var(--fb); font-size: .9rem;
    padding: 12px 15px; border-radius: 2px; outline: none;
    resize: vertical; min-height: 80px; margin-bottom: 16px;
    transition: border-color var(--t);
  }
  .reason-input:focus { border-color: var(--acc); }
  .reason-label {
    font-size: .67rem; letter-spacing: .15em; text-transform: uppercase;
    color: var(--muted); display: block; margin-bottom: 8px;
  }
`;

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Rejected", "Cancelled"];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("All");
  const [actionModal, setActionModal]   = useState(null);
  const [reason, setReason]             = useState("");
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    if (!user || user.role !== "Admin") { navigate("/"); return; }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "All"
    ? appointments
    : appointments.filter(a => a.status === filter);

  const openAction = (appointment, action) => {
    setReason("");
    setActionModal({ appointment, action });
  };

  const handleAction = async () => {
    if (!actionModal) return;
    const { appointment, action } = actionModal;
    const needsReason = action === "Rejected" || action === "Cancelled";
    if (needsReason && !reason.trim()) { alert("Please provide a reason."); return; }

    setSubmitting(true);
    try {
      await updateStatus(appointment.id, { status: action, reason: reason || null });
      setAppointments(prev => prev.map(a =>
        a.id === appointment.id
          ? { ...a, status: action, adminReason: reason || null }
          : a
      ));
      setActionModal(null);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const formatDate = (dt) => new Date(dt).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  });

  const formatTime = (dt) => new Date(dt).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });

  const pendingCount = appointments.filter(a => a.status === "Pending").length;

  return (
    <>
      <style>{CSS}</style>

      <nav className="adm-nav">
        <div className="adm-logo">Luxe<span>&</span>Lash <span style={{ fontSize: ".7rem", letterSpacing: ".2em", color: "rgba(250,246,243,.35)", marginLeft: 8 }}>ADMIN</span></div>
        <div className="adm-nav-right">
          <span className="adm-label">Welcome, {user?.firstName}</span>
          <button className="btn btn-outline" style={{ color: "rgba(250,246,243,.5)", borderColor: "rgba(250,246,243,.15)" }}
            onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <div className="adm-wrap">
        <div className="adm-header">
          <h1 className="adm-title">Appointments <em>dashboard.</em></h1>
          <p className="adm-sub">
            {appointments.length} total · {pendingCount} pending review
          </p>
        </div>

        <div className="adm-filters">
          {STATUS_FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}>
              {f}
              {f === "Pending" && pendingCount > 0 && ` (${pendingCount})`}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "var(--muted)", padding: "32px 0" }}>Loading appointments...</p>}

        {!loading && filtered.length === 0 && (
          <div className="adm-empty">No {filter !== "All" ? filter.toLowerCase() : ""} appointments found.</div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{a.clientName}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: 2 }}>{a.clientEmail}</div>
                  </td>
                  <td>
                    <div>{a.serviceName}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: 2 }}>${a.price}</div>
                  </td>
                  <td>
                    <div>{formatDate(a.dateTime)}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: 2 }}>{formatTime(a.dateTime)}</div>
                  </td>
                  <td>
                    <span className={`status-badge status-${a.status}`}>{a.status}</span>
                    {a.adminReason && (
                      <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>
                        {a.adminReason}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: ".82rem", color: "var(--muted)", maxWidth: 160 }}>
                    {a.notes || <span style={{ opacity: .4 }}>—</span>}
                  </td>
                  <td>
                    <div className="adm-actions">
                      {a.status === "Pending" && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => openAction(a, "Confirmed")}>
                            Confirm
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => openAction(a, "Rejected")}>
                            Reject
                          </button>
                        </>
                      )}
                      {a.status === "Confirmed" && (
                        <button className="btn btn-danger btn-sm" onClick={() => openAction(a, "Cancelled")}>
                          Cancel
                        </button>
                      )}
                      {(a.status === "Rejected" || a.status === "Cancelled") && (
                        <span style={{ fontSize: ".75rem", color: "var(--muted)", opacity: .5 }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActionModal(null)}>✕</button>
            <h2 className="modal-title">
              {actionModal.action === "Confirmed" && <>Confirm <em>appointment?</em></>}
              {actionModal.action === "Rejected"  && <>Reject <em>appointment?</em></>}
              {actionModal.action === "Cancelled" && <>Cancel <em>appointment?</em></>}
            </h2>
            <p style={{ fontSize: ".88rem", color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
              <strong>{actionModal.appointment.clientName}</strong> — {actionModal.appointment.serviceName}<br />
              {formatDate(actionModal.appointment.dateTime)} at {formatTime(actionModal.appointment.dateTime)}
            </p>

            {(actionModal.action === "Rejected" || actionModal.action === "Cancelled") && (
              <>
                <label className="reason-label">Reason (required)</label>
                <textarea
                  className="reason-input"
                  placeholder="Enter reason for client..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </>
            )}

            {actionModal.action === "Confirmed" && (
              <p style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: 20 }}>
                Client will receive a confirmation email.
              </p>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
              <button
                className={`btn ${actionModal.action === "Confirmed" ? "btn-primary" : "btn-danger"}`}
                onClick={handleAction}
                disabled={submitting}>
                {submitting ? "Processing..." : actionModal.action === "Confirmed" ? "Confirm" : actionModal.action === "Rejected" ? "Reject" : "Cancel appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
