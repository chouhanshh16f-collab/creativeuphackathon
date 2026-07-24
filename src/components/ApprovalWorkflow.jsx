/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, User, Calendar as CalendarIcon } from 'lucide-react';

const APPROVAL_STATUS = {
  pending: { label: 'Pending Review', icon: Clock, color: '#B5502F' },
  approved: { label: 'Approved', icon: CheckCircle, color: '#5C7A6B' },
  rejected: { label: 'Rejected', icon: XCircle, color: '#C97B5F' },
  changes: { label: 'Changes Requested', icon: AlertCircle, color: '#B8A85C' }
};

export default function ApprovalWorkflow({ items, updateItem, team }) {
  const pendingItems = items.filter(i => i.status === 'scheduled' || i.status === 'draft');
  const approvedItems = items.filter(i => i.approvalStatus === 'approved');
  const rejectedItems = items.filter(i => i.approvalStatus === 'rejected');

  const updateApproval = (itemId, status, reviewerId) => {
    updateItem(itemId, { 
      approvalStatus: status, 
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString()
    });
  };

  const getReviewerName = (id) => {
    const member = team.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Workflow</div>
          <h2 style={styles.title}>Approval Workflow</h2>
          <p style={styles.desc}>Review and approve content before publishing</p>
        </div>
        <div style={styles.stats}>
          <span style={styles.statBadge}>
            <Clock size={14} /> {pendingItems.length} Pending
          </span>
          <span style={{ ...styles.statBadge, background: '#E4EBE6', color: '#5C7A6B' }}>
            <CheckCircle size={14} /> {approvedItems.length} Approved
          </span>
        </div>
      </div>

      <div style={styles.list}>
        {pendingItems.length === 0 ? (
          <div style={styles.emptyState}>No items pending approval</div>
        ) : (
          pendingItems.map(item => {
            const status = APPROVAL_STATUS[item.approvalStatus || 'pending'];
            const StatusIcon = status.icon;
            
            return (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <span style={styles.itemTitle}>{item.title}</span>
                    <span style={styles.platformTag}>{item.platform}</span>
                  </div>
                  <span style={{ ...styles.statusBadge, color: status.color, borderColor: status.color }}>
                    <StatusIcon size={12} /> {status.label}
                  </span>
                </div>
                
                <div style={styles.cardDetails}>
                  <span style={styles.detailItem}>
                    <CalendarIcon size={12} /> {item.date}
                  </span>
                  <span style={styles.detailItem}>
                    <User size={12} /> {item.assignedTo ? getReviewerName(item.assignedTo) : 'Unassigned'}
                  </span>
                </div>

                {item.approvalStatus === 'changes' && item.feedback && (
                  <div style={styles.feedbackBox}>
                    <strong>Feedback:</strong> {item.feedback}
                  </div>
                )}

                <div style={styles.actions}>
                  <button 
                    style={{ ...styles.approveBtn, ...styles.primaryBtn }}
                    onClick={() => updateApproval(item.id, 'approved', 'reviewer-1')}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button 
                    style={{ ...styles.changesBtn, ...styles.secondaryBtn }}
                    onClick={() => {
                      const feedback = prompt('Enter feedback for changes:');
                      if (feedback) {
                        updateItem(item.id, { 
                          approvalStatus: 'changes', 
                          feedback,
                          reviewedBy: 'reviewer-1',
                          reviewedAt: new Date().toISOString()
                        });
                      }
                    }}
                  >
                    <AlertCircle size={14} /> Request Changes
                  </button>
                  <button 
                    style={{ ...styles.rejectBtn, ...styles.dangerBtn }}
                    onClick={() => updateApproval(item.id, 'rejected', 'reviewer-1')}
                  >
                    <XCircle size={14} /> Reject
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
  stats: { display: 'flex', gap: 8 },
  statBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 6, background: '#F4EFE4', fontSize: 12, color: '#4B4640' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#FBF8F1', border: '1px solid #E4DCC8', borderRadius: 8, padding: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { display: 'flex', alignItems: 'center', gap: 8 },
  itemTitle: { fontWeight: 600, color: '#1E2320' },
  platformTag: { fontSize: 11, color: '#9AA79C', background: '#F4EFE4', padding: '2px 8px', borderRadius: 3 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 4, border: '1px solid', fontSize: 11, background: '#F4EFE4' },
  cardDetails: { display: 'flex', gap: 16, fontSize: 12, color: '#9AA79C', marginBottom: 8 },
  detailItem: { display: 'flex', alignItems: 'center', gap: 4 },
  feedbackBox: { background: '#FFF8E8', border: '1px solid #E8DCC8', borderRadius: 4, padding: 8, fontSize: 12, marginBottom: 8 },
  actions: { display: 'flex', gap: 8, marginTop: 8 },
  primaryBtn: { background: '#5C7A6B', color: '#F4EFE4', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  secondaryBtn: { background: '#F4EFE4', color: '#6B6459', border: '1px solid #DCD3BE', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  dangerBtn: { background: '#F4EFE4', color: '#B5502F', border: '1px solid #DCD3BE', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  approveBtn: {},
  changesBtn: {},
  rejectBtn: {},
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#9AA79C', fontSize: 13 },
};