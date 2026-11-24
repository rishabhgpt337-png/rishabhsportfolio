/**
 * RISHABH GUPTA — EDITABLE PORTFOLIO CONTENT
 * Update placeholders (WhatsApp number, Roblox details, Video files, Email/LinkedIn) here.
 */
window.PORTFOLIO_CONFIG = {
  personal: {
    name: 'Rishabh Gupta',
    handle: '@rishabhgpt_',
    location: 'Mumbai, India',
    whatsappUrl: 'https://wa.me/COUNTRYCODEPHONENUMBER', // Replace COUNTRYCODEPHONENUMBER with your personal number
    instagramUrl: 'https://instagram.com/rishabhgpt_',
    githubUrl: 'https://github.com/rishabhgpt337-png',
    linkedinUrl: '#', // Optional: replace '#' with your LinkedIn URL
    email: 'hello@rishabhgupta.example' // Optional: replace with your personal email
  },

  projects: {
    luxora: {
      id: 'luxora',
      category: 'Luxury Interior & Space Design · Mumbai',
      title: 'LUXORA',
      summary:
        'Digital presence, brand presentation, and creative social media work for a luxury interior and space design brand in Mumbai.',
      highlights: [
        'Website development and cohesive digital presence',
        'Brand presentation tailored to luxury spatial design',
        'Creative direction and social media content work',
        'Visual identity and refined digital experience'
      ],
      stack: [], // Intentionally left blank — do not invent stack details
      status: 'Live Website',
      liveUrl: 'https://luxorafinale.vercel.app/',
      liveLabel: 'Open Live Project',
      image: 'assets/editorial-01.jpg',
      imageAlt: 'LUXORA luxury interior design digital presentation'
    },

    kourage: {
      id: 'kourage',
      category: 'Client Website · Launched',
      title: 'Kourage Fitness',
      summary:
        'A complete, production-deployed business website built for a real-world fitness client with mobile-first UX and direct WhatsApp enquiry integration.',
      highlights: [
        'Complete end-to-end business website design and development',
        'Mobile-friendly responsive experience across devices',
        'Direct WhatsApp enquiry integration for fast client leads',
        'Production deployment on a custom domain'
      ],
      stack: ['Next.js', 'Vercel'],
      status: 'Launched / Live',
      liveUrl: 'https://kouragefitness.in/',
      liveLabel: 'Visit kouragefitness.in',
      image: 'assets/editorial-02.jpg',
      imageAlt: 'Kourage Fitness live client website showcase'
    },

    roblox: {
      id: 'roblox',
      category: 'Gaming & Interactive Worlds',
      title: 'Roblox & Racing Game',
      summary:
        'Interactive gaming work spanning Roblox experiences and a racing game available on the Google Play Store.',
      editableFields: [
        { label: 'Game Title', value: '[Editable — Add Game Title]' },
        { label: 'My Contribution', value: '[Editable — Add Exact Role & Credits]' },
        { label: 'Platform Links', value: '[Editable — Add Play Store & Roblox URLs]' }
      ],
      highlights: [
        'Roblox-related creative and technical work',
        'Racing game available through the Google Play Store',
        'Gameplay media and visual presentation ready for update'
      ],
      stack: ['Roblox', 'Play Store'],
      status: 'In Showcase (Editable)',
      liveUrl: '', // Add Play Store or Roblox URL when ready
      liveLabel: 'Add Game Link',
      image: 'assets/editorial-03.jpg',
      imageAlt: 'Roblox and racing game visual showcase'
    }
  },

  kuro: {
    name: 'KURO',
    tagline: 'Design & Engineering Studio',
    role: 'Co-Founder & Member',
    url: 'https://kuro-agency-website.vercel.app/',
    description:
      'I co-founded KURO and actively build and grow the studio alongside the team—combining design, engineering, motion, and AI automation for modern businesses.',
    capabilities: [
      'Website development',
      'Digital experiences',
      'AI-powered business automation',
      'Motion design',
      'Creative and engineering solutions'
    ],
    image: 'assets/editorial-05.jpg'
  },

  /**
   * VIDEO & CREATIVE SHOWCASE
   * To add your real videos later:
   * 1. Place .mp4/.webm files in assets/videos/ (e.g., 'assets/videos/reel-01.mp4')
   * 2. Set `videoSrc` to that path and update `title` & `caption`.
   */
  videos: [
    {
      id: 'reel-01',
      format: 'reel',
      formatLabel: 'Vertical Reel · 9:16',
      title: 'Brand Edit — Placeholder 01',
      caption: 'Drop your vertical reel (.mp4) into assets/videos/ and link it in js/data.js.',
      poster: 'assets/editorial-04.jpg',
      videoSrc: ''
    },
    {
      id: 'landscape-01',
      format: 'landscape',
      formatLabel: 'Landscape Film · 16:9',
      title: 'Commercial Cut — Placeholder 01',
      caption: 'Supports widescreen 16:9 edits with hover preview and full modal playback.',
      poster: 'assets/editorial-03.jpg',
      videoSrc: ''
    },
    {
      id: 'reel-02',
      format: 'reel',
      formatLabel: 'Vertical Reel · 9:16',
      title: 'Motion & Social Cut — Placeholder 02',
      caption: 'Ready for short-form social edits, transitions, and sound-synced reels.',
      poster: 'assets/editorial-05.jpg',
      videoSrc: ''
    },
    {
      id: 'landscape-02',
      format: 'landscape',
      formatLabel: 'Landscape Film · 16:9',
      title: 'Creative Direction — Placeholder 02',
      caption: 'Ready for full-frame brand stories, product showcases, or gameplay captures.',
      poster: 'assets/editorial-01.jpg',
      videoSrc: ''
    }
  ]
};
