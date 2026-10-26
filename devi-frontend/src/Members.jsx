import { useState } from "react";
import { apiFetch } from "./api";

const emptyForm = { name: "", email: "", password: "" };

function Members({ members, loading, onChanged }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isEditing = editingId !== null;
  const atLimit = members.length >= 10;

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (member) => {
    setError("");
    setNotice("");
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, password: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.password ? { password: form.password } : {}),
      };

      if (isEditing) {
        await apiFetch(`/admin/members/${editingId}`, { method: "PUT", body: payload });
        setNotice("Member updated.");
      } else {
        await apiFetch("/admin/members", { method: "POST", body: payload });
        setNotice("Member added.");
      }

      reset();
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (member) => {
    if (!window.confirm(`Delete ${member.name}? This cannot be undone.`)) return;

    setError("");
    setNotice("");

    try {
      await apiFetch(`/admin/members/${member.id}`, { method: "DELETE" });
      if (editingId === member.id) reset();
      setNotice("Member deleted.");
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const makeAdmin = async (member) => {
    if (!window.confirm(`Make ${member.name} an administrator?`)) return;

    setError("");
    setNotice("");

    try {
      await apiFetch(`/admin/users/${member.id}/role?role=ADMIN`, { method: "PUT" });
      setNotice(`${member.name} is now an admin.`);
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <form className="member-form" onSubmit={submit}>
        <h3>{isEditing ? "Edit member" : "Add member"}</h3>

        <div className="member-form-grid">
          <input
            placeholder="Full name"
            value={form.name}
            onChange={update("name")}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update("email")}
            required
          />
          <input
            type="password"
            placeholder={isEditing ? "New password (optional)" : "Password"}
            value={form.password}
            onChange={update("password")}
            required={!isEditing}
            autoComplete="new-password"
          />
        </div>

        <div className="member-form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={saving || (!isEditing && atLimit)}
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add member"}
          </button>

          {isEditing && (
            <button type="button" className="ghost-btn" onClick={reset}>
              Cancel
            </button>
          )}

          <span className="member-count">{members.length} / 10 members</span>
        </div>

        {!isEditing && atLimit && (
          <p className="form-error">Maximum of 10 members reached.</p>
        )}
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="form-success">{notice}</p>}
      </form>

      {loading ? (
        <div className="loading">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="empty">No members registered yet.</div>
      ) : (
        <div className="members-table">
          <div className="table-head members-cols">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Actions</span>
          </div>

          {members.map((member) => (
            <div className="table-row members-cols" key={member.id}>
              <span>#{member.id}</span>
              <strong>{member.name}</strong>
              <span>{member.email}</span>
              <span className="row-actions">
                <button type="button" className="mini-btn" onClick={() => startEdit(member)}>
                  Edit
                </button>
                <button type="button" className="mini-btn" onClick={() => makeAdmin(member)}>
                  Make admin
                </button>
                <button type="button" className="mini-btn danger" onClick={() => remove(member)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Members;
