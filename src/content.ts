// ============================================================
//  ARYANP.DEV — CONTENT CONFIGURATION
//  Edit this file to update everything on your site.
//  No code knowledge needed — just change the text values.
// ============================================================

// ── SITE CONFIG ─────────────────────────────────────────────
export const siteConfig = {
  name: 'Aryan Prabhudesai',
  initials: 'AP',
  profileImage: '/me.jpg',
  tagline: 'Building things that matter.',
  subTagline: 'First year Mathematics student at the University of Warwick. I like elegant proofs, clean code, and problems worth solving.',
  email: 'prabaryan@outlook.com',
  location: 'Stanmore, London, UK',
  locationFlag: '🇬🇧',
  availabilityStatus: 'open' as 'open' | 'busy' | 'custom',
  availabilityText: 'Open to opportunities',
  resumeUrl: '/resume.pdf',
  siteUrl: 'https://aryanp.dev',
  siteTitle: 'Aryan Prabhudesai — Mathematician & Developer',
  siteDescription: 'First year Mathematics student at the University of Warwick. I like elegant proofs, clean code, and problems worth solving.',
  accentColor: '#0A0A0A',
};

// ── SOCIAL LINKS ─────────────────────────────────────────────
export const socialLinks = [
  { platform: 'GitHub',   url: 'https://github.com/Prabbie9/',         icon: 'github'   },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/aryan-prabhudesai-599831286',    icon: 'linkedin' },
  { platform: 'Email',    url: 'mailto:prabaryan@outlook.com', icon: 'mail' },
];

// ── ABOUT ─────────────────────────────────────────────────────
export const aboutContent = {
  bio: [
    'I\'m a first-year Maths student at the University of Warwick. I am very passionate about maths, as well as machine learning and mathematical modelling.'
  ],
  photo: '',
  photoAlt: 'Aryan Prabhudesai',
  currently: {
    studying:  'G100 Mathematics at Warwick',
    building:  'This website',
    reading:   'Sapiens - Yuval Noah Harari',
    listening: "Dhurandar: The Revenge songs",
    videoUrl: "https://www.youtube.com/watch?v=9W00iOJ6oPg&list=RD9W00iOJ6oPg&start_radio=1",
  },
  milestones: [
    { year: '2025', event: 'Started G100 Mathematics at the University of Warwick.' },
    { year: '2025', event: 'Finished A-Levels' },
    { year: '2023', event: 'Finished GCSE\'s.' },
  ],
};

