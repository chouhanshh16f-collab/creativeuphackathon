import { useState } from 'react';
import { Download, FileText, Calendar as CalendarIcon, Copy } from 'lucide-react';

const ExportPanel = ({ items }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [copySuccess, setCopySuccess] = useState(false);

  const exportData = () => {
    const data = items.map(item => ({
      'Date': item.date,
      'Platform': item.platform,
      'Title': item.title,
      'Format': item.format,
      'Status': item.status,
      'Caption': item.caption || '',
      'Hashtags': item.hashtags || '',
    }));

    if (exportFormat === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, 'content-plan.csv');
    } else if (exportFormat === 'json') {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      downloadFile(blob, 'content-plan.json');
    } else if (exportFormat === 'markdown') {
      let markdown = '# 📊 Content Plan\n\n';
      markdown += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      markdown += `## Summary\n- Total Items: ${items.length}\n- Published: ${items.filter(i => i.status === 'published').length}\n- Scheduled: ${items.filter(i => i.status === 'scheduled').length}\n\n`;
      markdown += '## Content Items\n\n';
      markdown += '| Date | Platform | Title | Format | Status |\n';
      markdown += '|------|----------|-------|--------|--------|\n';
      data.forEach(row => {
        markdown += `| ${row.Date} | ${row.Platform} | ${row.Title} | ${row.Format} | ${row.Status} |\n`;
      });
      const blob = new Blob([markdown], { type: 'text/markdown' });
      downloadFile(blob, 'content-plan.md');
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const summary = items.map(item => 
      `📅 ${item.date} | ${item.platform.toUpperCase()} | ${item.title} | ${item.status}`
    ).join('\n');
    
    const fullSummary = `📊 Content Plan Summary\n\n${summary}\n\nTotal: ${items.length} items`;
    navigator.clipboard.writeText(fullSummary);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📤 Export & Share</h3>
        <p style={styles.subtitle}>Download your content plan in multiple formats</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.formatSelector}>
          <label style={styles.label}>Export Format</label>
          <select 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
            style={styles.select}
          >
            <option value="csv">📊 CSV (Spreadsheet)</option>
            <option value="json">📦 JSON (Data)</option>
            <option value="markdown">📝 Markdown</option>
          </select>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={exportData} style={styles.primaryBtn}>
            <Download size={16} />
            Export
          </button>
          <button onClick={copyToClipboard} style={styles.secondaryBtn}>
            <Copy size={16} />
            {copySuccess ? 'Copied!' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <FileText size={14} color="#5C7A6B" />
          <span>{items.length} total items</span>
        </div>
        <div style={styles.statItem}>
          <CalendarIcon size={14} color="#5C7A6B" />
          <span>
            {items.filter(i => i.status === 'scheduled').length} scheduled
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={{ color: '#28a745' }}>●</span>
          <span>
            {items.filter(i => i.status === 'published').length} published
          </span>
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
    marginBottom: '16px',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: 600,
    color: '#1E2320',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8A8375',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  formatSelector: {
    flex: 1,
    minWidth: '160px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#9AA79C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: '13px',
    color: '#3C4A45',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#F4EFE4',
    color: '#3C4A45',
    border: '1px solid #DCD3BE',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    paddingTop: '14px',
    borderTop: '1px solid #E4DCC8',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6B6459',
  },
};

export default ExportPanel;