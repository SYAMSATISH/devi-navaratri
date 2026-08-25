
import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "https://devi-navaratri.onrender.com";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN" && token) {
      loadAdminData();
    }
  }, [user, token]);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [membersResponse, adminsResponse] =
        await Promise.all([
          fetch(`${API_URL}/admin/members`, { headers }),
          fetch(`${API_URL}/admin/admins`, { headers }),
        ]);

      if (membersResponse.ok) {
        setMembers(await membersResponse.json());
      }

      if (adminsResponse.ok) {
        setAdmins(await adminsResponse.json());
      }
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (!user) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-symbol">ॐ</div>

          <div>
            <h2>Devi</h2>
            <span>Navaratri</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-menu">

          <button
            className={
              activeMenu === "dashboard"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              activeMenu === "members"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("members")}
          >
            <span>♙</span>
            Members

            {user.role === "ADMIN" && (
              <small>{members.length}</small>
            )}
          </button>

          <button
            className={
              activeMenu === "festival"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("festival")}
          >
            <span>✦</span>
            Festival
          </button>

          <button
            className={
              activeMenu === "events"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("events")}
          >
            <span>◷</span>
            Events
          </button>

          <button
            className={
              activeMenu === "donations"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("donations")}
          >
            <span>₹</span>
            Donations
          </button>

          <button
            className={
              activeMenu === "reports"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("reports")}
          >
            <span>▥</span>
            Reports
          </button>

        </nav>

        <p className="menu-label secondary-label">
          ACCOUNT
        </p>

        <nav className="sidebar-menu">

          <button
            className={
              activeMenu === "profile"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("profile")}
          >
            <span>◎</span>
            Profile
          </button>

          <button
            className={
              activeMenu === "settings"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActiveMenu("settings")}
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="festival-mini-card">
            <div className="mini-icon">✦</div>

            <div>
              <strong>Navaratri 2026</strong>
              <span>9 Days of Divine Celebration</span>
            </div>
          </div>

          <button
            className="logout-link"
            onClick={logout}
          >
            <span>↪</span>
            Sign out
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="main-area">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="breadcrumb">
            <span>Devi Navaratri</span>
            <b>/</b>
            <strong>
              {activeMenu}
            </strong>
          </div>

          <div className="topbar-actions">

            <button className="icon-button">
              ♢
            </button>

            <div className="topbar-profile">

              <div className="avatar">
                {initials(user.name)}
              </div>

              <div className="topbar-user">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="main-content">

          {error && (
            <div className="alert">
              {error}
            </div>
          )}

          {/* DASHBOARD */}
          {activeMenu === "dashboard" && (
            <>

              <section className="hero-section">

                <div>

                  <p className="eyebrow">
                    ✦ DEVI NAVARATRI 2026
                  </p>

                  <h1>
                    Welcome back,
                    <br />
                    <span>{user.name} 👋</span>
                  </h1>

                  <p className="hero-description">
                    Welcome to your Devi Navaratri
                    management dashboard. Everything
                    you need for the celebration,
                    in one place.
                  </p>

                </div>

                <div className="hero-art">
                  <div className="glow-circle" />

                  <div className="lotus">
                    ✦
                  </div>

                  <span className="floating-star star-one">
                    ✦
                  </span>

                  <span className="floating-star star-two">
                    ·
                  </span>

                  <span className="floating-star star-three">
                    ✧
                  </span>
                </div>

              </section>

              {/* STAT CARDS */}
              <section className="stats-grid">

                <div className="dashboard-stat">

                  <div className="stat-icon members-icon">
                    ♙
                  </div>

                  <div className="stat-info">

                    <span>Total Members</span>

                    <strong>
                      {user.role === "ADMIN"
                        ? members.length
                        : "—"}
                    </strong>

                    <small>
                      Registered members
                    </small>

                  </div>

                </div>

                <div className="dashboard-stat">

                  <div className="stat-icon admin-icon">
                    ♛
                  </div>

                  <div className="stat-info">

                    <span>Administrators</span>

                    <strong>
                      {user.role === "ADMIN"
                        ? admins.length
                        : "—"}
                    </strong>

                    <small>
                      System administrators
                    </small>

                  </div>

                </div>

                <div className="dashboard-stat">

                  <div className="stat-icon event-icon">
                    ◷
                  </div>

                  <div className="stat-info">

                    <span>Celebration Days</span>

                    <strong>09</strong>

                    <small>
                      Divine festival days
                    </small>

                  </div>

                </div>

                <div className="dashboard-stat">

                  <div className="stat-icon status-icon">
                    ✓
                  </div>

                  <div className="stat-info">

                    <span>System Status</span>

                    <strong className="online">
                      Live
                    </strong>

                    <small>
                      All systems operational
                    </small>

                  </div>

                </div>

              </section>

              {/* MAIN CARDS */}
              <section className="dashboard-grid">

                <div className="large-card festival-card">

                  <div className="card-header">

                    <div>

                      <p className="card-eyebrow">
                        FESTIVAL OVERVIEW
                      </p>

                      <h2>
                        Nine Nights of
                        <br />
                        Divine Celebration
                      </h2>

                    </div>

                    <div className="card-symbol">
                      ॐ
                    </div>

                  </div>

                  <p className="card-description">
                    Navaratri is a celebration of
                    divine feminine energy, devotion
                    and community. Manage your
                    celebration from this dashboard.
                  </p>

                  <div className="festival-progress">

                    <div className="progress-label">
                      <span>
                        Preparation progress
                      </span>

                      <strong>68%</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-value"
                        style={{ width: "68%" }}
                      />
                    </div>

                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      setActiveMenu("festival")
                    }
                  >
                    View festival details →
                  </button>

                </div>

                <div className="large-card">

                  <div className="card-header">

                    <div>

                      <p className="card-eyebrow">
                        QUICK ACTIONS
                      </p>

                      <h2>
                        What would you
                        <br />
                        like to do?
                      </h2>

                    </div>

                  </div>

                  <div className="quick-actions">

                    {user.role === "ADMIN" && (
                      <button
                        onClick={() =>
                          setActiveMenu("members")
                        }
                      >
                        <span>+</span>

                        <div>
                          <strong>
                            Manage Members
                          </strong>

                          <small>
                            Add or manage members
                          </small>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setActiveMenu("events")
                      }
                    >
                      <span>◷</span>

                      <div>
                        <strong>
                          View Events
                        </strong>

                        <small>
                          Festival schedule
                        </small>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        setActiveMenu("profile")
                      }
                    >
                      <span>◎</span>

                      <div>
                        <strong>
                          My Profile
                        </strong>

                        <small>
                          Account information
                        </small>
                      </div>
                    </button>

                  </div>

                </div>

              </section>

              {/* ADMIN RECENT MEMBERS */}
              {user.role === "ADMIN" && (
                <section className="large-card recent-card">

                  <div className="card-header">

                    <div>
                      <p className="card-eyebrow">
                        COMMUNITY
                      </p>

                      <h2>
                        Recent Members
                      </h2>
                    </div>

                    <button
                      className="view-all"
                      onClick={() =>
                        setActiveMenu("members")
                      }
                    >
                      View all →
                    </button>

                  </div>

                  {loading ? (
                    <div className="loading">
                      Loading members...
                    </div>
                  ) : members.length === 0 ? (
                    <div className="empty">
                      No members registered yet.
                    </div>
                  ) : (
                    <div className="recent-list">

                      {members
                        .slice(0, 5)
                        .map((member) => (
                          <div
                            className="recent-member"
                            key={member.id}
                          >

                            <div className="member-avatar">
                              {initials(member.name)}
                            </div>

                            <div className="member-info">

                              <strong>
                                {member.name}
                              </strong>

                              <span>
                                {member.email}
                              </span>

                            </div>

                            <span className="member-role">
                              {member.role}
                            </span>

                          </div>
                        ))}

                    </div>
                  )}

                </section>
              )}

            </>
          )}

          {/* MEMBERS */}
          {activeMenu === "members" && (
            <section className="page-card">

              <p className="eyebrow">
                COMMUNITY MANAGEMENT
              </p>

              <h1>Members</h1>

              <p className="page-description">
                Manage registered members and
                their access roles.
              </p>

              {user.role !== "ADMIN" ? (
                <div className="restricted">
                  <div>🔐</div>

                  <h2>
                    Admin access required
                  </h2>

                  <p>
                    Member management is available
                    only to administrators.
                  </p>
                </div>
              ) : loading ? (
                <div className="loading">
                  Loading members...
                </div>
              ) : (
                <div className="members-table">

                  <div className="table-head">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                  </div>

                  {members.map((member) => (
                    <div
                      className="table-row"
                      key={member.id}
                    >
                      <span>
                        #{member.id}
                      </span>

                      <strong>
                        {member.name}
                      </strong>

                      <span>
                        {member.email}
                      </span>

                      <span className="member-role">
                        {member.role}
                      </span>
                    </div>
                  ))}

                </div>
              )}

            </section>
          )}

          {/* FESTIVAL */}
          {activeMenu === "festival" && (
            <section className="page-card festival-page">

              <p className="eyebrow">
                DEVI NAVARATRI 2026
              </p>

              <h1>
                Nine Nights of Devotion
              </h1>

              <p className="page-description">
                A sacred celebration of divine
                feminine energy, devotion and
                community.
              </p>

              <div className="festival-days">

                {Array.from(
                  { length: 9 },
                  (_, index) => (
                    <div
                      className="day-card"
                      key={index}
                    >

                      <span>
                        DAY{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <strong>
                        Divine Celebration
                      </strong>

                      <small>
                        Devi Navaratri
                      </small>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* EVENTS */}
          {activeMenu === "events" && (
            <section className="page-card">

              <p className="eyebrow">
                FESTIVAL CALENDAR
              </p>

              <h1>Events</h1>

              <p className="page-description">
                Festival events and important
                celebration activities.
              </p>

              <div className="coming-soon">
                <div>◷</div>

                <h2>
                  Events module
                </h2>

                <p>
                  Event management will be
                  connected to the backend next.
                </p>
              </div>

            </section>
          )}

          {/* DONATIONS */}
          {activeMenu === "donations" && (
            <section className="page-card">

              <p className="eyebrow">
                COMMUNITY SUPPORT
              </p>

              <h1>Donations</h1>

              <p className="page-description">
                Manage and track Devi Navaratri
                donations.
              </p>

              <div className="coming-soon">
                <div>₹</div>

                <h2>
                  Donations module
                </h2>

                <p>
                  Donation management will be
                  connected next.
                </p>
              </div>

            </section>
          )}

          {/* REPORTS */}
          {activeMenu === "reports" && (
            <section className="page-card">

              <p className="eyebrow">
                ANALYTICS
              </p>

              <h1>Reports</h1>

              <p className="page-description">
                View festival management reports
                and statistics.
              </p>

              <div className="report-stats">

                <div>
                  <span>Members</span>

                  <strong>
                    {user.role === "ADMIN"
                      ? members.length
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Admins</span>

                  <strong>
                    {user.role === "ADMIN"
                      ? admins.length
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Festival Days</span>

                  <strong>9</strong>
                </div>

              </div>

            </section>
          )}

          {/* PROFILE */}
          {activeMenu === "profile" && (
            <section className="page-card">

              <p className="eyebrow">
                ACCOUNT
              </p>

              <h1>My Profile</h1>

              <div className="profile-large">

                <div className="profile-avatar">
                  {initials(user.name)}
                </div>

                <div>

                  <h2>
                    {user.name}
                  </h2>

                  <p>
                    {user.email}
                  </p>

                  <span className="member-role">
                    {user.role}
                  </span>

                </div>

              </div>

              <div className="profile-details">

                <div>
                  <span>Full Name</span>
                  <strong>
                    {user.name}
                  </strong>
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>
                    {user.email}
                  </strong>
                </div>

                <div>
                  <span>Account Role</span>
                  <strong>
                    {user.role}
                  </strong>
                </div>

                <div>
                  <span>Account Status</span>
                  <strong className="online">
                    Active
                  </strong>
                </div>

              </div>

            </section>
          )}

          {/* SETTINGS */}
          {activeMenu === "settings" && (
            <section className="page-card">

              <p className="eyebrow">
                PREFERENCES
              </p>

              <h1>Settings</h1>

              <div className="settings-list">

                <div>
                  <div>
                    <strong>
                      Account status
                    </strong>

                    <span>
                      Your account is active.
                    </span>
                  </div>

                  <b className="online">
                    Active
                  </b>
                </div>

                <div>
                  <div>
                    <strong>
                      Security
                    </strong>

                    <span>
                      JWT authentication enabled.
                    </span>
                  </div>

                  <b>
                    Protected
                  </b>
                </div>

                <div>
                  <div>
                    <strong>
                      System
                    </strong>

                    <span>
                      Devi Navaratri backend.
                    </span>
                  </div>

                  <b className="online">
                    Live
                  </b>
                </div>

              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default Dashboard;