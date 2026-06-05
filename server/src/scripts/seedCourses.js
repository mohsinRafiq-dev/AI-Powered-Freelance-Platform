import mongoose from 'mongoose';
import Course from '../models/Course.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// ─── COURSE DATA ────────────────────────────────────────────────────────────
// Note: all lesson content uses single-quoted strings to avoid
// JS template-literal interpolation conflicts with code examples.

const courses = [
  // ── 1. Full-Stack Web Development ─────────────────────────────────────────
  {
    title: 'Full-Stack Web Development Bootcamp',
    slug: 'fullstack-web-development-bootcamp',
    description: 'Master HTML, CSS, JavaScript, React and Node.js from zero to deployment. Build 3 real-world projects, earn a verified certificate, and land your first freelance client.',
    category: 'web-development',
    level: 'beginner',
    skills: ['html', 'css', 'javascript', 'react', 'node.js', 'mongodb'],
    estimatedHours: 14,
    certificateTitle: 'Certified Full-Stack Web Developer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
    isPublished: true,
    lessons: [
      {
        title: 'HTML5 — The Skeleton of the Web',
        content: 'HTML (HyperText Markup Language) is the foundation of every website. It provides structure and meaning to content.\n\nCORE CONCEPTS\n\n1. Document Structure\nEvery HTML page follows this skeleton:\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Website</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>\n\n2. Semantic HTML5 Elements\nUse semantic tags to give meaning to your content:\n- <header> — top of the page / logo / nav\n- <nav> — navigation links\n- <main> — primary page content\n- <section> — thematic grouping\n- <article> — independent content (blog post, product card)\n- <aside> — sidebar / supplementary content\n- <footer> — bottom of the page\n\n3. Forms\n<form action="/submit" method="POST">\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n  <button type="submit">Submit</button>\n</form>\n\nPRACTICE TASK\nBuild a personal portfolio page with: a header with your name, a nav with 3 links, a section about yourself, a section listing your skills, and a footer with contact info.',
        durationMinutes: 45,
        order: 1,
      },
      {
        title: 'CSS3 & Tailwind — Making Things Beautiful',
        content: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML. Modern developers use utility-first frameworks like Tailwind CSS for speed.\n\nCORE CSS CONCEPTS\n\n1. The Box Model\nEvery HTML element is a box with:\n- Content — the actual text or image\n- Padding — space inside the border\n- Border — the edge of the element\n- Margin — space outside the border\n\n2. Flexbox (most used layout system)\n.container {\n  display: flex;\n  justify-content: space-between;  /* horizontal alignment */\n  align-items: center;             /* vertical alignment */\n  gap: 16px;\n}\n\n3. CSS Grid\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n\n4. Responsive Design\n/* Mobile first */\n.card { width: 100%; }\n\n/* Tablet and above */\n@media (min-width: 768px) {\n  .card { width: 50%; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .card { width: 33.333%; }\n}\n\nTAILWIND CSS QUICK-START\nInstead of writing CSS files, apply utility classes directly:\n<div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">\n  <h2 class="text-xl font-bold text-gray-900">Job Title</h2>\n  <span class="text-sm text-green-600 font-medium">Open</span>\n</div>\n\nPRACTICE TASK\nStyle your portfolio page: add colors, typography, a responsive 2-column layout for skills, and a hover effect on navigation links.',
        durationMinutes: 60,
        order: 2,
      },
      {
        title: 'JavaScript ES6+ — Making Pages Interactive',
        content: 'JavaScript is the programming language of the web. ES6+ brought major improvements that every modern developer uses.\n\nCRITICAL CONCEPTS\n\n1. Variables\nconst name = "Ahmed";       // cannot be reassigned\nlet count = 0;              // can be reassigned\n// Avoid var in modern code\n\n2. Arrow Functions\nconst greet = (name) => "Hello, " + name + "!";\nconst add = (a, b) => a + b;\n\n3. Destructuring\nconst { title, budget } = job;       // object destructuring\nconst [first, ...rest] = skills;     // array destructuring\n\n4. Spread Operator\nconst newJob = { ...existingJob, status: "open" };\n\n5. Async/Await — Fetching Data from APIs\nconst fetchJobs = async () => {\n  try {\n    const response = await fetch("/api/jobs");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Failed to fetch jobs:", error);\n  }\n};\n\n6. DOM Manipulation\nconst button = document.querySelector("#applyBtn");\nbutton.addEventListener("click", () => {\n  document.querySelector("#modal").classList.remove("hidden");\n});\n\n7. Array Methods (used constantly in React)\nconst openJobs = jobs.filter(job => job.status === "open");\nconst titles = jobs.map(job => job.title);\nconst total = jobs.reduce((sum, job) => sum + job.budget, 0);\n\nPRACTICE TASK\nFetch data from a public API (e.g. jsonplaceholder.typicode.com), display the results in your HTML page, and add a search filter that updates the displayed list in real-time.',
        durationMinutes: 75,
        order: 3,
      },
      {
        title: 'React.js — Building Modern UIs',
        content: 'React is a JavaScript library for building user interfaces using reusable components. It is the most popular front-end framework used by Facebook, Airbnb, and thousands of companies.\n\nCORE CONCEPTS\n\n1. Components and JSX\nfunction JobCard({ job }) {\n  return (\n    <div className="p-4 border rounded-lg">\n      <h3>{job.title}</h3>\n      <p>{job.description}</p>\n      <span>Budget: PKR {job.budget}</span>\n    </div>\n  );\n}\n\n2. State with useState\nimport { useState } from "react";\n\nfunction SearchBar() {\n  const [query, setQuery] = useState("");\n\n  return (\n    <input\n      value={query}\n      onChange={(e) => setQuery(e.target.value)}\n      placeholder="Search jobs..."\n    />\n  );\n}\n\n3. Side Effects with useEffect\nimport { useState, useEffect } from "react";\n\nfunction JobList() {\n  const [jobs, setJobs] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch("/api/jobs")\n      .then(res => res.json())\n      .then(data => {\n        setJobs(data);\n        setLoading(false);\n      });\n  }, []); // empty array = run once on mount\n\n  if (loading) return <p>Loading...</p>;\n  return <div>{jobs.map(job => <JobCard key={job._id} job={job} />)}</div>;\n}\n\n4. React Router for Navigation\nimport { BrowserRouter, Routes, Route, Link } from "react-router-dom";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to="/">Home</Link>\n        <Link to="/jobs">Jobs</Link>\n      </nav>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/jobs" element={<JobList />} />\n        <Route path="/jobs/:id" element={<JobDetails />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\nPRACTICE TASK\nBuild a job board app with React: a list page showing all jobs, a detail page for each job, and a search/filter bar that filters by category.',
        durationMinutes: 90,
        order: 4,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 30,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Links', 'Hyper Transfer Markup Language'],
          correctIndex: 0,
          explanation: 'HTML stands for HyperText Markup Language. It is the standard language for structuring web pages.',
        },
        {
          question: 'Which CSS property creates a flexible row/column layout?',
          options: ['position: flex', 'display: flex', 'layout: flex', 'align: flex'],
          correctIndex: 1,
          explanation: '"display: flex" activates Flexbox layout on a container element.',
        },
        {
          question: 'Which keyword declares a variable that CANNOT be reassigned?',
          options: ['var', 'let', 'const', 'fixed'],
          correctIndex: 2,
          explanation: '"const" declares a block-scoped variable that cannot be reassigned after declaration.',
        },
        {
          question: 'Which React hook manages component state?',
          options: ['useEffect', 'useContext', 'useState', 'useRef'],
          correctIndex: 2,
          explanation: 'useState is the primary React hook for managing local component state.',
        },
        {
          question: 'What does the empty dependency array [] in useEffect mean?',
          options: ['Run on every render', 'Run only once when component mounts', 'Never run', 'Run when component unmounts'],
          correctIndex: 1,
          explanation: 'An empty dependency array causes useEffect to run only once after the initial render.',
        },
      ],
    },
  },

  // ── 2. UI/UX Design ────────────────────────────────────────────────────────
  {
    title: 'UI/UX Design: From Wireframe to Prototype',
    slug: 'uiux-design-wireframe-to-prototype',
    description: 'Learn the complete UI/UX design process used at top tech companies. Master Figma, design principles, user research, and create a professional case study for your portfolio.',
    category: 'design',
    level: 'beginner',
    skills: ['figma', 'ui design', 'ux design', 'wireframing', 'prototyping', 'user research'],
    estimatedHours: 8,
    certificateTitle: 'Certified UI/UX Designer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    isPublished: true,
    lessons: [
      {
        title: 'Design Fundamentals and Visual Hierarchy',
        content: 'Great design solves real problems while being visually appealing. Before touching any design tool, you need to understand the foundational principles.\n\nTHE 5 CORE DESIGN PRINCIPLES\n\n1. Contrast\nMake important elements stand out from less important ones.\n- Use dark text on light backgrounds (minimum 4.5:1 ratio for accessibility)\n- High-contrast CTAs (Call-to-Action buttons) get more clicks\n- Example: White button on blue background = high contrast = more clicks\n\n2. Alignment\nEvery element should have a visual connection to something else on the page.\n- Use a grid system (8px or 12-column)\n- Left-align text blocks for readability\n- Center-align short headlines only\n\n3. Repetition (Consistency)\nRepeat visual styles throughout the design to create cohesion.\n- Same button style everywhere\n- Consistent font sizes (define a type scale: 12, 14, 16, 20, 24, 32, 48px)\n- Same color palette throughout\n\n4. Proximity\nGroup related items together. Separate unrelated items.\n- Navigation links should be close together\n- Form label should be close to its input field\n- White space between unrelated sections\n\n5. White Space (Negative Space)\nDo NOT fill every pixel. White space creates elegance and focus.\n- Apple, Google, Stripe all use generous white space\n- Padding: at minimum 24px inside containers\n- Margin between sections: 64-96px\n\nCOLOR THEORY\nPrimary palette: Maximum 3 colors\n- Brand color (e.g. #4F46E5 indigo)\n- Neutral (e.g. #1F2937 dark gray for text)\n- Semantic colors: green (success), red (error), yellow (warning), blue (info)\n\nPsychology of colors:\n- Blue: Trust, professionalism (LinkedIn, Facebook, PayPal)\n- Green: Growth, money, health (Spotify, WhatsApp, Cash App)\n- Red: Urgency, passion (YouTube, Netflix, Coca-Cola)\n- Purple: Luxury, creativity (Cadbury, Hallmark)\n\nPRACTICE TASK\nAnalyze 3 websites you use daily. Identify how each uses the 5 design principles. Write a 1-paragraph critique for each.',
        durationMinutes: 50,
        order: 1,
      },
      {
        title: 'Typography, Grids and Design Systems',
        content: 'Typography makes up 95% of web design. Mastering it separates amateur designs from professional ones.\n\nTYPOGRAPHY FUNDAMENTALS\n\nFont Categories:\n- Serif (Times New Roman, Georgia) — traditional, formal, editorial\n- Sans-serif (Inter, Poppins, DM Sans) — modern, clean, digital\n- Monospace (Fira Code, JetBrains Mono) — code, technical content\n\nType Scale (use consistently throughout your design):\n- Display: 48-72px — hero headlines\n- H1: 36-40px — page titles\n- H2: 28-32px — section headers\n- H3: 22-24px — card titles\n- Body: 16px — standard text\n- Small: 14px — labels, captions\n- Caption: 12px — fine print\n\nReadability rules:\n- Line height: 1.5x font size for body text (16px font = 24px line height)\n- Max line length: 65-75 characters per line\n- Letter spacing: +0.5-1% for headings\n- Never use pure black (#000000) for text — use #1F2937 or #111827\n\nBest font pairings (free on Google Fonts):\n- Inter + Merriweather\n- DM Sans + DM Serif Display\n- Poppins + Playfair Display\n\nTHE 8-POINT GRID SYSTEM\nAll spacing uses multiples of 8:\n- 8px — tight spacing (between icon and label)\n- 16px — default padding inside components\n- 24px — section padding\n- 32px — spacing between components\n- 48px — spacing between sections\n- 64px — large section gaps\n\nDESIGN SYSTEM BASICS\nA design system is a library of reusable components with consistent styles.\nComponents to define first:\n1. Colors (primary, secondary, grays, semantic)\n2. Typography scale\n3. Spacing scale (8pt grid)\n4. Button variants (primary, secondary, ghost, destructive)\n5. Form inputs\n6. Cards\n7. Navigation\n\nPRACTICE TASK\nIn Figma, create a simple design system with: a color palette, a type scale, 3 button variants, and an input field with label and error state.',
        durationMinutes: 55,
        order: 2,
      },
      {
        title: 'User Research and Wireframing',
        content: 'Design without research is just art. UX design must be grounded in understanding real user needs.\n\nUSER RESEARCH METHODS\n\n1. User Interviews\n- Talk to 5-8 potential users\n- Ask open-ended questions ("Tell me about the last time you...")\n- Never ask leading questions ("Would you use this feature?" — they always say yes)\n- Record key quotes and pain points\n\n2. User Personas\nCreate 2-3 fictional users based on research:\n---\nPersona: Ahmed, 28, Freelance Developer\nGoal: Find quality clients quickly\nFrustration: Too many low-budget clients, hard to filter\nTech comfort: High\n---\n\n3. User Journey Mapping\nMap the full experience from awareness to completion:\nAwareness → Registration → Browse Jobs → Submit Proposal → Get Hired → Complete Project → Get Paid\n\nAt each step, note: what they do, think, and feel.\n\nWIREFRAMING PROCESS\n\nStep 1: Crazy 8s (8 minutes)\n- Fold paper into 8 sections\n- Sketch 8 different layout ideas in 8 minutes\n- Do not judge, just generate ideas\n\nStep 2: Low-fidelity wireframes (paper or Figma)\n- Use boxes and lines, no colors\n- Focus on layout and content hierarchy\n- Show which elements are most important\n\nStep 3: Mid-fidelity wireframes (Figma)\n- Add real text and placeholder images\n- Define interaction patterns\n- Get feedback from 3-5 users\n\nStep 4: High-fidelity mockups\n- Apply your design system\n- Add real images, colors, and typography\n- Pixel-perfect spacing\n\nStep 5: Interactive prototype\n- Connect screens with Figma interactions\n- Test with real users (usability testing)\n\nPRACTICE TASK\nDesign the onboarding flow for a freelance marketplace. Create 5 screens: landing page, registration, role selection (client/freelancer), profile setup, and dashboard. Start with paper sketches, then build in Figma.',
        durationMinutes: 65,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'Which design principle groups related elements together?',
          options: ['Contrast', 'Repetition', 'Proximity', 'Alignment'],
          correctIndex: 2,
          explanation: 'Proximity groups related items together to create visual relationships and reduce cognitive load.',
        },
        {
          question: 'What is the recommended line height for body text at 16px?',
          options: ['16px', '20px', '24px', '32px'],
          correctIndex: 2,
          explanation: 'Line height should be 1.5x the font size. 16px * 1.5 = 24px for optimal readability.',
        },
        {
          question: 'What is the minimum color contrast ratio for accessible text?',
          options: ['1:1', '2:1', '3:1', '4.5:1'],
          correctIndex: 3,
          explanation: 'WCAG accessibility guidelines require a minimum contrast ratio of 4.5:1 for normal text.',
        },
        {
          question: 'In the 8-point grid system, which spacing value is used for default padding inside components?',
          options: ['4px', '8px', '16px', '32px'],
          correctIndex: 2,
          explanation: '16px (2 units of 8) is the standard default padding inside UI components.',
        },
        {
          question: 'How many users should you interview for meaningful UX research?',
          options: ['1-2', '5-8', '20-30', '100+'],
          correctIndex: 1,
          explanation: 'Research shows that 5-8 users reveal approximately 85% of usability issues.',
        },
      ],
    },
  },

  // ── 3. Digital Marketing ──────────────────────────────────────────────────
  {
    title: 'Digital Marketing & Growth Hacking',
    slug: 'digital-marketing-growth-hacking',
    description: 'Learn SEO, social media marketing, email marketing, and paid advertising. Real strategies used by top agencies to grow brands from 0 to millions of users.',
    category: 'marketing',
    level: 'intermediate',
    skills: ['seo', 'social-media marketing', 'email marketing', 'google ads', 'content strategy', 'analytics'],
    estimatedHours: 8,
    certificateTitle: 'Certified Digital Marketing Specialist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    isPublished: true,
    lessons: [
      {
        title: 'SEO Mastery — Ranking on Page 1 of Google',
        content: 'SEO (Search Engine Optimization) is the process of ranking your website higher in search results — bringing free, targeted traffic 24/7.\n\nHOW GOOGLE RANKS PAGES\nGoogle uses 200+ ranking factors. The 3 most important:\n1. Relevance — does your content match the search query?\n2. Authority — do other reputable sites link to you?\n3. User Experience — do users stay on your page or immediately leave?\n\nKEYWORD RESEARCH (start here)\nTools: Google Keyword Planner (free), Ahrefs, SEMrush, Ubersuggest\n\nKeyword types:\n- Head terms: "web development" — high volume, very competitive\n- Long-tail: "hire React developer for e-commerce app Pakistan" — lower volume, easier to rank\nTarget long-tail keywords when starting out.\n\nON-PAGE SEO CHECKLIST\n- Title tag: Include main keyword, 50-60 characters max\n  Good: "Hire Freelance React Developer in Pakistan | Linkify"\n  Bad: "Services"\n- Meta description: 150-160 chars, include CTA\n- H1: One per page, include main keyword\n- H2/H3: Use related keywords naturally\n- URL structure: /hire-react-developer (not /page?id=123)\n- Image alt text: Describe the image with keywords\n- Internal links: Link to 2-3 related pages\n- Page speed: Under 3 seconds (use Google PageSpeed Insights to test)\n- Mobile responsive: Google penalizes non-mobile sites\n\nOFF-PAGE SEO — BUILDING AUTHORITY\n- Guest posting on industry blogs\n- Getting listed in directories\n- Creating shareable content (infographics, studies, tools)\n- Broken link building\n- HARO (Help a Reporter Out) for media mentions\n\nTECHNICAL SEO\n- HTTPS (SSL certificate)\n- XML sitemap submitted to Google Search Console\n- Robots.txt configured correctly\n- Canonical tags to avoid duplicate content\n- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1\n\nCONTENT STRATEGY\n- Publish 1-2 high-quality articles per week minimum\n- Minimum 1,500 words for competitive keywords\n- Answer the "People Also Ask" questions in your content\n- Update old content every 6 months\n\nPRACTICE TASK\nDo keyword research for a freelance skill you have. Find 5 long-tail keywords with decent search volume (500-5,000/month) and low competition. Write an outline for a blog post targeting the best keyword.',
        durationMinutes: 60,
        order: 1,
      },
      {
        title: 'Social Media Marketing — Building an Audience',
        content: 'Social media marketing is about building relationships and trust at scale, then converting that trust into business.\n\nPLATFORM STRATEGY\n\nLinkedIn (Best for B2B, freelancers, professionals)\n- Post frequency: 3-5x per week\n- Best content: industry insights, career milestones, case studies\n- Golden hour: Engage with every comment in the first 60 minutes\n- Profile optimization: headline, featured section, 500+ connections\n\nInstagram (Best for visual products, B2C)\n- Reels: 7-15 seconds for best reach\n- Stories: 5-7 per day for algorithm boost\n- Carousels: highest saves/shares = algorithm loves them\n- Hashtags: 5-10 relevant ones (not 30 random ones)\n\nTikTok (Best for Gen Z, viral reach)\n- Hook in first 2 seconds is everything\n- Post 1-3x daily when growing\n- Trending sounds increase reach by 50-100%\n\nTwitter/X (Best for tech, SaaS, thought leadership)\n- Thread content performs best\n- Engage with larger accounts in your niche\n- Post 3-5x daily\n\nCONTENT PILLARS (choose 3-4 for your brand)\n- Educational: "How to..." tutorials\n- Inspirational: success stories, transformations\n- Entertainment: behind-the-scenes, relatable content\n- Promotional: your services (maximum 20% of content)\n\nCONTENT CALENDAR TEMPLATE\nMonday: Educational post\nTuesday: Client testimonial or case study\nWednesday: Behind-the-scenes\nThursday: Tips or quick tutorial\nFriday: Promotional post\nWeekend: Engaging question or poll\n\nKEY METRICS TO TRACK\n- Reach: How many unique people saw your content\n- Engagement rate: (likes + comments + shares) / reach x 100\n  Target: 2-5% is good, 5%+ is excellent\n- Follower growth rate: aim for 5-10% monthly\n- Click-through rate to website: target 1-3%\n- Conversion rate: followers who become clients\n\nPRACTICE TASK\nCreate a 30-day content calendar for a freelance brand. Mix content types across 3 pillars. Write 5 full posts (caption + hashtags) ready to publish.',
        durationMinutes: 55,
        order: 2,
      },
      {
        title: 'Email Marketing and Paid Advertising',
        content: 'Email marketing has the highest ROI of any digital channel — 4,200% (42 PKR return for every 1 PKR invested). Paid advertising accelerates growth.\n\nEMAIL MARKETING\n\nBuilding Your List (ethical methods only):\n- Lead magnets: free guide, template, checklist in exchange for email\n- Newsletter signup with clear value proposition\n- Exit-intent popups\n- Content upgrades (bonus content within articles)\n- Never buy email lists — they destroy deliverability\n\nEmail Sequence Blueprint:\nDay 0: Welcome email (introduce yourself, deliver lead magnet)\nDay 1: Your story + how you can help\nDay 3: Most valuable tip related to your service\nDay 5: Social proof (case study or testimonial)\nDay 7: Soft pitch (your service offer)\nDay 14: Follow-up with FAQ and objection handling\n\nSubject Line Formulas That Work:\n- "The mistake that cost me 10 clients (do not do this)"\n- "3 things I wish I knew before freelancing"\n- "Your proposal is getting rejected because of this"\n- Personalized: "Ahmed, your profile is almost ready"\n\nKey Metrics:\n- Open rate: 20-30% is good\n- Click-through rate: 2-5% is good\n- Unsubscribe rate: below 0.5% is healthy\n\nGOOGLE ADS FUNDAMENTALS\nSearch ads appear when users actively search for your service.\n\nCampaign structure:\nAccount > Campaign > Ad Group > Ads + Keywords\n\nMatch types:\n- Broad match: web developer (shows for many variations)\n- Phrase match: "web developer" (contains this phrase)\n- Exact match: [web developer pakistan] (exact query only)\n\nQuality Score (1-10): affects cost and position\n= keyword relevance + ad relevance + landing page experience\n\nBid strategies:\n- Manual CPC: full control, good for learning\n- Target CPA: let Google optimize for conversions\n- Target ROAS: optimize for revenue\n\nFACEBOOK AND INSTAGRAM ADS\nCampaign objective tiers:\n1. Awareness (reach, brand awareness)\n2. Consideration (traffic, engagement, leads)\n3. Conversion (purchases, sign-ups)\n\nAudience targeting:\n- Core audiences: demographics, interests, behaviors\n- Custom audiences: your email list, website visitors\n- Lookalike audiences: people similar to your best customers\n\nCreative best practices:\n- Video: 3-second view rate is the key metric\n- Image: clear single message, minimal text\n- Headline: benefit-driven, not feature-driven\n- Always test 3-5 creatives simultaneously (A/B test)\n\nPRACTICE TASK\nWrite a 7-email welcome sequence for a freelance design service. Each email should have a subject line, opening hook, main content, and clear CTA.',
        durationMinutes: 65,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'What type of keywords are easier to rank for when starting SEO?',
          options: ['Head terms', 'Long-tail keywords', 'Brand keywords', 'Generic keywords'],
          correctIndex: 1,
          explanation: 'Long-tail keywords have lower competition and higher conversion rates, making them ideal for new websites.',
        },
        {
          question: 'What is the average ROI for email marketing?',
          options: ['200%', '1,000%', '4,200%', '500%'],
          correctIndex: 2,
          explanation: 'Email marketing has an average ROI of 4,200% — $42 return for every $1 invested.',
        },
        {
          question: 'What engagement rate is considered excellent on social media?',
          options: ['0.1-0.5%', '1-2%', '5%+', '50%'],
          correctIndex: 2,
          explanation: 'An engagement rate above 5% is considered excellent across most social media platforms.',
        },
        {
          question: 'What does Google Quality Score measure in paid ads?',
          options: ['Budget size', 'Keyword relevance, ad relevance, and landing page experience', 'Number of keywords', 'Ad image quality'],
          correctIndex: 1,
          explanation: 'Quality Score (1-10) combines keyword relevance, ad relevance, and landing page experience to determine cost and position.',
        },
        {
          question: 'What is the optimal title tag length for SEO?',
          options: ['20-30 characters', '50-60 characters', '100-150 characters', '200+ characters'],
          correctIndex: 1,
          explanation: 'Title tags should be 50-60 characters to display fully in search results without being truncated.',
        },
      ],
    },
  },

  // ── 4. Freelancing Blueprint ───────────────────────────────────────────────
  {
    title: 'The Freelancing Success Blueprint',
    slug: 'freelancing-success-blueprint',
    description: 'The complete guide to building a 6-figure freelance career. From setting up your profile to landing clients, pricing your services, managing projects, and scaling to a team.',
    category: 'business',
    level: 'beginner',
    skills: ['freelancing', 'client acquisition', 'proposal writing', 'pricing strategy', 'project management', 'communication'],
    estimatedHours: 6,
    certificateTitle: 'Certified Freelance Professional',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80',
    isPublished: true,
    lessons: [
      {
        title: 'Positioning Yourself as the Expert',
        content: 'The biggest mistake new freelancers make is being a generalist. "I can do anything!" is the fastest path to low rates and no clients.\n\nTHE POWER OF NICHING DOWN\nExample A: "I am a web developer"\nExample B: "I build e-commerce stores for Pakistani fashion brands using Shopify"\n\nExample B will:\n- Charge 3-5x more\n- Get clients faster\n- Get referred more often\n- Have less competition\n\nHOW TO FIND YOUR NICHE\nStep 1: List your skills (what can you do?)\nStep 2: List industries you know well (fashion, real estate, education, healthcare)\nStep 3: Find the intersection\nStep 4: Research if there is demand (check job boards for that niche)\n\nYOUR FREELANCER PROFILE\n\nProfile Photo:\n- Professional headshot (not a selfie)\n- Good lighting, clean background\n- Friendly and approachable expression\n- Dress as you would for a client meeting\n\nHeadline Formula:\n[What you do] + [For whom] + [Key result]\nExample: "Shopify Developer for Fashion Brands — 50+ Stores Launched"\n\nBio/Overview structure:\n1. Hook: address the client\'s pain point\n2. Your solution and approach\n3. Social proof (numbers, notable clients)\n4. Skills and tools you use\n5. Call-to-action\n\nExample Bio:\n"Fashion brands lose thousands in sales every month from slow, ugly online stores. I fix that.\n\nI specialize in building fast, conversion-optimized Shopify stores for fashion brands in Pakistan and the GCC. In the past 2 years, I have built 50+ stores that have collectively processed over PKR 50M in sales.\n\nI work with: [Shopify] [React] [Liquid] [Figma]\n\nReady to double your online sales? Message me."\n\nPORTFOLIO STRATEGY\n- Show 3-5 projects (quality > quantity)\n- For each project include: the problem, your solution, and measurable results\n- Use before/after screenshots\n- If you are new: create 2-3 demo projects for your portfolio\n\nPRACTICE TASK\nWrite your complete freelancer bio using the structure above. Get feedback from 3 people in your target industry. Revise until they immediately understand your value.',
        durationMinutes: 45,
        order: 1,
      },
      {
        title: 'Writing Proposals That Win Clients',
        content: 'Most freelancers send generic proposals. Yours will be different — personalized, concise, and focused on the client\'s goals.\n\nWHY MOST PROPOSALS FAIL\n- They start with "I have 5 years of experience..."\n- They are copy-pasted (clients can tell)\n- They focus on the freelancer, not the client\n- They are too long (clients are busy)\n- They don\'t address the specific requirements\n\nTHE WINNING PROPOSAL FORMULA\n\n1. Personalized Hook (2-3 sentences)\nShow you actually read their post. Reference something specific.\n"I noticed you mentioned your current Shopify store is losing sales because of slow load times — I solved exactly this problem for a clothing brand in Lahore last month."\n\n2. Your Understanding (2-3 sentences)\nRestate their problem in your own words. This builds trust.\n"You need a fast, mobile-optimized store that converts visitors into buyers, built within 2 weeks for the upcoming Eid season."\n\n3. Your Solution (3-5 sentences)\nExplain specifically how you will solve it.\n"I will audit your current store, identify the performance bottlenecks, rebuild the product pages using optimized Liquid code, and integrate a proven checkout flow. I have done this for 3 similar brands with average 40% increase in conversion rate."\n\n4. Social Proof (1-2 sentences)\n"You can see similar work in my portfolio — the Dastaan Clothing project saw page load time drop from 8s to 1.5s."\n\n5. Clear CTA\n"Can we schedule a 15-minute call this week to confirm scope?"\n\nPRICING IN PROPOSALS\nAlways offer 3 options:\n\nBasic (PKR 25,000)\n- Speed optimization only\n- 1 week delivery\n- 1 revision\n\nStandard (PKR 45,000)\n- Full store rebuild\n- 2 week delivery\n- 3 revisions\n- 30 days support\n\nPremium (PKR 85,000)\n- Full rebuild + marketing setup\n- 3 week delivery\n- Unlimited revisions\n- 90 days support\n\nPRACTICE TASK\nWrite 3 complete proposals for 3 different job posts (find real ones on Upwork or LinkedIn). Time yourself — aim for under 15 minutes per proposal. Get a fellow freelancer to rate each one.',
        durationMinutes: 50,
        order: 2,
      },
      {
        title: 'Pricing, Contracts and Scaling',
        content: 'Undercharging is the #1 mistake new freelancers make. This lesson will help you price confidently and build systems to scale.\n\nPRICING STRATEGIES\n\n1. Hourly Rate Calculator\nTarget monthly income: PKR 200,000\nBillable hours per month: 80 (20 hours/week)\nMinimum hourly rate = 200,000 / 80 = PKR 2,500/hour\nAdd 20% for taxes and expenses = PKR 3,000/hour minimum\n\n2. Value-Based Pricing (advanced)\nCharge based on value delivered, not time spent.\n"If this website generates PKR 500,000/month in sales, charging PKR 100,000 to build it is a bargain."\n\n3. Productized Services\nPackage your service into fixed-price products:\nProduct: "Shopify Speed Optimization — PKR 35,000 flat"\n- Fixed price, fixed scope, fixed delivery time\n- No negotiation, no scope creep\n- Scale by raising prices not hours\n\nCONTRACTS (ALWAYS USE ONE)\nMinimum contract clauses:\n1. Scope of work (detailed deliverables list)\n2. Payment terms (50% upfront, 50% on delivery)\n3. Revision policy (2 rounds of revisions included)\n4. Intellectual property (who owns the work)\n5. Termination clause\n6. Late payment fees (2% per week)\n\nFree contract templates: docracy.com, bonsai.io\n\nMANAGING CLIENTS PROFESSIONALLY\nWeekly update email template:\n"Hi [Name], weekly update for [Project]:\n\nCompleted this week:\n- [Task 1]\n- [Task 2]\n\nWorking on next week:\n- [Task 3]\n\nBlockers/questions:\n- [Question if any]\n\nOn track for [delivery date]. Let me know if you have any questions."\n\nSCALING YOUR FREELANCE BUSINESS\n\nStage 1 (0-6 months): Get first 5 clients, build reviews\nStage 2 (6-12 months): Raise rates 20%, specialize in niche\nStage 3 (1-2 years): Retainer clients, PKR 200K+/month\nStage 4 (2+ years): Hire subcontractors, build an agency\n\nRetainer model: charge clients a fixed monthly fee (PKR 30-50K) for ongoing work. One retainer = financial stability.\n\nPRACTICE TASK\nCalculate your minimum hourly rate using the formula above. Then create a 3-tier pricing menu for your main service. Finally, write the scope of work section for a fictional project.',
        durationMinutes: 55,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'What is the biggest mistake new freelancers make with positioning?',
          options: ['Charging too much', 'Being too specialized', 'Being a generalist', 'Having a portfolio'],
          correctIndex: 2,
          explanation: 'Being a generalist leads to low rates and fierce competition. Niching down to a specific service for a specific industry is the fastest path to higher income.',
        },
        {
          question: 'What should the first sentence of a winning proposal focus on?',
          options: ['Your years of experience', 'Your portfolio link', 'The client\'s specific problem', 'Your hourly rate'],
          correctIndex: 2,
          explanation: 'Great proposals start by addressing the client\'s specific problem, demonstrating that you read and understood their requirements.',
        },
        {
          question: 'What percentage upfront should you require from new clients?',
          options: ['10%', '25%', '50%', '100%'],
          correctIndex: 2,
          explanation: '50% upfront is the industry standard for freelancers. It filters out unserious clients and protects against non-payment.',
        },
        {
          question: 'In value-based pricing, what determines your rate?',
          options: ['Time spent on the project', 'Your competitor\'s rates', 'The value delivered to the client', 'Your cost of living'],
          correctIndex: 2,
          explanation: 'Value-based pricing charges based on the business outcome delivered to the client, not time spent.',
        },
        {
          question: 'What is a productized service?',
          options: ['A service that is sold as a physical product', 'A fixed-price, fixed-scope, fixed-delivery service package', 'A subscription service', 'A service sold on a marketplace'],
          correctIndex: 1,
          explanation: 'A productized service has a fixed price, fixed scope, and fixed delivery time — eliminating negotiation and scope creep.',
        },
      ],
    },
  },

  // ── 5. Mobile App Development ─────────────────────────────────────────────
  {
    title: 'React Native — Build iOS and Android Apps',
    slug: 'react-native-ios-android-apps',
    description: 'Build real mobile applications for both iOS and Android using a single codebase. Learn React Native from scratch, publish your first app, and command premium freelance rates.',
    category: 'mobile-development',
    level: 'intermediate',
    skills: ['react native', 'javascript', 'mobile development', 'ios', 'android', 'expo'],
    estimatedHours: 12,
    certificateTitle: 'Certified React Native Developer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    isPublished: true,
    lessons: [
      {
        title: 'React Native Fundamentals',
        content: 'React Native lets you build native mobile apps using JavaScript and React. One codebase runs on both iOS and Android.\n\nWHY REACT NATIVE?\n- Write once, deploy to iOS and Android\n- Uses real native components (not a web view)\n- Huge ecosystem and community (used by Facebook, Instagram, Shopify)\n- If you know React, you already know 80% of React Native\n- React Native developers earn 30-50% more than pure web developers\n\nSETTING UP\n1. Install Node.js and npm\n2. Install Expo CLI: npm install -g expo-cli\n3. Create project: npx create-expo-app MyApp\n4. Start: npx expo start\n5. Install Expo Go on your phone to preview instantly\n\nCORE COMPONENTS\nReact Native uses native components, not HTML:\n\n| Web (HTML) | React Native |\n|------------|---------------|\n| div        | View          |\n| p          | Text          |\n| img        | Image         |\n| input      | TextInput     |\n| button     | TouchableOpacity |\n| ul/li      | FlatList      |\n\nBasic component example:\nimport { View, Text, StyleSheet, TouchableOpacity } from "react-native";\n\nfunction JobCard({ job, onPress }) {\n  return (\n    <TouchableOpacity style={styles.card} onPress={onPress}>\n      <Text style={styles.title}>{job.title}</Text>\n      <Text style={styles.budget}>PKR {job.budget}</Text>\n    </TouchableOpacity>\n  );\n}\n\nconst styles = StyleSheet.create({\n  card: {\n    backgroundColor: "#fff",\n    borderRadius: 12,\n    padding: 16,\n    marginBottom: 12,\n    shadowColor: "#000",\n    shadowOpacity: 0.1,\n    shadowRadius: 8,\n    elevation: 3,      // Android shadow\n  },\n  title: { fontSize: 16, fontWeight: "600", color: "#111827" },\n  budget: { fontSize: 14, color: "#10B981", marginTop: 4 },\n});\n\nStyling in React Native:\n- Uses StyleSheet.create() instead of CSS files\n- Flexbox by default (column direction, not row)\n- No inheritance — style every component individually\n- Use pt units, not px\n\nPRACTICE TASK\nBuild a job card component with: title, category badge, budget, deadline, and an "Apply" button. Style it to look professional.',
        durationMinutes: 60,
        order: 1,
      },
      {
        title: 'Navigation and State Management',
        content: 'Mobile apps have multiple screens. React Navigation handles routing. State management keeps data synchronized.\n\nREACT NAVIGATION\n\nInstallation:\nnpm install @react-navigation/native\nnpm install @react-navigation/stack\nnpm install react-native-screens react-native-safe-area-context\n\nStack Navigator (most common):\nimport { NavigationContainer } from "@react-navigation/native";\nimport { createStackNavigator } from "@react-navigation/stack";\n\nconst Stack = createStackNavigator();\n\nfunction App() {\n  return (\n    <NavigationContainer>\n      <Stack.Navigator initialRouteName="Home">\n        <Stack.Screen name="Home" component={HomeScreen} />\n        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />\n        <Stack.Screen name="Profile" component={ProfileScreen} />\n      </Stack.Navigator>\n    </NavigationContainer>\n  );\n}\n\nNavigating between screens:\nfunction JobCard({ job, navigation }) {\n  return (\n    <TouchableOpacity\n      onPress={() => navigation.navigate("JobDetails", { jobId: job._id })}\n    >\n      <Text>{job.title}</Text>\n    </TouchableOpacity>\n  );\n}\n\nBottom Tab Navigator:\nimport { createBottomTabNavigator } from "@react-navigation/bottom-tabs";\nconst Tab = createBottomTabNavigator();\n\nfunction MainTabs() {\n  return (\n    <Tab.Navigator>\n      <Tab.Screen name="Home" component={HomeScreen} />\n      <Tab.Screen name="Jobs" component={JobsScreen} />\n      <Tab.Screen name="Messages" component={MessagesScreen} />\n      <Tab.Screen name="Profile" component={ProfileScreen} />\n    </Tab.Navigator>\n  );\n}\n\nSTATE MANAGEMENT WITH REDUX TOOLKIT\nFor large apps, use Redux Toolkit:\nnpm install @reduxjs/toolkit react-redux\n\nCreate a slice:\nimport { createSlice } from "@reduxjs/toolkit";\n\nconst authSlice = createSlice({\n  name: "auth",\n  initialState: { user: null, token: null },\n  reducers: {\n    setUser: (state, action) => {\n      state.user = action.payload.user;\n      state.token = action.payload.token;\n    },\n    logout: (state) => {\n      state.user = null;\n      state.token = null;\n    },\n  },\n});\n\nPRACTICE TASK\nBuild a 4-tab app with: Home (job feed), Jobs (search/filter), Messages (chat list), Profile. Connect screens with stack navigation inside each tab.',
        durationMinutes: 75,
        order: 2,
      },
      {
        title: 'APIs, Storage and Publishing Your App',
        content: 'Connect your app to a real backend, store data locally, and publish to the App Store and Google Play.\n\nCONNECTING TO APIs\n\nUsing Axios:\nnpm install axios\n\nimport axios from "axios";\n\nconst API = axios.create({\n  baseURL: "https://your-api.com/api",\n  timeout: 10000,\n});\n\n// Add auth token to every request\nAPI.interceptors.request.use((config) => {\n  const token = store.getState().auth.token;\n  if (token) config.headers.Authorization = "Bearer " + token;\n  return config;\n});\n\nFetch jobs:\nconst fetchJobs = async (filters) => {\n  const response = await API.get("/jobs", { params: filters });\n  return response.data;\n};\n\nLOCAL STORAGE\nAsyncStorage for persisting data (like auth tokens):\nnpm install @react-native-async-storage/async-storage\n\nimport AsyncStorage from "@react-native-async-storage/async-storage";\n\n// Save token\nawait AsyncStorage.setItem("token", token);\n\n// Retrieve token\nconst token = await AsyncStorage.getItem("token");\n\n// Delete token (logout)\nawait AsyncStorage.removeItem("token");\n\nPUSH NOTIFICATIONS\nnpm install expo-notifications\n\nimport * as Notifications from "expo-notifications";\n\nconst registerForNotifications = async () => {\n  const { status } = await Notifications.requestPermissionsAsync();\n  if (status === "granted") {\n    const token = await Notifications.getExpoPushTokenAsync();\n    // Send this token to your backend\n    await API.post("/users/push-token", { token: token.data });\n  }\n};\n\nPUBLISHING YOUR APP\n\nWith Expo EAS Build (easiest method):\n1. npm install -g eas-cli\n2. eas login\n3. eas build:configure\n4. eas build --platform android  (generates .aab file)\n5. eas build --platform ios      (requires Apple Developer account)\n6. eas submit                    (submits to stores)\n\nApp Store requirements:\n- Apple Developer account: $99/year\n- App icons: 1024x1024px\n- Screenshots for all device sizes\n- Privacy policy URL\n- App description (use keywords for ASO)\n\nPRACTICE TASK\nConnect your job board app to the Linkify API. Implement: login/logout with token storage, job listing with infinite scroll, job details with apply button, and basic push notification setup.',
        durationMinutes: 80,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 25,
      questions: [
        {
          question: 'What is the React Native equivalent of the HTML "div" element?',
          options: ['Container', 'Box', 'View', 'Div'],
          correctIndex: 2,
          explanation: '"View" is the fundamental React Native component for building UI, equivalent to "div" in web development.',
        },
        {
          question: 'Which tool do you use to preview a React Native app instantly on your phone?',
          options: ['Android Studio', 'Xcode', 'Expo Go', 'TestFlight'],
          correctIndex: 2,
          explanation: 'Expo Go is a free app that lets you preview your React Native project on your physical device instantly via QR code.',
        },
        {
          question: 'What is the default flex direction in React Native?',
          options: ['row', 'row-reverse', 'column', 'column-reverse'],
          correctIndex: 2,
          explanation: 'React Native defaults to "column" flex direction, unlike CSS which defaults to "row".',
        },
        {
          question: 'Which library is used for storing data locally in React Native?',
          options: ['LocalStorage', 'AsyncStorage', 'SQLite', 'SecureStore'],
          correctIndex: 1,
          explanation: 'AsyncStorage is the standard React Native library for persisting key-value data locally on the device.',
        },
        {
          question: 'How much does an Apple Developer account cost per year to publish iOS apps?',
          options: ['Free', '$25/year', '$99/year', '$299/year'],
          correctIndex: 2,
          explanation: 'An Apple Developer account costs $99/year and is required to publish apps to the App Store.',
        },
      ],
    },
  },
];

// ─── SEED FUNCTION ─────────────────────────────────────────────────────────
const seedCourses = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let created = 0;
    let updated = 0;

    for (const courseData of courses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      if (existing) {
        await Course.findOneAndUpdate({ slug: courseData.slug }, courseData, { new: true });
        console.log('Updated : ' + courseData.title);
        updated++;
      } else {
        await Course.create(courseData);
        console.log('Created : ' + courseData.title);
        created++;
      }
    }

    console.log('\n Learning Hub seeded successfully!');
    console.log('   Created : ' + created + ' new courses');
    console.log('   Updated : ' + updated + ' existing courses');
    console.log('\n Courses now available:');
    courses.forEach(function(c, i) {
      console.log('   ' + (i + 1) + '. ' + c.title);
      console.log('      ' + c.level + ' | ' + c.lessons.length + ' lessons | ' + c.assessment.questions.length + ' questions | ' + c.estimatedHours + 'h');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
