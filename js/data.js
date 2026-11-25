/**
 * RISHABH GUPTA — EDITABLE PORTFOLIO CONTENT
 * Update placeholders (WhatsApp number, Roblox details, Video files, Email/LinkedIn) here.
 */
window.PORTFOLIO_CONFIG = {
  personal: {
    name: 'Rishabh Gupta',
    handle: '@rishabhgpt_',
    location: 'Mumbai, India',
    whatsappUrl: 'https://wa.me/COUNTRYCODEPHONENUMBER',
    instagramUrl: 'https://instagram.com/rishabhgpt_',
    githubUrl: 'https://github.com/rishabhgpt337-png',
    linkedinUrl: '#',
    email: 'hello@rishabhgupta.example'
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
      stack: [],
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

  videos: [
    {
      id: 'varun-mayya-collage',
      format: 'reel',
      formatLabel: 'Talking Head Reel · 9:16',
      title: 'Paper-Collage Kinetic Type Explainer',
      caption: '100xEngineers (Varun Mayya). Paper-collage typography, hand-drawn cursor, and censor-bar reveals.',
      videoSrc: 'assets/videos/100xEngineers_Varun_Mayya_PaperCollage_Explainer.mp4'
    },
    {
      id: 'sharan-cupid',
      format: 'reel',
      formatLabel: 'Talking Head Reel · 9:16',
      title: 'Cupid Case Study & Sourced Chart',
      caption: 'Finance with Sharan. Four b-roll registers cut against studio head with editorial bar charts.',
      videoSrc: 'assets/videos/Sharan_Hegde_Cupid_CaseStudy_Chart_Reel.mp4'
    },
    {
      id: 'sharan-ndtv',
      format: 'reel',
      formatLabel: 'Talking Head Reel · 9:16',
      title: 'NDTV Profit News Card & Kinetic Title',
      caption: 'Finance with Sharan. Custom news card graphics, gold lower-third, and greenscreen compositing.',
      videoSrc: 'assets/videos/Sharan_Hegde_NDTV_NewsCard_Graphics_Reel.mp4'
    },
    {
      id: 'raj-food-broll',
      format: 'reel',
      formatLabel: 'Talking Head Reel · 9:16',
      title: 'Cutaway-Per-Sentence & Keyword Captions',
      caption: 'Figuring Out (Raj Shamani). Rapid b-roll cutaways paired with colour-accented captions.',
      videoSrc: 'assets/videos/Raj_Shamani_FiguringOut_FoodBRoll_Cutaways_Reel.mp4'
    },
    {
      id: 'raj-titan',
      format: 'reel',
      formatLabel: 'Talking Head Reel · 9:16',
      title: 'Sponsored Segment Pacing & Brand Card',
      caption: 'Figuring Out (Raj Shamani). Tight caption consistency and hard cut to black-and-gold end card.',
      videoSrc: 'assets/videos/Raj_Shamani_FiguringOut_Titan_BrandCard_Reel.mp4'
    },
    {
      id: 'ali-pill-captions',
      format: 'reel',
      formatLabel: 'International Reel · 9:16',
      title: 'Talking Head with Comped Assets',
      caption: 'Ali Abdaal. Punch-in reframes every 1.1s with pill captions and cut-out PNG props.',
      videoSrc: 'assets/videos/Ali_Abdaal_CompedAssets_PillCaptions_Reel.mp4'
    },
    {
      id: 'futuro-avenue',
      format: 'landscape',
      formatLabel: 'Real Estate Film · 16:9',
      title: 'Luxury House Tour (Sony FX6)',
      caption: 'Futuro Avenue. Golden-hour drone opener, gimbal doorway walkthroughs, and warm grading.',
      videoSrc: 'assets/videos/Futuro_Avenue_Luxury_House_Tour_SonyFX6_4K.mp4'
    },
    {
      id: 'wesmile-showreel',
      format: 'reel',
      formatLabel: 'Podcast Edit · 9:16',
      title: 'Podcast-Edit Showreel (B-Roll & Motion)',
      caption: 'WeSmile Media. B-roll cutaways, chromatic transitions, kinetic type, and stat badges.',
      videoSrc: 'assets/videos/WeSmile_Media_Podcast_Showreel_BRoll_MotionGraphics.mp4'
    }
  ]
};
