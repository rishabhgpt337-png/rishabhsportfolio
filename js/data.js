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
      id: 'futuro-avenue',
      format: 'landscape',
      title: 'Luxury House Tour',
      caption: 'Futuro Avenue · Golden-hour aerials and gimbal walkthrough.',
      poster: 'assets/videos/posters/Futuro_Avenue_Luxury_House_Tour_SonyFX6_4K.jpg',
      videoSrc: 'assets/videos/Futuro_Avenue_Luxury_House_Tour_SonyFX6_4K.mp4'
    },
    {
      id: 'varun-mayya-collage',
      format: 'reel',
      title: 'Paper-Collage Kinetic Explainer',
      caption: '100xEngineers · Kinetic typography and hand-drawn elements.',
      poster: 'assets/videos/posters/100xEngineers_Varun_Mayya_PaperCollage_Explainer.jpg',
      videoSrc: 'assets/videos/100xEngineers_Varun_Mayya_PaperCollage_Explainer.mp4'
    },
    {
      id: 'sharan-cupid',
      format: 'reel',
      title: 'Cupid Case Study',
      caption: 'Finance with Sharan · Multi-register visual storytelling.',
      poster: 'assets/videos/posters/Sharan_Hegde_Cupid_CaseStudy_Chart_Reel.jpg',
      videoSrc: 'assets/videos/Sharan_Hegde_Cupid_CaseStudy_Chart_Reel.mp4'
    },
    {
      id: 'sharan-ndtv',
      format: 'reel',
      title: 'NDTV Profit News Feature',
      caption: 'Finance with Sharan · Custom news cards and motion overlays.',
      poster: 'assets/videos/posters/Sharan_Hegde_NDTV_NewsCard_Graphics_Reel.jpg',
      videoSrc: 'assets/videos/Sharan_Hegde_NDTV_NewsCard_Graphics_Reel.mp4'
    },
    {
      id: 'raj-food-broll',
      format: 'reel',
      title: 'Rapid Cutaway Narrative',
      caption: 'Figuring Out · Fast-paced visual cutaways and captions.',
      poster: 'assets/videos/posters/Raj_Shamani_FiguringOut_FoodBRoll_Cutaways_Reel.jpg',
      videoSrc: 'assets/videos/Raj_Shamani_FiguringOut_FoodBRoll_Cutaways_Reel.mp4'
    },
    {
      id: 'raj-titan',
      format: 'reel',
      title: 'Brand Integration Cut',
      caption: 'Figuring Out · Clean pacing and brand end-card transition.',
      poster: 'assets/videos/posters/Raj_Shamani_FiguringOut_Titan_BrandCard_Reel.jpg',
      videoSrc: 'assets/videos/Raj_Shamani_FiguringOut_Titan_BrandCard_Reel.mp4'
    },
    {
      id: 'ali-pill-captions',
      format: 'reel',
      title: 'Comped Asset Storytelling',
      caption: 'Ali Abdaal · Dynamic reframes and layered visual cutouts.',
      poster: 'assets/videos/posters/Ali_Abdaal_CompedAssets_PillCaptions_Reel.jpg',
      videoSrc: 'assets/videos/Ali_Abdaal_CompedAssets_PillCaptions_Reel.mp4'
    },
    {
      id: 'wesmile-showreel',
      format: 'reel',
      title: 'Podcast Motion Showreel',
      caption: 'WeSmile Media · Motion graphics, cutaways, and transitions.',
      poster: 'assets/videos/posters/WeSmile_Media_Podcast_Showreel_BRoll_MotionGraphics.jpg',
      videoSrc: 'assets/videos/WeSmile_Media_Podcast_Showreel_BRoll_MotionGraphics.mp4'
    }
  ]
};