// ── ACADEMICS ─────────────────────────────────────────────────
export const academics = [
  {
    name: 'University of Warwick',
    degree: 'Bachelor of Science',
    field: 'Mathematics (G100)',
    years: '2025 – Present',
    gpa: '',
    visible: true,
    semesters: [
      {
        name: 'Year 1 — 2025/26',
        gpa: '91% Average SO FAR',
        visible: true,
        defaultOpen: false,
        courses: [
          { name: 'Analysis I', code: 'MA141', grade: '86%', CATS: 10, visible: true },
          { name: 'Analysis II', code: 'MA139', grade: 'TBC', CATS: 15, visible: true },
          { name: 'Algebra I', code: 'MA151', grade: 'TBC', CATS: 10,  visible: true },
          { name: 'Algebra II', code: 'MA150', grade: 'TBC', CATS: 15,  visible: true },
          { name: 'Foundations', code: 'MA132', grade: 'TBC', CATS: 10,  visible: true },
          { name: 'Methods of Mathematical Modelling I',code: 'MA146', grade: 'TBC', CATS: 10, visible: true },
          { name: 'Methods of Mathematical Modelling II',code: 'MA144', grade: 'TBC', CATS: 10, visible: true },
          { name: 'Maths By Computer',code: 'MA124', grade: 'TBC', CATS: 10, visible: true },
          { name: 'Programming for Scientists',code: 'MA117', grade: '97%', CATS: 10, visible: true },
          { name: 'Introduction to Probability',code: 'ST120', grade: 'TBC', CATS: 10, visible: true },
          { name: 'Statistical Laboratory',code: 'MA121', grade: 'TBC', CATS: 10, visible: true },
        ],
      },
    ],
  },
  {
    name: 'Haberdashers\' Boys\' School',
    degree: 'A-Levels & GCSEs',
    field: 'Secondary Education',
    years: '2016 – 2025',
    gpa: '',
    visible: true,
    semesters: [
      {
        name: 'Competitions',
        gpa: '',
        visible: true,
        courses: [
          { name: 'British Mathematical Olympiad (BMO1)', code: 'UKMT', grade: 'Merit', CATS: '', visible: true },
          { name: 'Senior Maths Challenge', code: 'UKMT', grade: 'Gold', CATS: '', visible: true },
          { name: 'Senior Physics Challenge', code: 'BPhO', grade: 'Gold', CATS: '', visible: true },
        ],
      },
      {
        name: 'A-Levels — 2025',
        gpa: 'A* A* A* A', 
        visible: true,
        courses: [
          { name: 'Mathematics', code: 'OCR A', grade: 'A*', CATS: '', visible: true },
          { name: 'Further Mathematics', code: 'OCR A', grade: 'A*', CATS: '', visible: true },
          { name: 'Physics', code: 'AQA', grade: 'A*', CATS: '', visible: true },
          { name: 'Economics', code: 'Edexcel A', grade: 'A', CATS: '', visible:true},

        ],
      },
      {
        name: 'GCSEs — 2023',
        gpa: '9 Grade 9s and 1 Grade 8', // Optional summary
        visible: true,
        courses: [
          { name: 'Mathematics', code: 'Edexcel', grade: '9', CATS: '', visible: true },
          { name: 'Further Mathematics', code: 'Edexcel', grade: '9', CATS: '', visible: true },
          { name: 'Physics', code: 'Edexcel', grade: '9', CATS: '', visible: true },
          { name: 'Chemistry', code: 'Edexcel', grade: '9', CATS: '', visible: true },
          { name: 'Biology', code: 'Edexcel', grade: '9', CATS: '', visible: true },
          { name: 'English Literature', code: 'AQA', grade: '9', CATS: '', visible: true },
          { name: 'English Language', code: 'AQA', grade: '8', CATS: '', visible: true },
          { name: 'Computer Science', code: 'CIE', grade: '9', CATS: '', visible: true },
          { name: 'Spanish', code: 'CIE', grade: '9', CATS: '', visible: true },
          { name: 'Geography', code: 'WJEC', grade: '9', CATS: '', visible: true },
        ],
      },
    ],
  },
];

// ── PROJECTS ──────────────────────────────────────────────────
export const projects = [
  {
    title: 'aryanp.dev',
    slug: 'aryanp-dev',
    shortDesc: 'This site. Built with Next.js, Tailwind, and Framer Motion. And of course, my special friend Claude.',
    description: 'This site. Built with Next.js, Tailwind, and Framer Motion. And of course, my special friend Claude. Designed to be easy to use, streamlined, and clean.',
    techStack: ['Claude','Prompt Engineering'],
    category: 'Web',
    githubUrl: '',
    link: '',
    featured: false,
    visible: true,
  },
  {
    title: 'Year 1 Module Marks',
    slug: 'year-1-module-marks',
    shortDesc: 'A site to quickly display my Year results.',
    description: 'A site to quickly display my Year results. Meant to be easy to visualise',
    techStack: ['Python'],
    category: 'Web',
    githubUrl: '',
    link: 'https://year1marks-aprabs-v1-0-0.streamlit.app/',
    featured: true,
    visible: true,
  },
  {
    title: 'M3 submission 2025',
    slug: 'm3-submission-2025',
    shortDesc: 'My team\'s paper for 2025\'s SIAM MathWorks Math Modelling Challenge, where we won $3500.',
    description: 'Placed 2nd globally out of 794 teams in the SIAM MathWorks Math Modelling Challenge (sponsored by Jane Street) for technical computing, winning a total of $3,500 for my team and a free trip to New York to present to a panel of PhD mathematicians. For the challenge, we modelled indoor temperature and power outages in Birmingham.',
    techStack: ['Python', 'Teamwork', 'Maths', 'Presenting'],
    category: 'Written',
    githubUrl: '',
    link: 'https://m3challenge.siam.org/wp-content/uploads/TC-RUNNER-UP_Team17705_2025.pdf',
    featured: true,
    visible: true,
  },
  {
    title: 'M3 submission 2024',
    slug: 'm3-submission-2024',
    shortDesc: 'My team\'s paper for 2024\'s SIAM MathWorks Math Modelling Challenge, where we won $1500.',
    description: 'Placed 1st nationally and 7th - 12th globally in SIAM MathWorks Math Modelling Challenge, winning $1,500 for my team. ',
    techStack: ['Python', 'Teamwork', 'Maths', 'Presenting'],
    category: 'Written',
    githubUrl: '',
    link: '',
    featured: false,
    visible: true,
  },
  {
    title: 'Machine Learning Project 2026',
    slug: 'machine-learning-project-2026',
    shortDesc: 'A machine learning project, undertaken in a team of 5 over the course of 20 weeks.',
    description: 'As part of my python module, my team and I undertook a machine learning project over the course of 20 weeks. We used and compared different models in different applications (from breast cancer cells to hexapawn).',
    techStack: ['Python', 'Teamwork', 'Maths', 'Presenting'],
    category: 'Written',
    githubUrl: '',
    link: '/Machine_Learning_Project.pdf',
    featured: false,
    visible: true,
  },


  // Add your own projects here — copy the block above and fill in your details
];

