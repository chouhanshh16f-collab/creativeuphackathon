import { useState } from 'react';
import { Wand2, Sparkles, Loader, Copy, Check, X } from 'lucide-react';

const AIGenerator = ({ onAddToCalendar, selectedDate, onClose }) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: 'blog', label: '📝 Blog Post' },
    { id: 'social', label: '📱 Social Media' },
    { id: 'script', label: '🎬 Video Script' },
    { id: 'email', label: '📧 Email Newsletter' },
    { id: 'headline', label: '💡 Headlines' },
  ];

  const generateContent = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI generation - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGenerated = {
        title: `10 Proven Strategies for ${topic}`,
        captions: [
          `🚀 Master ${topic} in 2026! Here's what actually works...`,
          `Stop overthinking ${topic} and start implementing these 5 tips 🎯`,
          `The ultimate guide to ${topic} that nobody is talking about 🤫`
        ],
        hashtags: [`#${topic.replace(/\s/g,'')}`, '#ContentStrategy', '#GrowthTips', '#CreatorEconomy'],
        script: `Hook: "Here's the truth about ${topic} that experts won't tell you..."\n\nBody:\n1. Start with why this matters\n2. Show 3 key strategies\n3. Share real examples\n\nCTA: "Comment YOUR strategy below!"`,
        format: 'Reel',
        platform: 'instagram'
      };
      
      setGenerated(mockGenerated);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToCalendar = () => {
    if (!generated) return;
    const date = selectedDate || new Date();
    const item = {
      id: `ai-${Date.now()}`,
      date: date.toISOString().split('T')[0],
      platform: generated.platform || 'instagram',
      title: generated.title,
      format: generated.format || 'Reel',
      status: 'draft',
      caption: generated.captions?.[0] || '',
      hashtags: generated.hashtags?.join(' ') || '',
      aiGenerated: true
    };
    onAddToCalendar(item);
    setGenerated(null);
    setTopic('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Sparkles size={20} color="#5C7A6B" />
          <h3 style={styles.title}>AI Content Generator</h3>
          {onClose && (
            <button onClick={onClose} style={styles.closeBtn}>
              <X size={18} />
            </button>
          )}
        </div>
        <p style={styles.description}>
          Generate captions, scripts, and ideas in seconds
        </p>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>What do you want to create content about?</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sustainable living tips, coding tutorials, product launch..."
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && generateContent()}
        />
      </div>

      <div style={styles.buttonRow}>
        <select 
          value={contentType} 
          onChange={(e) => setContentType(e.target.value)}
          style={styles.select}
        >
          {contentTypes.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
        <button 
          onClick={generateContent} 
          style={styles.generateBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={16} className="spinning" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Generate
            </>
          )}
        </button>
      </div>

      {generated && (
        <div style={styles.results}>
          <div style={styles.resultHeader}>
            <span style={styles.resultBadge}>✨ AI Generated</span>
            <button 
              onClick={() => copyToClipboard(JSON.stringify(generated, null, 2))}
              style={styles.copyBtn}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div style={styles.resultItem}>
            <label style={styles.resultLabel}>Title</label>
            <div style={styles.resultValue}>{generated.title}</div>
          </div>

          <div style={styles.resultItem}>
            <label style={styles.resultLabel}>Captions</label>
            {generated.captions?.map((cap, i) => (
              <div key={i} style={styles.captionItem}>
                <span>{i + 1}.</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>

          <div style={styles.resultItem}>
            <label style={styles.resultLabel}>Hashtags</label>
            <div style={styles.hashtagContainer}>
              {generated.hashtags?.map((tag, i) => (
                <span key={i} style={styles.hashtagChip}>#{tag}</span>
              ))}
            </div>
          </div>

          <div style={styles.resultItem}>
            <label style={styles.resultLabel}>Script/Outline</label>
            <div style={styles.scriptPreview}>{generated.script}</div>
          </div>

          <button onClick={addToCalendar} style={styles.addBtn}>
            📅 Add to Calendar
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: '#FBF8F1',
    border: '1px solid #E4DCC8',
    borderRadius: '12px',
    padding: '24px',
  },
  header: {
    marginBottom: '20px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
    position: 'relative',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: 600,
    color: '#1E2320',
    margin: 0,
  },
  closeBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9AA79C',
    padding: '4px',
  },
  description: {
    fontSize: '13px',
    color: '#8A8375',
    margin: 0,
  },
  inputGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#9AA79C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: '14px',
    color: '#3C4A45',
    boxSizing: 'border-box',
    outline: 'none',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: '13px',
    color: '#3C4A45',
    flex: 1,
  },
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  results: {
    marginTop: '18px',
    paddingTop: '16px',
    borderTop: '1px solid #E4DCC8',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  resultBadge: {
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#5C7A6B',
    background: '#E4EBE6',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid #DCD3BE',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#6B6459',
    cursor: 'pointer',
  },
  resultItem: {
    marginBottom: '12px',
  },
  resultLabel: {
    fontSize: '10px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#9AA79C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '4px',
  },
  resultValue: {
    fontSize: '14px',
    color: '#1E2320',
    fontWeight: 500,
  },
  captionItem: {
    display: 'flex',
    gap: '8px',
    fontSize: '13px',
    color: '#4B4640',
    padding: '4px 0',
    borderBottom: '1px dashed #E4DCC8',
  },
  hashtagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  hashtagChip: {
    fontSize: '12px',
    color: '#5C7A6B',
    background: '#F4EFE4',
    padding: '4px 10px',
    borderRadius: '12px',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  scriptPreview: {
    fontSize: '13px',
    color: '#4B4640',
    background: '#F4EFE4',
    padding: '10px 14px',
    borderRadius: '6px',
    whiteSpace: 'pre-line',
    lineHeight: 1.6,
  },
  addBtn: {
    width: '100%',
    padding: '10px',
    background: '#1E2320',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
};

// Add spinning animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .spinning {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AIGenerator;