import mongoose from 'mongoose';
import Course from '../models/Course.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description: 'Master HTML, CSS, JavaScript, React and Node.js from scratch. Build real-world projects and earn your web development certification.',
    category: 'web-development',
    level: 'beginner',
    skills: ['html', 'css', 'javascript', 'react', 'node.js'],
    estimatedHours: 12,
    certificateTitle: 'Certified Web Developer',
    isPublished: true,
    lessons: [
      {
        title: 'Introduction to HTML',
        content: `HTML (HyperText Markup Language) is the foundation of every website. It provides the structure and content of web pages.

Key concepts:
• Tags and elements: <h1>, <p>, <div>, <a>, <img>
• Attributes: class, id, href, src
• Document structure: <!DOCTYPE html>, <html>, <head>, <body>
• Semantic HTML5 elements: <header>, <nav>, <main>, <footer>, <section>, <article>

Example:
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
  </body>
</html>

Practice: Create a personal portfolio page using only HTML with at least 5 different tags.`,
        durationMinutes: 45,
        order: 1,
      },
      {
        title: 'CSS Styling and Layouts',
        content: `CSS (Cascading Style Sheets) makes your HTML beautiful. It controls colors, fonts, spacing, and layouts.

Key concepts:
• Selectors: element, class (.class), id (#id)
• Box model: margin, border, padding, content
• Flexbox for modern layouts
• CSS Grid for complex layouts
• Responsive design with media queries

Example:
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

Practice: Style your HTML portfolio with colors, fonts, and a responsive layout.`,
        durationMinutes: 60,
        order: 2,
      },
      {
        title: 'JavaScript Fundamentals',
        content: `JavaScript brings interactivity to your websites. It is the programming language of the web.

Key concepts:
• Variables: let, const, var
• Data types: string, number, boolean, array, object
• Functions and arrow functions
• DOM manipulation: document.querySelector, addEventListener
• Fetch API for HTTP requests
• Promises and async/await

Example:
const button = document.querySelector('#myBtn');
button.addEventListener('click', async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
});

Practice: Build a to-do list app with add, delete, and mark-complete features.`,
        durationMinutes: 90,
        order: 3,
      },
      {
        title: 'React.js Essentials',
        content: `React is a JavaScript library for building user interfaces. It uses components to build complex UIs from small, reusable pieces.

Key concepts:
• Components: functional components
• JSX syntax
• Props and State (useState hook)
• useEffect for side effects
• React Router for navigation
• API calls with useEffect

Example:
import { useState, useEffect } from 'react';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}

Practice: Build a job listing page that fetches data from an API.`,
        durationMinutes: 120,
        order: 4,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 30,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Links', 'High Transfer Markup Language'],
          correctIndex: 0,
          explanation: 'HTML stands for HyperText Markup Language. It is the standard language for creating web pages.',
        },
        {
          question: 'Which CSS property is used to change the text color?',
          options: ['text-color', 'font-color', 'color', 'text-style'],
          correctIndex: 2,
          explanation: 'The "color" property in CSS is used to set the color of text.',
        },
        {
          question: 'Which hook is used to manage state in React?',
          options: ['useEffect', 'useState', 'useContext', 'useRef'],
          correctIndex: 1,
          explanation: 'useState is the React hook used to add state to functional components.',
        },
        {
          question: 'What does CSS stand for?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Syntax', 'Coded Style Sheets'],
          correctIndex: 1,
          explanation: 'CSS stands for Cascading Style Sheets.',
        },
        {
          question: 'Which method adds an event listener in JavaScript?',
          options: ['addEvent()', 'addEventListener()', 'on()', 'listen()'],
          correctIndex: 1,
          explanation: 'addEventListener() is used to attach an event handler to a DOM element.',
        },
      ],
    },
  },
  {
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    description: 'Learn the principles of user interface and user experience design. Create beautiful, intuitive designs using Figma and industry best practices.',
    category: 'design',
    level: 'beginner',
    skills: ['figma', 'ui design', 'ux design', 'wireframing', 'prototyping'],
    estimatedHours: 8,
    certificateTitle: 'Certified UI/UX Designer',
    isPublished: true,
    lessons: [
      {
        title: 'Design Principles and Color Theory',
        content: `Good design is not just about making things look pretty. It is about solving problems and creating meaningful experiences.

Core design principles:
• Contrast: Make important elements stand out
• Alignment: Create visual order and connection
• Repetition: Build consistency throughout the design
• Proximity: Group related items together
• White space: Give your design room to breathe

Color Theory:
• Primary colors: Red, Blue, Yellow
• Color wheel: Complementary, analogous, triadic schemes
• Psychology of colors:
  - Blue: Trust, professionalism (used by Facebook, LinkedIn)
  - Green: Growth, health (used by Spotify, WhatsApp)
  - Red: Urgency, energy (used by YouTube, Netflix)
  - Yellow: Optimism, clarity (used by McDonald's, Snapchat)

Tip: Use a maximum of 3 colors in your design — primary, secondary, and accent.`,
        durationMinutes: 45,
        order: 1,
      },
      {
        title: 'Typography and Layout',
        content: `Typography is the art of arranging text to make it readable and visually appealing.

Key concepts:
• Font families: Serif (formal), Sans-serif (modern), Monospace (code)
• Font hierarchy: H1 > H2 > H3 > Body > Caption
• Line height: 1.4-1.6x the font size for body text
• Letter spacing: Increase for headings, decrease for body
• Maximum line length: 60-80 characters for readability

Layout principles:
• 12-column grid system
• 8px spacing system (8, 16, 24, 32, 48, 64px)
• Z-pattern and F-pattern reading flow
• Above the fold content

Popular font pairings:
• Playfair Display + Source Sans Pro
• Montserrat + Merriweather
• Inter + Georgia`,
        durationMinutes: 40,
        order: 2,
      },
      {
        title: 'Wireframing and Prototyping in Figma',
        content: `Wireframes are low-fidelity blueprints of your design. Figma is the industry-standard design tool.

Wireframing process:
1. Define user goals and user stories
2. Sketch rough layouts on paper
3. Create digital wireframes in Figma
4. Get feedback and iterate
5. Build high-fidelity mockups
6. Create interactive prototypes

Figma basics:
• Frames: containers for your designs (like artboards)
• Components: reusable design elements
• Auto-layout: responsive design in Figma
• Prototyping: connect screens with interactions
• Variants: multiple states of a component

User testing:
• Think-aloud protocol
• A/B testing
• Heatmaps and click tracking`,
        durationMinutes: 60,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'Which design principle groups related items together?',
          options: ['Contrast', 'Alignment', 'Proximity', 'Repetition'],
          correctIndex: 2,
          explanation: 'Proximity groups related elements together to create visual relationships.',
        },
        {
          question: 'What is the recommended line length for body text readability?',
          options: ['20-40 characters', '60-80 characters', '100-120 characters', '10-20 characters'],
          correctIndex: 1,
          explanation: '60-80 characters per line is the optimal length for readability.',
        },
        {
          question: 'Which color is associated with trust and professionalism?',
          options: ['Red', 'Yellow', 'Green', 'Blue'],
          correctIndex: 3,
          explanation: 'Blue is associated with trust, reliability, and professionalism.',
        },
        {
          question: 'What are low-fidelity blueprints of a design called?',
          options: ['Mockups', 'Wireframes', 'Prototypes', 'Sketches'],
          correctIndex: 1,
          explanation: 'Wireframes are low-fidelity blueprints that outline the structure of a design.',
        },
        {
          question: 'What is the industry-standard design tool for UI/UX?',
          options: ['Photoshop', 'Sketch', 'Figma', 'Canva'],
          correctIndex: 2,
          explanation: 'Figma is the industry-standard collaborative design tool for UI/UX.',
        },
      ],
    },
  },
  {
    title: 'Digital Marketing Mastery',
    slug: 'digital-marketing-mastery',
    description: 'Learn SEO, social media marketing, content marketing, and paid advertising. Master the skills needed to grow any business online.',
    category: 'marketing',
    level: 'beginner',
    skills: ['seo', 'social media', 'content marketing', 'google ads', 'email marketing'],
    estimatedHours: 6,
    certificateTitle: 'Certified Digital Marketer',
    isPublished: true,
    lessons: [
      {
        title: 'SEO Fundamentals',
        content: `SEO (Search Engine Optimization) helps your website rank higher in search engines like Google.

On-page SEO:
• Title tags: Include your main keyword, keep under 60 characters
• Meta descriptions: 150-160 characters, include a call-to-action
• Header tags: H1 for main title, H2/H3 for subheadings
• Keyword density: 1-2% naturally throughout content
• Alt text for images
• Internal linking between related pages

Off-page SEO:
• Backlinks from authoritative websites
• Social signals
• Google My Business for local SEO

Technical SEO:
• Page speed (aim for under 3 seconds)
• Mobile-friendly design
• SSL certificate (https)
• XML sitemap and robots.txt
• Core Web Vitals

Keyword research tools: Google Keyword Planner, Ahrefs, SEMrush, Ubersuggest`,
        durationMinutes: 50,
        order: 1,
      },
      {
        title: 'Social Media Marketing',
        content: `Social media is one of the most powerful marketing channels available today.

Platform strategy:
• Facebook/Instagram: B2C, visual products, older demographics
• LinkedIn: B2B, professional services, career content
• TikTok/Instagram Reels: Gen Z, short video content
• Twitter/X: News, tech, thought leadership
• YouTube: Long-form video, tutorials, reviews

Content types that perform well:
• Educational posts (how-to, tips)
• Behind-the-scenes content
• User-generated content and testimonials
• Polls and interactive content
• Live videos

Content calendar:
• Post consistently (3-5x per week minimum)
• Best times: Tuesday-Thursday, 9am-12pm
• Use scheduling tools: Buffer, Hootsuite, Later

Metrics to track:
• Reach and impressions
• Engagement rate (aim for 2-5%)
• Click-through rate
• Conversion rate`,
        durationMinutes: 45,
        order: 2,
      },
      {
        title: 'Email Marketing and Paid Advertising',
        content: `Email marketing has the highest ROI of any digital marketing channel ($42 return for every $1 spent).

Email marketing best practices:
• Build your list organically (never buy lists)
• Welcome sequence for new subscribers
• Segment your list based on interests and behavior
• Personalize subject lines (increase open rates by 26%)
• A/B test subject lines, CTAs, and send times
• Mobile-optimized templates
• Clear unsubscribe link (legal requirement)

Google Ads basics:
• Search ads: appear when users search for keywords
• Display ads: banner ads across the web
• Quality Score: relevance of keyword, ad, and landing page
• Bidding strategies: CPC, CPM, CPA, ROAS

Facebook/Instagram Ads:
• Awareness, consideration, and conversion campaigns
• Custom audiences and lookalike audiences
• Retargeting website visitors
• A/B testing creatives and audiences

Budget allocation rule: 70% proven channels, 20% new channels, 10% experiments`,
        durationMinutes: 55,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'What does SEO stand for?',
          options: ['Social Engine Optimization', 'Search Engine Optimization', 'Site Enhancement Operations', 'Search Engagement Options'],
          correctIndex: 1,
          explanation: 'SEO stands for Search Engine Optimization.',
        },
        {
          question: 'What is the average ROI for email marketing?',
          options: ['$5 for every $1', '$42 for every $1', '$10 for every $1', '$100 for every $1'],
          correctIndex: 1,
          explanation: 'Email marketing has an average ROI of $42 for every $1 spent.',
        },
        {
          question: 'Which platform is best for B2B marketing?',
          options: ['TikTok', 'Instagram', 'LinkedIn', 'Snapchat'],
          correctIndex: 2,
          explanation: 'LinkedIn is the best platform for B2B marketing and professional services.',
        },
        {
          question: 'What is the ideal meta description length for SEO?',
          options: ['50-60 characters', '150-160 characters', '200-300 characters', '80-100 characters'],
          correctIndex: 1,
          explanation: 'Meta descriptions should be 150-160 characters for optimal display in search results.',
        },
        {
          question: 'What is the recommended engagement rate for social media?',
          options: ['0.1-0.5%', '10-20%', '2-5%', '50%+'],
          correctIndex: 2,
          explanation: 'A good engagement rate for social media is between 2-5%.',
        },
      ],
    },
  },
  {
    title: 'Freelancing Success Blueprint',
    slug: 'freelancing-success-blueprint',
    description: 'Learn how to build a successful freelancing career. From finding clients to pricing your services, managing projects, and scaling your income.',
    category: 'business',
    level: 'beginner',
    skills: ['freelancing', 'client management', 'proposal writing', 'pricing', 'project management'],
    estimatedHours: 5,
    certificateTitle: 'Certified Freelance Professional',
    isPublished: true,
    lessons: [
      {
        title: 'Setting Up Your Freelance Profile',
        content: `Your freelance profile is your digital resume. It is the first thing clients see, so make it count.

Profile photo:
• Professional headshot with good lighting
• Friendly and approachable expression
• Clean background

Professional headline:
• Be specific: "React Developer specializing in e-commerce apps" not just "Web Developer"
• Include your niche and the value you provide

Bio/Overview:
• Start with the client's problem, not your skills
• Highlight relevant experience and achievements
• Include a clear call-to-action
• Keep it under 300 words

Portfolio:
• Show 3-5 of your best projects
• Include before/after results where possible
• Add case studies explaining your process
• Link to live projects or GitHub

Skills section:
• List both hard skills (React, Python) and soft skills (communication, problem-solving)
• Get endorsed by previous clients
• Take skill tests to verify your expertise

Rates:
• Research competitors in your niche
• Start slightly below market rate to build reviews
• Raise rates by 20% after every 5 positive reviews`,
        durationMinutes: 40,
        order: 1,
      },
      {
        title: 'Writing Winning Proposals',
        content: `A great proposal wins clients. A bad proposal gets ignored. Here is how to write proposals that convert.

Proposal structure:
1. Personalized opening (show you read their requirements)
2. Understanding of the problem
3. Your proposed solution
4. Why you are the best person for the job
5. Timeline and deliverables
6. Pricing and payment terms
7. Call to action

Common mistakes to avoid:
• Generic copy-paste proposals
• Starting with "I" instead of "You"
• Focusing on your skills instead of their needs
• Not addressing their specific requirements
• Being too long (keep it under 300 words)

Template:
"Hi [Name], I noticed you need [specific thing from their post]. I have helped [similar client type] achieve [specific result] — I think I can do the same for you.

My approach: [2-3 sentences on how you will solve their problem]

Deliverables: [bullet list of what they will receive]

Timeline: [realistic estimate]

I have attached [relevant portfolio piece]. Would love to discuss this further — feel free to message me."

Pricing tips:
• Always include pricing in your proposal
• Offer 3 packages (Basic, Standard, Premium)
• Justify your rates with value, not just time`,
        durationMinutes: 45,
        order: 2,
      },
      {
        title: 'Managing Clients and Scaling Income',
        content: `Getting clients is only half the battle. Keeping them happy and scaling your income is the other half.

Client communication:
• Respond within 2-4 hours during business hours
• Set clear expectations upfront
• Send weekly progress updates
• Use project management tools (Trello, Asana, Notion)
• Document everything in writing

Setting boundaries:
• Define scope clearly before starting
• Have a revision policy (2-3 revisions included)
• Charge for scope creep
• Set clear working hours
• Use contracts for all projects over $500

Getting paid:
• Require 50% upfront for new clients
• Use escrow/milestone payments for large projects
• Invoice immediately upon completion
• Follow up on late payments professionally

Scaling strategies:
• Specialize in a high-demand niche
• Raise your rates every 6 months
• Build a client referral system
• Create passive income (templates, courses, plugins)
• Hire subcontractors for overflow work
• Build long-term retainer relationships

Income milestones:
• $1,000/month: 1-2 regular clients
• $5,000/month: niche specialization + premium rates
• $10,000/month: retainer clients + productized services`,
        durationMinutes: 50,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 20,
      questions: [
        {
          question: 'What should your proposal start with?',
          options: ['Your skills and experience', 'Your price', 'The client\'s problem and needs', 'Your portfolio link'],
          correctIndex: 2,
          explanation: 'Great proposals start by addressing the client\'s specific problem, not your skills.',
        },
        {
          question: 'How much upfront payment should you require from new clients?',
          options: ['10%', '25%', '50%', '100%'],
          correctIndex: 2,
          explanation: '50% upfront is standard practice to protect against non-payment.',
        },
        {
          question: 'How often should you raise your freelance rates?',
          options: ['Every month', 'Every 6 months', 'Every 5 years', 'Never'],
          correctIndex: 1,
          explanation: 'You should raise your rates every 6 months as you gain more experience and reviews.',
        },
        {
          question: 'What is the ideal length for a freelance proposal?',
          options: ['Under 50 words', 'Under 300 words', '500-1000 words', '2000+ words'],
          correctIndex: 1,
          explanation: 'Proposals should be concise and under 300 words. Clients are busy and value clarity.',
        },
        {
          question: 'What should you do when a client requests work outside the original scope?',
          options: ['Do it for free to keep them happy', 'Refuse the work', 'Charge for scope creep', 'Ignore the request'],
          correctIndex: 2,
          explanation: 'Charging for scope creep protects your time and teaches clients to respect boundaries.',
        },
      ],
    },
  },
  {
    title: 'Python Programming for Beginners',
    slug: 'python-programming-beginners',
    description: 'Learn Python from zero to hero. Build real applications, automate tasks, and prepare for a career in data science or backend development.',
    category: 'web-development',
    level: 'beginner',
    skills: ['python', 'programming', 'automation', 'data analysis'],
    estimatedHours: 10,
    certificateTitle: 'Certified Python Developer',
    isPublished: true,
    lessons: [
      {
        title: 'Python Basics: Variables and Data Types',
        content: `Python is one of the most popular programming languages in the world. It is used for web development, data science, AI, automation, and more.

Why Python?
• Easy to read and write (closest to English)
• Huge community and libraries
• Used by Google, Netflix, Instagram, NASA

Variables:
name = "Ahmed"
age = 25
height = 5.9
is_freelancer = True

Data types:
• str: "Hello World"
• int: 42
• float: 3.14
• bool: True/False
• list: [1, 2, 3]
• dict: {"name": "Ahmed", "age": 25}
• tuple: (1, 2, 3) — immutable list

String operations:
name = "linkify"
print(name.upper())      # LINKIFY
print(name.capitalize()) # Linkify
print(len(name))         # 7
print(f"Hello, {name}!") # Hello, linkify! — f-strings

Practice: Create variables for your name, age, skills (list), and profile (dict).`,
        durationMinutes: 45,
        order: 1,
      },
      {
        title: 'Control Flow and Functions',
        content: `Control flow determines the order in which your code runs. Functions are reusable blocks of code.

If/elif/else:
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

Loops:
# For loop
for skill in ["Python", "Django", "React"]:
    print(f"I know {skill}")

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# List comprehension (Pythonic way)
squares = [x**2 for x in range(10)]

Functions:
def calculate_freelance_rate(hourly_rate, hours, tax_rate=0.2):
    gross = hourly_rate * hours
    net = gross * (1 - tax_rate)
    return net

payment = calculate_freelance_rate(50, 40)
print(f"Net payment: \${payment}")

Practice: Write a function that takes a list of skills and returns only the ones that match a job's requirements.`,
        durationMinutes: 60,
        order: 2,
      },
      {
        title: 'File Handling and APIs',
        content: `Python makes it easy to work with files and external APIs.

File handling:
# Reading a file
with open("jobs.txt", "r") as file:
    content = file.read()
    print(content)

# Writing to a file
with open("report.txt", "w") as file:
    file.write("Job Report\\n")
    file.write("Total: 50 jobs\\n")

# Working with JSON
import json
with open("data.json", "r") as f:
    data = json.load(f)

Working with APIs using requests:
import requests

response = requests.get("https://api.example.com/jobs")
jobs = response.json()

for job in jobs:
    print(f"Title: {job['title']}, Budget: ${job['budget']}")

# POST request
new_job = {"title": "Python Developer", "budget": 500}
response = requests.post("https://api.example.com/jobs", json=new_job)
print(response.status_code)

Automation example:
import os
import shutil

# Organize downloads folder by file type
downloads = os.listdir("Downloads")
for file in downloads:
    if file.endswith(".pdf"):
        shutil.move(f"Downloads/{file}", "Documents/PDFs/{file}")

Practice: Write a script that reads a list of job titles from a file and checks which ones match your skills.`,
        durationMinutes: 75,
        order: 3,
      },
    ],
    assessment: {
      passingScore: 70,
      timeLimitMinutes: 25,
      questions: [
        {
          question: 'Which data type would you use to store a list of skills in Python?',
          options: ['str', 'int', 'list', 'bool'],
          correctIndex: 2,
          explanation: 'A list is used to store multiple items in a single variable.',
        },
        {
          question: 'What does the "def" keyword do in Python?',
          options: ['Defines a variable', 'Defines a function', 'Imports a module', 'Creates a loop'],
          correctIndex: 1,
          explanation: 'The "def" keyword is used to define a function in Python.',
        },
        {
          question: 'Which Python library is used to make HTTP requests to APIs?',
          options: ['os', 'json', 'requests', 'math'],
          correctIndex: 2,
          explanation: 'The "requests" library is the most popular way to make HTTP requests in Python.',
        },
        {
          question: 'What is a list comprehension in Python?',
          options: ['A type of loop', 'A way to create lists in one line', 'A function definition', 'A file reading method'],
          correctIndex: 1,
          explanation: 'List comprehension is a concise way to create lists in a single line of code.',
        },
        {
          question: 'Which statement is used to open and automatically close files in Python?',
          options: ['open()', 'with open()', 'file.open()', 'read_file()'],
          correctIndex: 1,
          explanation: '"with open()" is the recommended way to handle files as it automatically closes the file.',
        },
      ],
    },
  },
];

const seedCourses = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let created = 0;
    let skipped = 0;

    for (const courseData of courses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      if (existing) {
        console.log(`✓ Already exists: ${courseData.title}`);
        skipped++;
      } else {
        await Course.create(courseData);
        console.log(`✅ Created: ${courseData.title}`);
        created++;
      }
    }

    console.log(`\n🎓 Learning Hub seeded successfully!`);
    console.log(`   Created: ${created} courses`);
    console.log(`   Skipped: ${skipped} courses (already exist)`);
    console.log(`\n📚 Courses available:`);
    courses.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.title} (${c.level} · ${c.lessons.length} lessons · ${c.assessment.questions.length} questions)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
