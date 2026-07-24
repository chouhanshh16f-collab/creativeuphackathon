// import React from 'react';
import { Calendar, Clock, CheckCircle2, BarChart3 } from 'lucide-react';

const AnalyticsDashboard = ({ items }) => {
  // Calculate metrics
  const totalItems = items.length;
  const published = items.filter(i => i.status === 'published').length;
  const scheduled = items.filter(i => i.status === 'scheduled').length;
  const draft = items.filter(i => i.status === 'draft').length;
  const ideas = items.filter(i => i.status === 'idea').length;

  // Platform distribution
  const platformCount = items.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {});

  // Content by format
  const formatCount = items.reduce((acc, item) => {
    acc[item.format] = (acc[item.format] || 0) + 1;
    return acc;
  }, {});

  const metricCards = [
    { label: 'Total Content', value: totalItems, icon: BarChart3, color: '#5C7A6B' },
    { label: 'Published', value: published, icon: CheckCircle2, color: '#1E2320' },
    { label: 'Scheduled', value: scheduled, icon: Calendar, color: '#2F5C8A' },
    { label: 'In Progress', value: draft + ideas, icon: Clock, color: '#B5502F' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Analytics Dashboard</h3>
        <p style={styles.subtitle}>Content performance overview</p>
      </div>

      {/* Metric Cards */}
      <div style={styles.metricGrid}>
        {metricCards.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} style={styles.metricCard}>
              <div style={{ ...styles.metricIcon, color: metric.color }}>
                <Icon size={20} />
              </div>
              <div style={styles.metricValue}>{metric.value}</div>
              <div style={styles.metricLabel}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Platform Distribution */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Platform Distribution</h4>
        <div style={styles.platformGrid}>
          {Object.entries(platformCount).map(([platform, count]) => {
            const percentage = totalItems > 0 ? (count / totalItems * 100).toFixed(0) : 0;
            const colors = {
              instagram: '#B5502F',
              youtube: '#8A3324',
              linkedin: '#2F5C8A',
              tiktok: '#1E2320',
              twitter: '#3C4A45'
            };
            return (
              <div key={platform} style={styles.platformItem}>
                <div style={styles.platformHeader}>
                  <span style={styles.platformName}>{platform.toUpperCase()}</span>
                  <span style={styles.platformCount}>{count} ({percentage}%)</span>
                </div>
                <div style={styles.barContainer}>
                  <div 
                    style={{
                      ...styles.bar,
                      width: `${percentage}%`,
                      background: colors[platform] || '#5C7A6B'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Format Distribution */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Content Formats</h4>
        <div style={styles.formatGrid}>
          {Object.entries(formatCount).map(([format, count]) => (
            <div key={format} style={styles.formatTag}>
              <span>{format}</span>
              <span style={styles.formatCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Prediction (Mock) */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>📈 Predicted Engagement Score</h4>
        <div style={styles.engagementCard}>
          <div style={styles.engagementScore}>
            <span style={styles.scoreNumber}>78</span>
            <span style={styles.scoreLabel}>/100</span>
          </div>
          <div style={styles.engagementNote}>
            Based on your content mix, you're likely to see strong engagement 
            on Instagram and YouTube formats. Consider creating more Reels for 
            higher reach.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#FBF8F1',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #E4DCC8',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: 600,
    color: '#1E2320',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8A8375',
    margin: 0,
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  metricCard: {
    background: '#F4EFE4',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  metricIcon: {
    marginBottom: '6px',
  },
  metricValue: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#1E2320',
    lineHeight: 1.2,
  },
  metricLabel: {
    fontSize: '11px',
    color: '#9AA79C',
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1E2320',
    margin: '0 0 12px',
  },
  platformGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  platformItem: {
    background: '#F4EFE4',
    padding: '10px 14px',
    borderRadius: '6px',
  },
  platformHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  platformName: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#3C4A45',
  },
  platformCount: {
    fontSize: '11px',
    color: '#9AA79C',
  },
  barContainer: {
    height: '4px',
    background: '#E4DCC8',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  formatGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  formatTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: '#F4EFE4',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#3C4A45',
  },
  formatCount: {
    background: '#E4DCC8',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 600,
  },
  engagementCard: {
    background: '#E4EBE6',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  engagementScore: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  scoreNumber: {
    fontFamily: "'Fraunces', serif",
    fontSize: '36px',
    fontWeight: 700,
    color: '#1E2320',
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#8A8375',
  },
  engagementNote: {
    fontSize: '13px',
    color: '#4B4640',
    flex: 1,
    lineHeight: 1.5,
    minWidth: '200px',
  },
};

export default AnalyticsDashboard;