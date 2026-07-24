import { useState } from 'react';
import { UserPlus, Users, UserCheck, UserX, Trash2, Mail } from 'lucide-react';

const TEAM_ROLES = {
  admin: { label: 'Admin', color: '#5C7A6B' },
  editor: { label: 'Editor', color: '#2F5C8A' },
  reviewer: { label: 'Reviewer', color: '#B5502F' },
  contributor: { label: 'Contributor', color: '#9AA79C' }
};

export default function TeamManagement({ team, setTeam }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'contributor' });

  const addMember = () => {
    if (!newMember.name || !newMember.email) return;
    const member = {
      id: `member-${Date.now()}`,
      ...newMember,
      joinedAt: new Date().toISOString(),
      active: true
    };
    setTeam(prev => [...prev, member]);
    setNewMember({ name: '', email: '', role: 'contributor' });
    setShowAddMember(false);
  };

  const removeMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const toggleActive = (id) => {
    setTeam(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Team</div>
          <h2 style={styles.title}>Team Members</h2>
          <p style={styles.desc}>Manage your content team and their roles</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAddMember(true)}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      {showAddMember && (
        <div style={styles.modalOverlay} onClick={() => setShowAddMember(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add Team Member</h3>
            <input
              style={styles.input}
              placeholder="Full Name"
              value={newMember.name}
              onChange={e => setNewMember({ ...newMember, name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Email Address"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
            />
            <select
              style={styles.select}
              value={newMember.role}
              onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            >
              {Object.entries(TEAM_ROLES).map(([key, role]) => (
                <option key={key} value={key}>{role.label}</option>
              ))}
            </select>
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowAddMember(false)}>Cancel</button>
              <button style={styles.primaryBtn} onClick={addMember}>Add Member</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.teamList}>
        {team.length === 0 ? (
          <div style={styles.emptyState}>
            <Users size={32} color="#9AA79C" />
            <p>No team members yet. Add your first member!</p>
          </div>
        ) : (
          team.map(member => {
            const role = TEAM_ROLES[member.role];
            return (
              <div key={member.id} style={styles.teamCard}>
                <div style={styles.teamCardLeft}>
                  <div style={styles.avatar}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={styles.memberName}>{member.name}</div>
                    <div style={styles.memberEmail}><Mail size={12} /> {member.email}</div>
                  </div>
                </div>
                <div style={styles.teamCardRight}>
                  <span style={{ ...styles.roleBadge, backgroundColor: role.color + '20', color: role.color }}>
                    {role.label}
                  </span>
                  <button 
                    style={{ ...styles.iconBtn, color: member.active ? '#5C7A6B' : '#9AA79C' }}
                    onClick={() => toggleActive(member.id)}
                    title={member.active ? 'Deactivate' : 'Activate'}
                  >
                    {member.active ? <UserCheck size={16} /> : <UserX size={16} />}
                  </button>
                  <button style={styles.iconBtn} onClick={() => removeMember(member.id)} title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '4px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  eyebrow: { fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: 1, color: '#8A9B90', marginBottom: 4 },
  title: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: '#1E2320', margin: '0 0 6px' },
  desc: { fontSize: 13, color: '#7C7568', margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#5C7A6B', border: 'none', color: '#F4EFE4', padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  teamList: { display: 'flex', flexDirection: 'column', gap: 8 },
  teamCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FBF8F1', border: '1px solid #E4DCC8', borderRadius: 8, padding: '14px 18px' },
  teamCardLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: '#E4EBE6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: '#5C7A6B' },
  memberName: { fontSize: 14, fontWeight: 600, color: '#1E2320' },
  memberEmail: { fontSize: 12, color: '#9AA79C', display: 'flex', alignItems: 'center', gap: 4 },
  teamCardRight: { display: 'flex', alignItems: 'center', gap: 8 },
  roleBadge: { padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, fontFamily: "'IBM Plex Mono', monospace" },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#9AA79C', padding: 4, borderRadius: 4 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(30,35,32,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modalCard: { background: '#FBF8F1', borderRadius: 12, padding: 24, width: 400, maxWidth: '100%' },
  modalTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: '#1E2320', margin: '0 0 16px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DCD3BE', background: '#F4EFE4', fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#3C4A45', marginBottom: 12, boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DCD3BE', background: '#F4EFE4', fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#3C4A45', marginBottom: 12, boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 },
  primaryBtn: { background: '#5C7A6B', border: 'none', color: '#F4EFE4', padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  secondaryBtn: { background: 'transparent', border: '1px solid #DCD3BE', color: '#6B6459', padding: '9px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#9AA79C' },
};