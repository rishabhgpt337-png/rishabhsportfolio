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
        'Website, brand presentation, and social media work for LUXORA, a luxury interior and space design studio in Mumbai.',
      highlights: [
        'Website development and digital presence',
        'Brand presentation for luxury interior design',
        'Creative direction and social media content',
        'Visual identity'
      ],
      stack: [], // Intentionally left blank — do not invent stack details
      status: 'Live Website',
      liveUrl: 'https://luxorafinale.vercel.app/',
      liveLabel: 'Open Live Project',
      image: 'assets/editorial-01.jpg',
      imageAlt: 'LUXORA luxury interior design website'
    },

    kourage: {
      id: 'kourage',
      category: 'Client Website · Live',
      title: 'Kourage Fitness',
      summary:
        'Live business website for Kourage Fitness, built with Next.js on a custom domain with mobile layouts and direct WhatsApp enquiries.',
      highlights: [
        'Full website design and build',
        'Responsive mobile layout',
        'Direct WhatsApp enquiry button',
        'Live on kouragefitness.in via Vercel'
      ],
      stack: ['Next.js', 'Vercel'],
      status: 'Launched / Live',
      liveUrl: 'https://kouragefitness.in/',
      liveLabel: 'Visit kouragefitness.in',
      image: 'assets/editorial-02.jpg',
      imageAlt: 'Kourage Fitness live client website'
    },

    roblox: {
      id: 'roblox',
      category: 'Gaming · Editable Showcase',
      title: 'Roblox & Racing Game',
      summary:
        'Roblox projects and a racing game on the Google Play Store. Game title, credits, and store links can be updated in js/data.js.',
      editableFields: [
        { label: 'Game Title', value: '[Editable: Add Game Title]' },
        { label: 'My Contribution', value: '[Editable: Add Exact Role & Credits]' },
        { label: 'Platform Links', value: '[Editable: Add Play Store & Roblox URLs]' }
      ],
      highlights: [
        'Roblox work',
        'Racing game on the Google Play Store',
        'Ready for gameplay clips and store links'
      ],
      stack: ['Roblox', 'Play Store'],
      status: 'Editable',
      liveUrl: '',
      liveLabel: 'Add Game Link',
      image: 'assets/editorial-03.jpg',
      imageAlt: 'Roblox and racing game showcase'
    }
  },

  kuro: {
    name: 'KURO',
    tagline: 'Design & Engineering Studio',
    role: 'Co-Founder & Member',
    url: 'https://kuro-agency-website.vercel.app/',
    description:
      'I co-founded KURO with the team. We build websites, digital experiences, motion design, and AI automation.',
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
   * Add your .mp4/.webm paths in `videoSrc` when ready.
   */
  videos: [
    {
      id: 'reel-01',
      format: 'reel',
      formatLabel: 'Vertical Reel · 9:16',
      title: 'Vertical Reel 01',
      caption: 'Add your .mp4 file path in js/data.js to play this reel.',
      poster: 'assets/editorial-04.jpg',
      videoSrc: ''
    },
    {
      id: 'landscape-01',
      format: 'landscape',
      formatLabel: 'Landscape Video · 16:9',
      title: 'Landscape Video 01',
      caption: 'Add your .mp4 file path in js/data.js to play this video.',
      poster: 'assets/editorial-03.jpg',
      videoSrc: ''
    },
    {
      id: 'reel-02',
      format: 'reel',
      formatLabel: 'Vertical Reel · 9:16',
      title: 'Vertical Reel 02',
      caption: 'Add your .mp4 file path in js/data.js to play this reel.',
      poster: 'assets/editorial-05.jpg',
      videoSrc: ''
    },
    {
      id: 'landscape-02',
      format: 'landscape',
      formatLabel: 'Landscape Video · 16:9',
      title: 'Landscape Video 02',
      caption: 'Add your .mp4 file path in js/data.js to play this video.',
      poster: 'assets/editorial-01.jpg',
      videoSrc: ''
    }
  ]
};