// ── BLOG POSTS ────────────────────────────────────────────────
export const blogPosts = [
  // Add blog posts here when you're ready to write
  // Copy this template:
  // {
  //   title: 'My Post Title',
  //   slug: 'my-post-title',
  //   excerpt: 'Short summary shown in listings.',
  //   tags: ['Maths', 'University'],
  //   publishedAt: '2025-01-15',
  //   readTime: 5,
  //   published: true,
  //   content: `
  // # My Post Title
  // Your content here in Markdown.
  //   `,
  // },
  {
  title: 'Testing Blog',
  slug: 'testing-blog',
  excerpt: 'Short test summary.',
  tags: ['Test', 'Aryan'],
  publishedAt: '2026-04-01',
  readTime: '2',
  content: `# My Post Title
  Your content here in Markdown.`,
  published: true,
  },
  {
  title: 'Plagiarised Blog',
  slug: 'plagiarising-blog',
  excerpt: 'Short test summary.',
  tags: ['Test', 'Aryan'],
  publishedAt: '2026-04-01',
  readTime: '2',
  content: `
# Gyokeres the saviour: How Arsenal's striker led Sweden from fiasco to World Cup fairy tale

"We're not giving our best, we're not fully focused on defence and passing," Viktor Gyokeres exclaimed in October after Sweden fell to yet another defeat in World Cup qualifying. "This has to do with attitude. We didn't deserve anything. Of course, it's a fiasco."

At that point, Sweden were winless and bottom of their group. Now, four months later, his shirt off, a grin plastered on his face, and chased by the entire Swedish team, the Arsenal striker is sprinting towards this summer's World Cup.

We are in Stockholm. It is seconds after Sweden's 3-2 win over Poland in the European play-offs final, secured by Gyokeres' 88th-minute winner.

"It was like an out-of-body experience," said the English head coach. "Am I really here?"

At the other end, Robert Lewandowski crouches down, knowing this could be his final World Cup campaign.

How did we get here? Gyokeres did what Lewandowski could not.

"It was indescribable," he said. "It's just a relief and a joy."

This has been a gruelling qualification for Sweden.

"It's weird," the coach said. "I've spent months thinking about two games."

Gyokeres had been under pressure:

"There's always something."

But when it mattered most, he delivered.

"There was zero chance of taking him off," the coach said. "He can score at any moment."

"It's very exciting," Gyokeres said. "I'm really looking forward to it."

"We're going to the World Cup, baby."

And then they started to jump around.
`,
  published: true,
}
];

