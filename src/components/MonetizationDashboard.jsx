import { useState, useMemo } from 'react';
import {
  DollarSign, Link2, Tag, TrendingUp,
  Plus, X, Trash2,
  Instagram, Youtube, Linkedin, Twitter, Music2, Copy
} from 'lucide-react';

const MonetizationDashboard = ({ items }) => {
  const [activeTab, setActiveTab] = useState('affiliate'); // affiliate | sponsorship | revenue
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Sample data - In production, this would come from localStorage or database
  const [affiliateLinks, setAffiliateLinks] = useState([
    {
      id: 'aff-1',
      name: 'Best Productivity Tool',
      url: 'https://example.com/product',
      platform: 'instagram',
      contentId: 'content-1',
      clicks: 245,
      conversions: 12,
      revenue: 347.50,
      date: '2026-07-20',
      status: 'active',
    },
    {
      id: 'aff-2',
      name: 'Course Bundle',
      url: 'https://example.com/course',
      platform: 'youtube',
      contentId: 'content-2',
      clicks: 189,
      conversions: 8,
      revenue: 239.20,
      date: '2026-07-18',
      status: 'active',
    },
  ]);

  const [sponsorships, setSponsorships] = useState([
    {
      id: 'spon-1',
      brand: 'TechCorp',
      campaign: 'Summer Launch',
      platform: 'instagram',
      contentId: 'content-3',
      amount: 500,
      status: 'pending', // pending | active | completed
      date: '2026-07-25',
      notes: 'Post 3 stories and 1 reel',
      paid: false,
    },
    {
      id: 'spon-2',
      brand: 'GrowthApp',
      campaign: 'Q3 Promo',
      platform: 'tiktok',
      contentId: 'content-4',
      amount: 300,
      status: 'active',
      date: '2026-07-15',
      notes: '1 TikTok video + link in bio',
      paid: false,
    },
  ]);

  const [revenueEntries, setRevenueEntries] = useState([
    {
      id: 'rev-1',
      source: 'Affiliate - Product Tool',
      platform: 'instagram',
      amount: 347.50,
      type: 'affiliate',
      date: '2026-07-20',
      notes: 'July affiliate earnings',
    },
    {
      id: 'rev-2',
      source: 'Sponsorship - TechCorp',
      platform: 'instagram',
      amount: 500.00,
      type: 'sponsorship',
      date: '2026-07-25',
      notes: 'Summer Launch campaign',
    },
    {
      id: 'rev-3',
      source: 'Affiliate - Course Bundle',
      platform: 'youtube',
      amount: 239.20,
      type: 'affiliate',
      date: '2026-07-18',
      notes: 'YouTube affiliate earnings',
    },
    {
      id: 'rev-4',
      source: 'Sponsorship - GrowthApp',
      platform: 'tiktok',
      amount: 300.00,
      type: 'sponsorship',
      date: '2026-07-15',
      notes: 'TikTok sponsorship',
    },
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Calculate totals
  const totalAffiliateRevenue = affiliateLinks.reduce((sum, item) => sum + item.revenue, 0);
  const totalSponsorshipRevenue = sponsorships.reduce((sum, item) => sum + item.amount, 0);
  const totalRevenue = totalAffiliateRevenue + totalSponsorshipRevenue;
  const totalClicks = affiliateLinks.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = affiliateLinks.reduce((sum, item) => sum + item.conversions, 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

  // Platform distribution
  const platformRevenue = useMemo(() => {
    const distribution = {};
    revenueEntries.forEach(entry => {
      distribution[entry.platform] = (distribution[entry.platform] || 0) + entry.amount;
    });
    return distribution;
  }, [revenueEntries]);

  // Add new affiliate link
  const addAffiliateLink = (data) => {
    const newLink = {
      id: `aff-${Date.now()}`,
      ...data,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      status: 'active',
    };
    setAffiliateLinks([...affiliateLinks, newLink]);
    showToast('✅ Affiliate link added!');
    setShowAddModal(false);
  };

  // Add new sponsorship
  const addSponsorship = (data) => {
    const newSponsorship = {
      id: `spon-${Date.now()}`,
      ...data,
      paid: false,
    };
    setSponsorships([...sponsorships, newSponsorship]);
    showToast('✅ Sponsorship added!');
    setShowAddModal(false);
  };

  // Add revenue entry
  const addRevenueEntry = (data) => {
    const newEntry = {
      id: `rev-${Date.now()}`,
      ...data,
    };
    setRevenueEntries([...revenueEntries, newEntry]);
    showToast('✅ Revenue entry added!');
    setShowAddModal(false);
  };

  // Delete functions
  const deleteItem = (type, id) => {
    if (type === 'affiliate') {
      setAffiliateLinks(affiliateLinks.filter(item => item.id !== id));
    } else if (type === 'sponsorship') {
      setSponsorships(sponsorships.filter(item => item.id !== id));
    } else if (type === 'revenue') {
      setRevenueEntries(revenueEntries.filter(item => item.id !== id));
    }
    showToast('🗑️ Item deleted');
  };

  // Mark sponsorship as paid
  const markAsPaid = (id) => {
    setSponsorships(sponsorships.map(item =>
      item.id === id ? { ...item, paid: true } : item
    ));
    showToast('💰 Marked as paid!');
  };

  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard!');
  };

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <DollarSign size={24} color="#5C7A6B" />
          <h2 style={styles.title}>Monetization Dashboard</h2>
          <span style={styles.badge}>💰 Revenue Tracker</span>
        </div>
        <p style={styles.description}>Track affiliate links, sponsorships, and revenue across all platforms</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><DollarSign size={20} color="#5C7A6B" /></div>
          <div style={styles.statValue}>${totalRevenue.toFixed(2)}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><Link2 size={20} color="#2F5C8A" /></div>
          <div style={styles.statValue}>${totalAffiliateRevenue.toFixed(2)}</div>
          <div style={styles.statLabel}>Affiliate Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><Tag size={20} color="#B5502F" /></div>
          <div style={styles.statValue}>${totalSponsorshipRevenue.toFixed(2)}</div>
          <div style={styles.statLabel}>Sponsorship Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><TrendingUp size={20} color="#1E2320" /></div>
          <div style={styles.statValue}>{conversionRate}%</div>
          <div style={styles.statLabel}>Conversion Rate</div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div style={styles.platformDistribution}>
        <h4 style={styles.sectionTitle}>📊 Revenue by Platform</h4>
        <div style={styles.platformGrid}>
          {Object.entries(platformRevenue).map(([platform, amount]) => {
            const colors = {
              instagram: '#B5502F',
              youtube: '#8A3324',
              linkedin: '#2F5C8A',
              tiktok: '#1E2320',
              twitter: '#3C4A45'
            };
            const icons = {
              instagram: Instagram,
              youtube: Youtube,
              linkedin: Linkedin,
              tiktok: Music2,
              twitter: Twitter
            };
            const Icon = icons[platform] || Instagram;
            const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(0) : 0;

            return (
              <div key={platform} style={styles.platformItem}>
                <div style={styles.platformHeader}>
                  <Icon size={16} color={colors[platform] || '#5C7A6B'} />
                  <span style={styles.platformName}>{platform}</span>
                  <span style={styles.platformAmount}>${amount.toFixed(2)}</span>
                </div>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${percentage}%`,
                      background: colors[platform] || '#5C7A6B',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('affiliate')}
          style={{ ...styles.tab, ...(activeTab === 'affiliate' ? styles.tabActive : {}) }}
        >
          <Link2 size={16} /> Affiliate Links
        </button>
        <button
          onClick={() => setActiveTab('sponsorship')}
          style={{ ...styles.tab, ...(activeTab === 'sponsorship' ? styles.tabActive : {}) }}
        >
          <Tag size={16} /> Sponsorships
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          style={{ ...styles.tab, ...(activeTab === 'revenue' ? styles.tabActive : {}) }}
        >
          <DollarSign size={16} /> Revenue Log
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Affiliate Links Tab */}
        {activeTab === 'affiliate' && (
          <div>
            <div style={styles.tabHeader}>
              <span style={styles.itemCount}>{affiliateLinks.length} links</span>
              <button
                onClick={() => setShowAddModal(true)}
                style={styles.addBtn}
              >
                <Plus size={16} /> Add Link
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Link Name</th>
                    <th style={{ textAlign: 'left' }}>Platform</th>
                    <th style={{ textAlign: 'center' }}>Clicks</th>
                    <th style={{ textAlign: 'center' }}>Conversions</th>
                    <th style={{ textAlign: 'center' }}>Revenue</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliateLinks.map(link => (
                    <tr key={link.id}>
                      <td style={{ textAlign: 'left' }}>
                        <div style={styles.linkName}>
                          <span>{link.name}</span>
                          <button
                            onClick={() => copyToClipboard(link.url)}
                            style={styles.copyLinkBtn}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        <span style={{ ...styles.platformTag, borderColor: '#5C7A6B' }}>
                          {link.platform}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{link.clicks}</td>
                      <td style={{ textAlign: 'center' }}>{link.conversions}</td>
                      <td style={{ textAlign: 'center' }}><strong>${link.revenue.toFixed(2)}</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => deleteItem('affiliate', link.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sponsorships Tab */}
        {activeTab === 'sponsorship' && (
          <div>
            <div style={styles.tabHeader}>
              <span style={styles.itemCount}>{sponsorships.length} sponsorships</span>
              <button
                onClick={() => setShowAddModal(true)}
                style={styles.addBtn}
              >
                <Plus size={16} /> Add Sponsorship
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Brand</th>
                    <th style={{ textAlign: 'left' }}>Campaign</th>
                    <th style={{ textAlign: 'left' }}>Platform</th>
                    <th style={{ textAlign: 'center' }}>Amount</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Paid</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map(sponsorship => (
                    <tr key={sponsorship.id}>
                      <td style={{ textAlign: 'left' }}><strong>{sponsorship.brand}</strong></td>
                      <td style={{ textAlign: 'left' }}>{sponsorship.campaign}</td>
                      <td style={{ textAlign: 'left' }}>
                        <span style={{ ...styles.platformTag, borderColor: '#2F5C8A' }}>
                          {sponsorship.platform}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}><strong>${sponsorship.amount.toFixed(2)}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(sponsorship.status === 'active' ? styles.statusActive : {}),
                          ...(sponsorship.status === 'pending' ? styles.statusPending : {}),
                          ...(sponsorship.status === 'completed' ? styles.statusCompleted : {}),
                        }}>
                          {sponsorship.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {sponsorship.paid ? (
                          <span style={styles.paidBadge}>✅ Paid</span>
                        ) : (
                          <button
                            onClick={() => markAsPaid(sponsorship.id)}
                            style={styles.markPaidBtn}
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => deleteItem('sponsorship', sponsorship.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Log Tab */}
        {activeTab === 'revenue' && (
          <div>
            <div style={styles.tabHeader}>
              <span style={styles.itemCount}>{revenueEntries.length} entries</span>
              <button
                onClick={() => setShowAddModal(true)}
                style={styles.addBtn}
              >
                <Plus size={16} /> Add Revenue
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Source</th>
                    <th style={{ textAlign: 'left' }}>Platform</th>
                    <th style={{ textAlign: 'left' }}>Type</th>
                    <th style={{ textAlign: 'center' }}>Amount</th>
                    <th style={{ textAlign: 'center' }}>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueEntries.map(entry => (
                    <tr key={entry.id}>
                      <td style={{ textAlign: 'left' }}>{entry.source}</td>
                      <td style={{ textAlign: 'left' }}>
                        <span style={{ ...styles.platformTag, borderColor: '#5C7A6B' }}>
                          {entry.platform}
                        </span>
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        <span style={{
                          ...styles.typeBadge,
                          ...(entry.type === 'affiliate' ? styles.typeAffiliate : {}),
                          ...(entry.type === 'sponsorship' ? styles.typeSponsorship : {}),
                        }}>
                          {entry.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}><strong>${entry.amount.toFixed(2)}</strong></td>
                      <td style={{ textAlign: 'center' }}>{entry.date}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => deleteItem('revenue', entry.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal
          type={activeTab}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={(data) => {
            if (activeTab === 'affiliate') addAffiliateLink(data);
            else if (activeTab === 'sponsorship') addSponsorship(data);
            else if (activeTab === 'revenue') addRevenueEntry(data);
          }}
          editingItem={editingItem}
          items={items}
        />
      )}
    </div>
  );
};

// Add Modal Component
const AddModal = ({ type, onClose, onSave, editingItem, items }) => {
  const [formData, setFormData] = useState(editingItem || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderForm = () => {
    if (type === 'affiliate') {
      return (
        <>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Link Name</label>
            <input
              type="text"
              placeholder="e.g., Best Productivity Tool"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>URL</label>
            <input
              type="url"
              placeholder="https://example.com/product"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Platform</label>
            <select
              value={formData.platform || 'instagram'}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              style={styles.formSelect}
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Content Piece (optional)</label>
            <select
              value={formData.contentId || ''}
              onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
              style={styles.formSelect}
            >
              <option value="">Select content</option>
              {items?.map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
        </>
      );
    }

    if (type === 'sponsorship') {
      return (
        <>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Brand Name</label>
            <input
              type="text"
              placeholder="e.g., TechCorp"
              value={formData.brand || ''}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Campaign</label>
            <input
              type="text"
              placeholder="e.g., Summer Launch"
              value={formData.campaign || ''}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Platform</label>
            <select
              value={formData.platform || 'instagram'}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              style={styles.formSelect}
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Amount ($)</label>
            <input
              type="number"
              placeholder="500"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Status</label>
            <select
              value={formData.status || 'pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={styles.formSelect}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Notes</label>
            <textarea
              placeholder="e.g., Post 3 stories and 1 reel"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={styles.formTextarea}
              rows={3}
            />
          </div>
        </>
      );
    }

    if (type === 'revenue') {
      return (
        <>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Source</label>
            <input
              type="text"
              placeholder="e.g., Affiliate - Product Tool"
              value={formData.source || ''}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Platform</label>
            <select
              value={formData.platform || 'instagram'}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              style={styles.formSelect}
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Type</label>
            <select
              value={formData.type || 'affiliate'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={styles.formSelect}
            >
              <option value="affiliate">Affiliate</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Amount ($)</label>
            <input
              type="number"
              placeholder="347.50"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Date</label>
            <input
              type="date"
              value={formData.date || new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Notes (optional)</label>
            <input
              type="text"
              placeholder="Any notes about this entry"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={styles.formInput}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>
            {editingItem ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <button onClick={onClose} style={styles.modalCloseBtn}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    background: '#FBF8F1',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #E4DCC8',
  },
  toast: {
    position: 'fixed',
    top: 90,
    right: 16,
    background: '#1E2320',
    color: '#F4EFE4',
    padding: '10px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    zIndex: 9999,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 600,
    color: '#1E2320',
    margin: 0,
  },
  badge: {
    fontSize: 10,
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#5C7A6B',
    background: '#E4EBE6',
    padding: '2px 10px',
    borderRadius: '12px',
  },
  description: {
    fontSize: 13,
    color: '#8A8375',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: '#F4EFE4',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "'Fraunces', serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#1E2320',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: 11,
    color: '#9AA79C',
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  platformDistribution: {
    background: '#F4EFE4',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1E2320',
    margin: '0 0 12px',
  },
  platformGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  platformItem: {
    background: 'white',
    padding: '10px 14px',
    borderRadius: '6px',
  },
  platformHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  platformName: {
    fontSize: 12,
    fontWeight: 500,
    color: '#3C4A45',
    flex: 1,
  },
  platformAmount: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E2320',
  },
  barContainer: {
    height: 4,
    background: '#E4DCC8',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    borderBottom: '1px solid #E4DCC8',
    paddingBottom: 8,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    fontSize: 13,
    color: '#6B6459',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#1E2320',
    color: '#F4EFE4',
  },
  content: {
    minHeight: 300,
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 12,
    color: '#9AA79C',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    '& th': {
      padding: '10px 12px',
      borderBottom: '2px solid #E4DCC8',
      fontWeight: 600,
      color: '#3C4A45',
      textAlign: 'left',
    },
    '& td': {
      padding: '10px 12px',
      borderBottom: '1px solid #E4DCC8',
      verticalAlign: 'middle',
    },
  },
  platformTag: {
    padding: '2px 10px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#3C4A45',
  },
  statusBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: 'capitalize',
  },
  statusActive: {
    background: '#E4EBE6',
    color: '#5C7A6B',
  },
  statusPending: {
    background: '#FFF3E0',
    color: '#B5502F',
  },
  statusCompleted: {
    background: '#E8F5E9',
    color: '#2E7D32',
  },
  paidBadge: {
    fontSize: 12,
    color: '#2E7D32',
  },
  markPaidBtn: {
    padding: '2px 10px',
    background: '#E4EBE6',
    border: 'none',
    borderRadius: '4px',
    fontSize: 11,
    color: '#2E7D32',
    cursor: 'pointer',
  },
  linkName: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  copyLinkBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9AA79C',
    padding: 2,
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#B5502F',
    padding: 4,
  },
  typeBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: 'capitalize',
  },
  typeAffiliate: {
    background: '#E3F2FD',
    color: '#1565C0',
  },
  typeSponsorship: {
    background: '#FCE4EC',
    color: '#C62828',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30,35,32,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20,
  },
  modalCard: {
    background: '#FBF8F1',
    borderRadius: '12px',
    padding: 24,
    width: 480,
    maxWidth: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 20,
    fontWeight: 600,
    color: '#1E2320',
    margin: 0,
  },
  modalCloseBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9AA79C',
    padding: 4,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    display: 'block',
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#9AA79C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  formInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: 13,
    color: '#3C4A45',
    boxSizing: 'border-box',
    outline: 'none',
  },
  formSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: 13,
    color: '#3C4A45',
    boxSizing: 'border-box',
    outline: 'none',
  },
  formTextarea: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: 13,
    color: '#3C4A45',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
  },
  modalFooter: {
    display: 'flex',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #E4DCC8',
  },
  cancelBtn: {
    flex: 1,
    padding: '8px',
    background: 'transparent',
    border: '1px solid #DCD3BE',
    borderRadius: '6px',
    fontSize: 13,
    color: '#6B6459',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 1,
    padding: '8px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default MonetizationDashboard;