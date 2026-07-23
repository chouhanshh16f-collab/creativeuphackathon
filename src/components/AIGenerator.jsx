import { useState } from 'react';
import { Wand2, Sparkles, Loader, Copy, Check, X, Youtube } from 'lucide-react';

const AIGenerator = ({ onAddToCalendar, selectedDate, onClose }) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [urlError, setUrlError] = useState('');
  const [idCounter, setIdCounter] = useState(0);

  const contentTypes = [
    { id: 'blog', label: '📝 Blog Post' },
    { id: 'social', label: '📱 Social Media' },
    { id: 'script', label: '🎬 Video Script' },
    { id: 'email', label: '📧 Email Newsletter' },
    { id: 'headline', label: '💡 Headlines' },
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

  // Fetch YouTube video info
  const fetchYoutubeInfo = async (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setUrlError('❌ Invalid YouTube URL. Please check and try again.');
      return null;
    }

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (!response.ok) throw new Error('Failed to fetch video info');
      const data = await response.json();
      return {
        title: data.title,
        author: data.author_name,
        thumbnail: data.thumbnail_url,
        videoId: videoId,
      };
    } catch (error) {
      console.error('Error fetching video info:', error);
      setUrlError('❌ Could not fetch video info. Please try again.');
      return null;
    }
  };

  const generateContent = async () => {
    if (!topic.trim()) {
      setUrlError('❌ Please enter a topic or YouTube URL');
      return;
    }

    setLoading(true);
    setUrlError('');
    setVideoInfo(null);
    try {
      let finalTopic = topic.trim();
      let videoData = null;

      // Check if it's a YouTube URL
      if (topic.includes('youtube.com') || topic.includes('youtu.be')) {
        videoData = await fetchYoutubeInfo(topic);
        if (videoData) {
          finalTopic = videoData.title;
          setVideoInfo(videoData);
        } else {
          setLoading(false);
          return;
        }
      }

      // Simulate AI generation - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generatedContent = generatePlatformContent(finalTopic, videoData);
      setGenerated(generatedContent);

    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlatformContent = (topic, videoData) => {
    const cleanTopic = topic.replace(/^["']|["']$/g, '').trim();
    const shortTopic = cleanTopic.length > 50 ? cleanTopic.substring(0, 50) + '...' : cleanTopic;

    // Platform-specific content
    return {
      title: cleanTopic,
      platforms: {
        // Instagram - Visual, engaging, emoji-heavy
        instagram: {
          caption: `📌 ${cleanTopic}\n\nHere's what I learned from this:\n\n💡 Key Insight 1\n✨ Key Insight 2\n🔥 Key Insight 3\n\nWhat's your biggest takeaway? 👇\n\n#ContentCreator #LearnOnInstagram #ValueContent #GrowthMindset`,
          hashtags: ['#ContentCreator', '#LearnOnInstagram', '#ValueContent', '#GrowthMindset', '#CreatorCommunity'],
          format: 'Carousel Post',
          slides: [
            `Slide 1: Hook - "3 things I learned from ${shortTopic}"`,
            `Slide 2: Key insight #1 with visual example`,
            `Slide 3: Key insight #2 with personal take`,
            `Slide 4: Key insight #3 and why it matters`,
            `Slide 5: CTA - "Save this and share your thoughts!"`
          ],
          tone: '🎨 Visual & Engaging',
        },

        // TikTok - Fast-paced, trending, hook-driven
        tiktok: {
          script: `🎬 ${cleanTopic} - Here's why this matters!\n\n⚡️ Quick breakdown:\n\n🔹 0-3s: The hook that grabs attention\n🔹 3-10s: Why this topic is relevant\n🔹 10-20s: 3 key takeaways\n🔹 20-25s: Personal reaction\n🔹 25-30s: CTA - "Save & follow for more!"\n\n#TikTokTips #ContentCreator #Viral #LearnOnTikTok`,
          hashtags: ['#TikTokTips', '#ContentCreator', '#Viral', '#LearnOnTikTok', '#CreatorCommunity'],
          format: 'TikTok/Reel',
          visualIdeas: [
            '🎥 Hook: React to the content with a surprised face',
            '🎥 Text overlay: Key quote or statistic',
            '🎥 Screen recording: Show the most impactful moment',
            '🎥 Final shot: Your reaction and CTA'
          ],
          tone: '⚡ Fast & Trendy',
        },

        // Twitter/X - Thread-based, concise, punchy
        twitter: {
          thread: [
            `🧵 ${cleanTopic} - Here's what I learned 🧵`,
            `1/${Math.floor(Math.random() * 3) + 6} This topic completely changed my perspective...`,
            `2/${Math.floor(Math.random() * 3) + 6} Here's why it matters: [Key insight 1]`,
            `3/${Math.floor(Math.random() * 3) + 6} The example that made it click: [Example]`,
            `4/${Math.floor(Math.random() * 3) + 6} Another key takeaway: [Key insight 2]`,
            `5/${Math.floor(Math.random() * 3) + 6} How this applies to you: [Application]`,
            `6/${Math.floor(Math.random() * 3) + 6} My biggest takeaway from this is...`,
            `7/${Math.floor(Math.random() * 3) + 6} What do you think? Drop your thoughts below! 👇`
          ],
          hashtags: ['#ContentCreator', '#LearnOnTwitter', '#ValueContent', '#CreatorEconomy'],
          format: 'Thread',
          tone: '📝 Punchy & Concise',
        },

        // LinkedIn - Professional, thought leadership
        linkedin: {
          post: `${cleanTopic}\n\nI've been thinking deeply about this topic lately.\n\nHere are my key takeaways:\n\n1️⃣ [Key Insight 1]\n2️⃣ [Key Insight 2]\n3️⃣ [Key Insight 3]\n\nWhat's your perspective? I'd love to hear your thoughts in the comments! 👇\n\n#ProfessionalGrowth #Leadership #ContentStrategy #CareerDevelopment`,
          hashtags: ['#ProfessionalGrowth', '#Leadership', '#ContentStrategy', '#CareerDevelopment', '#LinkedInTips'],
          format: 'Post',
          tone: '💼 Professional & Thoughtful',
        },

        // Blog - Comprehensive, SEO-friendly
        blog: {
          title: `Complete Guide: ${cleanTopic}`,
          intro: `In this comprehensive guide, we'll explore ${cleanTopic} and why it's become such an important topic...`,
          sections: [
            { heading: 'Why This Matters', content: 'Content about why this topic is relevant in today\'s context...' },
            { heading: 'Key Insights', content: 'The most important points you need to know about this topic...' },
            { heading: 'Practical Applications', content: 'How you can apply these insights to your own work...' },
            { heading: 'Next Steps', content: 'Actionable steps to implement what you\'ve learned...' },
          ],
          conclusion: 'In conclusion, understanding this topic is crucial for...',
          format: 'Blog Post',
          tone: '📄 Comprehensive & Detailed',
        },

        // Newsletter - Email-friendly, personal
        newsletter: {
          subject: cleanTopic,
          preview: `This week: ${shortTopic}`,
          body: `Hello everyone! 👋\n\nI wanted to share something important with you today about ${cleanTopic}.\n\n🔹 Introduction to the topic\n🔹 Why I'm excited about this\n🔹 3 key things you should know\n🔹 How this applies to you\n\nI'd love to hear your thoughts! Reply to this email and let me know what you think.\n\nUntil next time,\n[Your Name]`,
          cta: 'Reply with your thoughts!',
          format: 'Newsletter',
          tone: '✉️ Personal & Warm',
        }
      },
      // YouTube info if available
      videoData: videoData,
    };
  };


  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
  };

  const addToCalendar = (platform) => {
    if (!generated) return;
    const content = generated.platforms[platform];
    if (!content) return;

    const date = selectedDate || new Date();
    setIdCounter(prev => prev + 1);
    const item = {
      id: `ai-${idCounter + 1}`,
      date: date.toISOString().split('T')[0],
      platform: platform,
      title: generated.title.substring(0, 50),
      format: content.format || 'Post',
      status: 'draft',
      caption: content.caption || content.script || content.post || content.thread?.join('\n') || '',
      hashtags: content.hashtags?.join(' ') || '',
      aiGenerated: true,
      source: 'AI Generator',
    };
    onAddToCalendar(item);
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
        <div style={styles.urlInputGroup}>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setUrlError('');
            }}
            placeholder="e.g., sustainable living tips, or paste a YouTube URL..."
            style={{ ...styles.input, ...(urlError ? styles.inputError : {}) }}
            onKeyDown={(e) => e.key === 'Enter' && generateContent()}
          />
        </div>
        {urlError && <div style={styles.errorText}>{urlError}</div>}
      </div>

      {/* YouTube Video Info Display */}
      {videoInfo && (
        <div style={styles.videoPreview}>
          <div style={styles.videoInfo}>
            <Youtube size={20} color="#FF0000" />
            <span style={styles.videoTitle}>{videoInfo.title}</span>
            <span style={styles.videoAuthor}>by {videoInfo.author}</span>
          </div>
        </div>
      )}

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
            <span style={styles.resultTitle}>{generated.title}</span>
          </div>

          {/* Platform Tabs */}
          <div style={styles.platformTabs}>
            {['instagram', 'tiktok', 'twitter', 'linkedin', 'blog', 'newsletter'].map(platform => {
              const labels = {
                instagram: '📱 Instagram',
                tiktok: '🎵 TikTok',
                twitter: '🐦 Twitter/X',
                linkedin: '💼 LinkedIn',
                blog: '📄 Blog',
                newsletter: '✉️ Newsletter'
              };
              const hasContent = generated.platforms && generated.platforms[platform];
              return (
                <button
                  key={platform}
                  onClick={() => setGenerated({ ...generated, selectedPlatform: platform })}
                  style={{
                    ...styles.platformTab,
                    ...(generated.selectedPlatform === platform ? styles.platformTabActive : {}),
                    ...(!hasContent ? styles.platformTabDisabled : {}),
                  }}
                >
                  {labels[platform]}
                  {generated.selectedPlatform === platform && <span style={styles.activeIndicator} />}
                </button>
              );
            })}
          </div>

          {/* Platform-specific content display */}
          {generated.selectedPlatform && generated.platforms && generated.platforms[generated.selectedPlatform] && (
            <div style={styles.contentCard}>
              {(() => {
                const platform = generated.selectedPlatform;
                const content = generated.platforms[platform];
                const labels = {
                  instagram: '📱 Instagram Post',
                  tiktok: '🎵 TikTok Script',
                  twitter: '🐦 Twitter Thread',
                  linkedin: '💼 LinkedIn Post',
                  blog: '📄 Blog Post',
                  newsletter: '✉️ Newsletter'
                };

                return (
                  <>
                    <div style={styles.contentHeader}>
                      <span style={styles.contentBadge}>{labels[platform]}</span>
                      <span style={styles.toneBadge}>🎯 {content.tone}</span>
                      <span style={styles.formatBadge}>{content.format}</span>
                    </div>

                    {/* Twitter Thread */}
                    {platform === 'twitter' && content.thread ? (
                      <div style={styles.contentSection}>
                        <label style={styles.sectionLabel}>🧵 Thread</label>
                        <div style={styles.threadContainer}>
                          {content.thread.map((tweet, i) => (
                            <div key={i} style={styles.tweetItem}>
                              <span style={styles.tweetNumber}>{i + 1}/{content.thread.length}</span>
                              <span>{tweet}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => copyToClipboard(content.thread.join('\n\n'), 'twitter')}
                          style={styles.copyBtnFull}
                        >
                          {copied.twitter ? <Check size={14} /> : <Copy size={14} />}
                          {copied.twitter ? 'Copied!' : 'Copy Thread'}
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Caption / Script / Post */}
                        <div style={styles.contentSection}>
                          <label style={styles.sectionLabel}>
                            {platform === 'tiktok' ? '🎬 Script' :
                              platform === 'linkedin' ? '📝 Post' :
                                platform === 'blog' ? '📄 Content' :
                                  platform === 'newsletter' ? '✉️ Content' :
                                    '📝 Caption'}
                          </label>
                          <div style={styles.contentPreview}>
                            <pre style={styles.contentText}>
                              {content.caption || content.script || content.post || content.body || 'Content not available'}
                            </pre>
                            <button
                              onClick={() => {
                                const text = content.caption || content.script || content.post || content.body || '';
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
                        {content.hashtags && (
                          <div style={styles.contentSection}>
                            <label style={styles.sectionLabel}>🏷️ Hashtags</label>
                            <div style={styles.hashtagContainer}>
                              {content.hashtags.map((tag, i) => (
                                <span key={i} style={styles.hashtagChip}>#{tag}</span>
                              ))}
                            </div>
                            <button
                              onClick={() => copyToClipboard(content.hashtags.join(' '), 'hashtags')}
                              style={styles.copyBtnSmall}
                            >
                              {copied.hashtags ? <Check size={12} /> : <Copy size={12} />}
                              {copied.hashtags ? 'Copied!' : 'Copy Hashtags'}
                            </button>
                          </div>
                        )}

                        {/* Visual Ideas */}
                        {content.visualIdeas && (
                          <div style={styles.contentSection}>
                            <label style={styles.sectionLabel}>🎥 Visual Ideas</label>
                            <ul style={styles.listContainer}>
                              {content.visualIdeas.map((idea, i) => (
                                <li key={i} style={styles.listItem}>{idea}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Carousel Slides */}
                        {content.slides && (
                          <div style={styles.contentSection}>
                            <label style={styles.sectionLabel}>🖼️ Carousel Slides</label>
                            <ul style={styles.listContainer}>
                              {content.slides.map((slide, i) => (
                                <li key={i} style={styles.listItem}>{slide}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Blog Sections */}
                        {content.sections && (
                          <div style={styles.contentSection}>
                            <label style={styles.sectionLabel}>📝 Blog Outline</label>
                            <div style={styles.blogOutline}>
                              {content.sections.map((section, i) => (
                                <div key={i}>
                                  <h5>{section.heading}</h5>
                                  <p>{section.content}</p>
                                </div>
                              ))}
                              <p><strong>Conclusion:</strong> {content.conclusion}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => addToCalendar(platform)}
                        style={styles.addCalendarBtn}
                      >
                        📅 Add to Calendar
                      </button>
                      <button
                        onClick={() => {
                          const content = generated.platforms[platform];
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
                  </>
                );
              })()}
            </div>
          )}
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
  // Platform Tabs
platformTabs: {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #E4DCC8',
},
platformTab: {
  padding: '6px 14px',
  borderRadius: '6px',
  border: '1px solid #DCD3BE',
  background: 'transparent',
  fontSize: '12px',
  color: '#6B6459',
  cursor: 'pointer',
  transition: 'all 0.2s',
  position: 'relative',
},
platformTabActive: {
  background: '#1E2320',
  color: '#F4EFE4',
  borderColor: '#1E2320',
},
platformTabDisabled: {
  opacity: 0.4,
  cursor: 'not-allowed',
},
activeIndicator: {
  position: 'absolute',
  bottom: '-13px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '20px',
  height: '2px',
  background: '#5C7A6B',
  borderRadius: '1px',
},
contentCard: {
  background: 'white',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #E4DCC8',
},
contentHeader: {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginBottom: '12px',
  paddingBottom: '10px',
  borderBottom: '1px solid #E4DCC8',
  flexWrap: 'wrap',
},
contentBadge: {
  fontSize: '13px',
  fontWeight: 600,
  color: '#1E2320',
},
toneBadge: {
  fontSize: '11px',
  color: '#5C7A6B',
  background: '#E4EBE6',
  padding: '2px 10px',
  borderRadius: '12px',
},
contentSection: {
  marginBottom: '14px',
},
sectionLabel: {
  display: 'block',
  fontSize: '10px',
  fontFamily: "'IBM Plex Mono', monospace",
  color: '#9AA79C',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
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
copyBtnSmall: {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 10px',
  background: 'white',
  border: '1px solid #DCD3BE',
  borderRadius: '4px',
  fontSize: '11px',
  color: '#6B6459',
  cursor: 'pointer',
  marginTop: '6px',
},
copyBtnFull: {
  display: 'inline-flex',
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
blogOutline: {
  background: '#F4EFE4',
  borderRadius: '6px',
  padding: '12px',
  '& h5': {
    fontSize: '14px',
    color: '#3C4A45',
    margin: '12px 0 4px',
    fontWeight: 600,
  },
  '& p': {
    fontSize: '13px',
    color: '#4B4640',
    margin: '4px 0',
    lineHeight: 1.6,
  },
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
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

export default AIGenerator;