// ── RESUME ─────────────────────────────────────────────────────
export const resumeData = {
  sections: [
    {
      title: 'Education',
      visible: true,
      items: [
        {
          title: 'BSc Mathematics (G100)',
          organization: 'University of Warwick',
          location: 'Coventry, England',
          startDate: 'Oct 2025',
          endDate: 'Jun 2028',
          description: 'First year student. Modules listed in "Academic" section.',
          link: '',
          active: true,
          visible: true,
        },
      ],
    },
    {
      title: 'Work Experience', // <--- Add this new block!
      visible: true,
      items: [
        {
          title: 'Work Experience', // Change to your actual role
          organization: 'Barclays',
          location: 'London, UK',
          startDate: 'March 2026',
          endDate: 'March 2026',
          description: 'Gained career advice from industry-leading professionals.',
          link: 'https://barclays.co.uk',
          active: true,
          hideLine: false,
          visible: true,
        },
        {
          title: 'Work Experience', // Change to your actual role
          organization: 'Accomplish',
          location: 'Remote',
          startDate: 'June 2023',
          endDate: 'June 2023',
          description: 'Introduction to how financial transactions are managed by technology. Presented to Founder and Board Member on payment methods. Researched and compiled a catalogue of target client banks in Luxembourg. ',
          link: 'https://accomplish.com',
          active: true,
          hideLine: false,
          visible: true,
        },
        {
          title: 'Vodafone Innovators Program', // Change to your actual role
          organization: 'Vodafone',
          location: 'Remote',
          startDate: 'June 2023',
          endDate: 'June 2023',
          description: ' Online selective Vodafone work experience in engineering and technology. Top 30 presentation; received a prize for final presentation.',
          link: 'https://vodafone.com',
          active: true,
          hideLine: false,
          visible: true,
        },
        // You can add more jobs here...
      ],
    },
  ],
};

// ── SKILLS ─────────────────────────────────────────────────────
export const skills = [
  { name: 'Python', category: 'Programming', visible: true },
  { name: 'R', category: 'Programming', visible: true },
  { name: 'Java', category: 'Programming', visible: true },
  { name: 'Differential Equations', category: 'Mathematics', visible: true },
  { name: 'Analysis', category: 'Mathematics', visible: true },
  { name: 'Linear Algebra', category: 'Mathematics', visible: true },
  { name: 'Proof Writing', category: 'Mathematics', visible: true },
  { name: 'Teamwork', category: 'Soft skills', visible: true },
  { name: 'Resilience', category: 'Soft skills', visible: true },
];

export const customPages = [
  {
    slug: 'notes',
    title: 'Notes',
    showInNav: true,
    content: `# Notes\n\nWorking so far...`,
  },
];

export const musicPlaylist = [
  {
    title: 'Aakhri Ishq',
    artist: 'Shashwat Sachdev',
    url: 'https://img.youtube.com/vi/9W00iOJ6oPg/maxresdefault.jpg',
    thumbnail: 'https://img.youtube.com/vi/9W00iOJ6oPg/maxresdefault.jpg'
  },
  // add as many as you want
  {
    title: 'Hum Pyaar Karne Wale',
    artist: 'Shashwat Sachdev',
    url: 'https://www.youtube.com/watch?v=OVHkruv-dg8',
    thumbnail: 'https://img.youtube.com/vi/OVHkruv-dg8/maxresdefault.jpg', 
  },
  {
    title: 'Phir Se',
    artist: 'Shashwat Sachdev',
    url: 'https://www.youtube.com/watch?v=Go4GQQRwEc8&list=RDGo4GQQRwEc8&start_radio=1',
    thumbnail: 'https://img.youtube.com/vi/Go4GQQRwEc8/maxresdefault.jpg',
  },
  {
    title: 'Let Her Go',
    artist: 'Passenger, Ed Sheeran',
    url: 'https://www.youtube.com/watch?v=HTcL9WkB_wg&list=RDHTcL9WkB_wg&start_radio=1',
    thumbnail: 'https://img.youtube.com/vi/HTcL9WkB_wg/maxresdefault.jpg',
  },
];

