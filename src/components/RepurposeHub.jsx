import { useState } from 'react';
import { 
  Youtube, Instagram, Music2, Twitter, FileText, Video, 
  Mic, Sparkles, Copy, Check, 
  Globe, Newspaper, Share2
} from 'lucide-react';

const RepurposeHub = ({ onAddToCalendar }) => {
  const [sourceType, setSourceType] = useState('youtube');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [copied, setCopied] = useState({});

  // Source Types Configuration
  const sourceTypes = [
    { 
      id: 'youtube', 
      label: 'YouTube Video', 
      icon: Youtube, 
      color: '#FF0000',
      placeholder: 'Paste YouTube URL here...',
      hasUrl: true,
    },
    { 
      id: 'blog', 
      label: 'Blog Post', 
      icon: FileText, 
      color: '#2F5C8A',
      placeholder: 'Paste your blog post content here...',
      hasUrl: false,
    },
    { 
      id: 'video', 
      label: 'Video Script', 
      icon: Video, 
      color: '#8A3324',
      placeholder: 'Paste your video script here...',
      hasUrl: false,
    },
    { 
      id: 'podcast', 
      label: 'Podcast Episode', 
      icon: Mic, 
      color: '#5C7A6B',
      placeholder: 'Paste podcast transcript or notes...',
      hasUrl: false,
    },
    { 
      id: 'twitter', 
      label: 'Twitter/X Thread', 
      icon: Twitter, 
      color: '#1DA1F2',
      placeholder: 'Paste your Twitter/X thread here...',
      hasUrl: false,
    },
  ];

  // Destination Platforms
  const destinationPlatforms = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#B5502F' },
    { id: 'tiktok', label: 'TikTok', icon: Music2, color: '#1E2320' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: '#2F5C8A' },
    { id: 'blog', label: 'Blog Post', icon: FileText, color: '#5C7A6B' },
    { id: 'newsletter', label: 'Newsletter', icon: Newspaper, color: '#B5502F' },
  ];

  // Extract YouTube video ID
  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([\w-]+)/,
      /(?:youtu\.be\/)([\w-]+)/,
      /(?:youtube\.com\/embed\/)([\w-]+)/,
      /(?:youtube\.com\/shorts\/)([\w-]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Generate content based on source type
  const generateContent = async () => {
    setLoading(true);
    try {
      let sourceData = {};

      // Handle different source types
      if (sourceType === 'youtube') {
        const videoId = extractVideoId(sourceUrl);
        if (!videoId) {
          alert('❌ Invalid YouTube URL. Please check and try again.');
          setLoading(false);
          return;
        }
        
        // Fetch video info
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        const data = await response.json();
        sourceData = {
          title: data.title,
          author: data.author_name,
          thumbnail: data.thumbnail_url,
          content: `Check out "${data.title}" by ${data.author_name}`,
        };
      } else {
        // For text-based sources
        if (!sourceText.trim()) {
          alert('❌ Please paste some content first.');
          setLoading(false);
          return;
        }
        sourceData = {
          title: sourceText.split('\n')[0].substring(0, 60),
          content: sourceText,
        };
      }

      // Generate content for different platforms
      const generatedContent = generatePlatformContent(sourceData, sourceType);
      setGenerated({
        ...generatedContent,
        sourceData,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate platform-specific content
  const generatePlatformContent = (source) => {
    const title = source.title || 'This content';
    const platformContent = {};

    // Instagram Content
    platformContent.instagram = {
      caption: `📌 ${title}\n\nHere's what I learned:\n${['💡 Key insight 1', '✨ Key insight 2', '🔥 Key insight 3'].join('\n')}\n\nWhat's your take? 👇\n\n#ContentCreator #LearnOnInstagram #ValueContent`,
      hashtags: ['#ContentCreator', '#LearnOnInstagram', '#ValueContent', '#GrowthTips', '#CreatorLife'],
      format: 'Carousel Post',
      slides: ['Slide 1: Hook statement', 'Slide 2-4: Key points', 'Slide 5: Call to action'],
    };

    // TikTok Content
    platformContent.tiktok = {
      script: `🎬 "${title}" - Here's why this matters!\n\n⚡️ Key takeaways:\n1. [Takeaway 1]\n2. [Takeaway 2]\n3. [Takeaway 3]\n\nSave this for later! 💾\n\n#TikTokTips #ContentCreator #Viral #LearnOnTikTok`,
      hashtags: ['#TikTokTips', '#ContentCreator', '#Viral', '#LearnOnTikTok', '#CreatorCommunity'],
      format: 'TikTok/Reel',
      visualIdeas: ['React to content', 'Text overlay key points', 'B-roll of your process'],
    };

    // Twitter/X Content
    platformContent.twitter = {
      thread: [
        `🧵 ${title} - A thread 🧵`,
        `1/7 What if I told you that ${title} could change everything?`,
        `2/7 Here's why it matters...`,
        `3/7 Key insight #1...`,
        `4/7 Key insight #2...`,
        `5/7 Key insight #3...`,
        `6/7 The real takeaway is...`,
        `7/7 What do you think? Drop your thoughts below! 👇`,
      ],
      hashtags: ['#Thread', '#ContentCreator', '#TwitterSpaces', '#LearnOnTwitter', '#CreatorEconomy'],
      format: 'Thread',
    };

    // LinkedIn Content
    platformContent.linkedin = {
      post: `${title}\n\nI've been thinking a lot about this topic lately. Here are my key takeaways:\n\n1. Insight 1\n2. Insight 2\n3. Insight 3\n\nWhat's your perspective? I'd love to hear your thoughts in the comments!\n\n#ProfessionalGrowth #Leadership #ContentStrategy`,
      hashtags: ['#ProfessionalGrowth', '#Leadership', '#ContentStrategy', '#CareerDevelopment', '#LinkedInTips'],
      format: 'Post',
    };

    // Blog Content
    platformContent.blog = {
      title: title,
      intro: `In this post, we'll explore ${title} and why it matters...`,
      sections: [
        { heading: 'Why This Matters', content: 'Content about why this topic is relevant...' },
        { heading: 'Key Takeaways', content: 'The most important points to remember...' },
        { heading: 'Next Steps', content: 'What you can do next...' },
      ],
      conclusion: 'In conclusion, this topic is crucial because...',
      format: 'Blog Post',
    };

    // Newsletter Content
    platformContent.newsletter = {
      subject: title,
      preview: `This week: ${title}`,
      body: `Hello everyone! 👋\n\n${title}\n\nIn this week's newsletter, we're diving into...\n\n[Content here]\n\nUntil next time,\n[Your Name]`,
      cta: 'Reply to this email with your thoughts!',
      format: 'Newsletter',
    };

    return platformContent;
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
  };

  const addToCalendar = (platform) => {
    if (!generated) return;
    const content = generated[platform];
    const date = new Date();
    
    const item = {
      id: `repurpose-${Date.now()}`,
      date: date.toISOString().split('T')[0],
      platform: platform,
      title: `Repurposed: ${generated.sourceData.title.substring(0, 50)}`,
      format: content.format || 'Post',
      status: 'draft',
      caption: content.caption || content.script || content.post || content.thread?.join('\n') || '',
      hashtags: content.hashtags?.join(' ') || '',
      aiGenerated: true,
      source: sourceType,
    };
    
    onAddToCalendar(item);
    alert(`✅ Added ${platform} content to calendar!`);
  };

  // Get selected source config
  const sourceConfig = sourceTypes.find(s => s.id === sourceType);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Share2 size={22} color="#5C7A6B" />
          <h3 style={styles.title}>Content Repurpose Hub</h3>
          <span style={styles.badge}>✨ AI-Powered</span>
        </div>
        <p style={styles.description}>
          Transform one piece of content into multiple formats for different platforms
        </p>
      </div>

      {/* Source Selection */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>Source Content</label>
        <div style={styles.sourceGrid}>
          {sourceTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => {
                  setSourceType(type.id);
                  setGenerated(null);
                }}
                style={{
                  ...styles.sourceButton,
                  ...(sourceType === type.id ? styles.sourceButtonActive : {}),
                  borderColor: sourceType === type.id ? type.color : '#DCD3BE',
                }}
              >
                <Icon size={18} color={sourceType === type.id ? type.color : '#6B6459'} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source Input */}
      <div style={styles.inputSection}>
        {sourceConfig.hasUrl ? (
          <div style={styles.urlInputGroup}>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder={sourceConfig.placeholder}
              style={styles.urlInput}
              onKeyDown={(e) => e.key === 'Enter' && generateContent()}
            />
          </div>
        ) : (
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={sourceConfig.placeholder}
            style={styles.textareaInput}
            rows={4}
          />
        )}
        <button 
          onClick={generateContent} 
          style={styles.generateBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Sparkles size={18} className="spinning" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Content
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {generated && (
        <div style={styles.results}>
          <div style={styles.sourcePreview}>
            <div style={styles.sourceInfo}>
              <span style={styles.sourceBadge}>
                📄 {sourceTypes.find(s => s.id === sourceType)?.label}
              </span>
              <h4 style={styles.sourceTitle}>{generated.sourceData.title}</h4>
            </div>
          </div>

          {/* Platform Selection */}
          <div style={styles.destinationSection}>
            <label style={styles.sectionLabel}>Destination Platforms</label>
            <div style={styles.destinationGrid}>
              {destinationPlatforms.map(platform => {
                const Icon = platform.icon;
                const hasContent = generated[platform.id];
                return (
                  <button
                    key={platform.id}
                    onClick={() => hasContent && setSelectedPlatform(platform.id)}
                    style={{
                      ...styles.destinationButton,
                      ...(selectedPlatform === platform.id ? styles.destinationButtonActive : {}),
                      ...(!hasContent ? styles.destinationButtonDisabled : {}),
                    }}
                  >
                    <Icon size={16} color={selectedPlatform === platform.id ? platform.color : '#6B6459'} />
                    <span>{platform.label}</span>
                    {hasContent && <span style={styles.checkmark}>✅</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated Content */}
          {generated[selectedPlatform] && (
            <div style={styles.contentCard}>
              <div style={styles.contentHeader}>
                <span style={styles.contentBadge}>
                  {destinationPlatforms.find(p => p.id === selectedPlatform)?.label}
                </span>
                <span style={styles.formatBadge}>
                  {generated[selectedPlatform].format}
                </span>
              </div>

              {/* Render different content types */}
              {selectedPlatform === 'twitter' && generated.twitter.thread ? (
                <div style={styles.contentSection}>
                  <label style={styles.sectionLabel}>🧵 Thread</label>
                  <div style={styles.threadContainer}>
                    {generated.twitter.thread.map((tweet, i) => (
                      <div key={i} style={styles.tweetItem}>
                        <span style={styles.tweetNumber}>{i + 1}/7</span>
                        <span>{tweet}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(generated.twitter.thread.join('\n\n'), 'twitter')}
                    style={styles.copyBtnFull}
                  >
                    {copied.twitter ? <Check size={14} /> : <Copy size={14} />}
                    {copied.twitter ? 'Copied!' : 'Copy Thread'}
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.contentSection}>
                    <label style={styles.sectionLabel}>
                      {selectedPlatform === 'tiktok' ? '🎬 Script' : 
                       selectedPlatform === 'linkedin' ? '📝 Post' :
                       selectedPlatform === 'blog' ? '📄 Content' :
                       selectedPlatform === 'newsletter' ? '✉️ Content' :
                       '📝 Caption'}
                    </label>
                    <div style={styles.contentPreview}>
                      <pre style={styles.contentText}>
                        {generated[selectedPlatform].caption || 
                         generated[selectedPlatform].script || 
                         generated[selectedPlatform].post || 
                         generated[selectedPlatform].body ||
                         'Content not available'}
                      </pre>
                      <button 
                        onClick={() => {
                          const text = generated[selectedPlatform].caption || 
                                      generated[selectedPlatform].script || 
                                      generated[selectedPlatform].post || 
                                      generated[selectedPlatform].body ||
                                      '';
                          copyToClipboard(text, 'content');
                        }}
                        style={styles.copyBtn}
                      >
                        {copied.content ? <Check size={14} /> : <Copy size={14} />}
                        {copied.content ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Hashtags */}
                  {generated[selectedPlatform].hashtags && (
                    <div style={styles.contentSection}>
                      <label style={styles.sectionLabel}>🏷️ Hashtags</label>
                      <div style={styles.hashtagContainer}>
                        {generated[selectedPlatform].hashtags.map((tag, i) => (
                          <span key={i} style={styles.hashtagChip}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual Ideas */}
                  {generated[selectedPlatform].visualIdeas && (
                    <div style={styles.contentSection}>
                      <label style={styles.sectionLabel}>🎥 Visual Ideas</label>
                      <ul style={styles.listContainer}>
                        {generated[selectedPlatform].visualIdeas.map((idea, i) => (
                          <li key={i} style={styles.listItem}>{idea}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Carousel Slides */}
                  {generated[selectedPlatform].slides && (
                    <div style={styles.contentSection}>
                      <label style={styles.sectionLabel}>🖼️ Carousel Slides</label>
                      <ul style={styles.listContainer}>
                        {generated[selectedPlatform].slides.map((slide, i) => (
                          <li key={i} style={styles.listItem}>{slide}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              <div style={styles.actionButtons}>
                <button 
                  onClick={() => addToCalendar(selectedPlatform)}
                  style={styles.addCalendarBtn}
                >
                  📅 Add to Calendar
                </button>
                <button 
                  onClick={() => {
                    const content = generated[selectedPlatform];
                    const text = content.caption || content.script || content.post || 
                                content.thread?.join('\n') || content.body || '';
                    copyToClipboard(text, 'full');
                  }}
                  style={styles.copyAllBtn}
                >
                  {copied.full ? <Check size={14} /> : <Copy size={14} />}
                  {copied.full ? 'Copied!' : 'Copy All'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
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
  header: {
    marginBottom: '24px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: 600,
    color: '#1E2320',
    margin: 0,
  },
  badge: {
    fontSize: '10px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#5C7A6B',
    background: '#E4EBE6',
    padding: '2px 10px',
    borderRadius: '12px',
  },
  description: {
    fontSize: '13px',
    color: '#8A8375',
    margin: 0,
  },
  section: {
    marginBottom: '16px',
  },
  sectionLabel: {
    display: 'block',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#9AA79C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  sourceGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sourceButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '2px solid #DCD3BE',
    background: 'transparent',
    fontSize: '13px',
    color: '#6B6459',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sourceButtonActive: {
    background: '#F4EFE4',
    fontWeight: 600,
  },
  inputSection: {
    marginBottom: '20px',
  },
  urlInputGroup: {
    display: 'flex',
    gap: '10px',
  },
  urlInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: '14px',
    color: '#3C4A45',
    outline: 'none',
  },
  textareaInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #DCD3BE',
    background: '#F4EFE4',
    fontSize: '14px',
    color: '#3C4A45',
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  generateBtn: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 24px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
  },
  results: {
    marginTop: '20px',
    borderTop: '2px solid #E4DCC8',
    paddingTop: '20px',
  },
  sourcePreview: {
    background: '#F4EFE4',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
  },
  sourceBadge: {
    fontSize: '11px',
    color: '#9AA79C',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  sourceTitle: {
    fontSize: '15px',
    color: '#1E2320',
    margin: '4px 0 0',
    fontWeight: 600,
  },
  destinationSection: {
    marginBottom: '16px',
  },
  destinationGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  destinationButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #DCD3BE',
    background: 'transparent',
    fontSize: '12px',
    color: '#6B6459',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  destinationButtonActive: {
    background: '#1E2320',
    color: '#F4EFE4',
    borderColor: '#1E2320',
  },
  destinationButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  checkmark: {
    fontSize: '12px',
  },
  contentCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #E4DCC8',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E4DCC8',
  },
  contentBadge: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1E2320',
  },
  formatBadge: {
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#5C7A6B',
    background: '#E4EBE6',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  contentSection: {
    marginBottom: '16px',
  },
  contentPreview: {
    position: 'relative',
    background: '#F4EFE4',
    borderRadius: '6px',
    padding: '12px',
  },
  contentText: {
    fontSize: '13px',
    color: '#3C4A45',
    whiteSpace: 'pre-wrap',
    margin: 0,
    lineHeight: 1.6,
    fontFamily: "'Inter', sans-serif",
  },
  copyBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: 'white',
    border: '1px solid #DCD3BE',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#6B6459',
    cursor: 'pointer',
  },
  copyBtnFull: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: 'white',
    border: '1px solid #DCD3BE',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#6B6459',
    cursor: 'pointer',
    marginTop: '8px',
  },
  threadContainer: {
    background: '#F4EFE4',
    borderRadius: '6px',
    padding: '12px',
  },
  tweetItem: {
    display: 'flex',
    gap: '8px',
    fontSize: '13px',
    color: '#3C4A45',
    padding: '4px 0',
    borderBottom: '1px dashed #E4DCC8',
  },
  tweetNumber: {
    fontWeight: 600,
    color: '#5C7A6B',
    minWidth: '40px',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
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
    padding: '4px 12px',
    borderRadius: '12px',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  listContainer: {
    margin: 0,
    paddingLeft: '20px',
  },
  listItem: {
    fontSize: '13px',
    color: '#4B4640',
    marginBottom: '4px',
    lineHeight: 1.5,
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E4DCC8',
  },
  addCalendarBtn: {
    flex: 1,
    padding: '10px',
    background: '#5C7A6B',
    color: '#F4EFE4',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  copyAllBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: '#F4EFE4',
    color: '#3C4A45',
    border: '1px solid #DCD3BE',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
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

export default RepurposeHub;