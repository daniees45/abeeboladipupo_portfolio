/**
 * Resume templates and structured profile data for Abeeb Oladipupo.
 *
 * Provides 4 targeted career tracks for early-career opportunities:
 * 1. Software Development & Backend: Core programming, Java/Spring Boot, Python, REST APIs, and Clean Architecture.
 * 2. Systems & Cybersecurity: Cisco cybersecurity credential, Linux hardening, RBAC, JWT, network fundamentals, and threat modeling.
 * 3. IT Infrastructure & Linux: System administration, Bash scripting, hardware/software troubleshooting, and networking.
 * 4. Data Systems & SQL: Database modeling, PostgreSQL/MySQL, query tuning, and constraint satisfaction optimization.
 */

export interface ResumeExperience {
  role: string
  company: string
  location: string
  period: string
  highlights: string[]
}

export interface ResumeProject {
  name: string
  description: string
  technologies: string[]
}

export interface ResumeEducation {
  degree: string
  institution: string
  period: string
  details?: string
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export interface ResumeTemplate {
  id: 'software-developer' | 'systems-cybersecurity' | 'it-infrastructure' | 'data-sql'
  name: string
  targetRole: string
  badge: string
  description: string
  accentColor: string
  contact: {
    fullName: string
    email: string
    location: string
    linkedin: string
    github: string
    website: string
  }
  summary: string
  skills: ResumeSkillCategory[]
  experience: ResumeExperience[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  certifications: string[]
}

export const resumeTemplates: Record<ResumeTemplate['id'], ResumeTemplate> = {
  'software-developer': {
    id: 'software-developer',
    name: 'Software Development & Backend',
    targetRole: 'Software Developer / Backend Engineer',
    badge: 'Software & Backend',
    description: 'Emphasizes core programming, Java & Python backend services, relational database design, and Clean Architecture.',
    accentColor: '#0284c7', // Sky / Cyan
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'Available for Full-Time Roles • Relocation / Remote Ready',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://www.abeeboladipupo.com',
    },
    summary:
      'Computer Science graduate with strong foundations in object-oriented programming, data structures, algorithms, and backend systems. Experienced in building production-ready RESTful APIs with Java / Spring Boot and Python / Flask, architecting normalized PostgreSQL & MySQL schemas, and developing reactive frontends with TypeScript and React. Proven capability delivering complex software systems, including an AI constraint-satisfaction scheduling engine and an academic supervision platform.',
    skills: [
      {
        category: 'Programming Languages',
        items: ['Java (21)', 'Python (3.x)', 'TypeScript', 'JavaScript (ES6+)', 'SQL', 'Bash / Shell'],
      },
      {
        category: 'Backend & Frameworks',
        items: ['Spring Boot 3', 'Spring Data JPA', 'Flask', 'RESTful API Design', 'Hibernate / ORM', 'Maven'],
      },
      {
        category: 'Databases & Storage',
        items: ['PostgreSQL', 'MySQL', 'Redis (Caching)', 'Schema Design (3NF)', 'Flyway Migrations'],
      },
      {
        category: 'Frontend & Tools',
        items: ['React 19', 'Tailwind CSS', 'Docker', 'Git / GitHub', 'Linux (Ubuntu/Debian)', 'Vite'],
      },
    ],
    experience: [
      {
        role: 'Software Developer (Projects & Engineering)',
        company: 'Academic & Independent Systems Development',
        location: 'Accra / Remote',
        period: '2023 — Present',
        highlights: [
          'Architected and implemented a multi-tenant FYP supervision platform serving students, supervisors, and department heads with role-gated workflows.',
          'Engineered an automated course timetabling engine in Python applying Constraint Satisfaction Problem (CSP) backtracking heuristics to eliminate scheduling clashes.',
          'Developed a Clean Architecture portfolio backend in Spring Boot 3 with OAuth2/JWT verification, Redis cache-aside, and Bucket4j rate limiting.',
          'Designed relational database schemas with foreign keys, composite indexes, and transactional boundaries to maintain data integrity.',
        ],
      },
      {
        role: 'Computer Science Department IT & Lab Assistant',
        company: 'Valley View University',
        location: 'Accra, Ghana',
        period: '2022 — 2024',
        highlights: [
          'Assisted students with debugging code, algorithm design, and database queries in Java, Python, and SQL lab sessions.',
          'Maintained department computer lab machines, installed developer toolchains, and ensured operating system and network stability.',
          'Contributed to departmental documentation, lab manuals, and automated setup scripts for programming coursework.',
        ],
      },
    ],
    projects: [
      {
        name: 'Final Year Project (FYP) Supervision System',
        description: 'Role-based academic research project lifecycle platform. Gated access for Students, Supervisors, and HODs, proposal approvals, document versioning, and topic similarity checks.',
        technologies: ['Python', 'Flask', 'React', 'MySQL', 'JWT', 'RBAC'],
      },
      {
        name: 'AI-Powered Timetabling System (CSP Engine)',
        description: 'Automated academic scheduling system resolving multi-constraint variables: room capacities, lecturer time slots, course conflicts, and student enrollments.',
        technologies: ['Python', 'CSP Algorithms', 'Flask API', 'MySQL'],
      },
      {
        name: 'Full-Stack Engineering & Security Platform',
        description: 'Clean Architecture service with Spring Boot 3, PostgreSQL, Flyway, Redis cache-aside, and interactive simulation sandboxes.',
        technologies: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Valley View University',
        period: 'Graduated 2024',
        details: 'Evaluated by World Education Services (WES). Coursework: Software Engineering, Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems, Systems Analysis.',
      },
    ],
    certifications: [
      'Cisco: Introduction to Cybersecurity',
      'World Education Services (WES) Verified Academic Credential',
    ],
  },

  'systems-cybersecurity': {
    id: 'systems-cybersecurity',
    name: 'Systems & Cybersecurity',
    targetRole: 'Cybersecurity Analyst / Security Specialist / Systems Engineer',
    badge: 'Systems & Security',
    description: 'Highlights security-first engineering, Cisco credentials, Linux hardening, authentication (JWT/RBAC), and network security.',
    accentColor: '#10b981', // Emerald
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'Available for Full-Time Roles • Relocation / Remote Ready',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://www.abeeboladipupo.com',
    },
    summary:
      'Computer Science graduate with formal training in cybersecurity principles, system security, and defensive infrastructure. Holds Cisco Introduction to Cybersecurity certification with practical experience implementing Role-Based Access Control (RBAC), OAuth2/OIDC token validation, cryptographic password hashing (bcrypt), and OWASP defensive coding. Proficient with Linux system security, firewall configuration (UFW), SSH key hardening, and network protocol analysis.',
    skills: [
      {
        category: 'Security & Defensive Practices',
        items: ['OWASP Top 10 Mitigation', 'Role-Based Access Control (RBAC)', 'JWT / OAuth2 / OIDC', 'Password Hashing (bcrypt/Argon2)', 'Input Sanitization', 'Audit Logging'],
      },
      {
        category: 'Operating Systems & Hardening',
        items: ['Linux (Ubuntu/Debian)', 'File Permissions & ACLs', 'SSH Key Authentication', 'UFW / iptables', 'Systemd Services', 'Process Monitoring'],
      },
      {
        category: 'Network Fundamentals',
        items: ['TCP/IP Model', 'DNS & TLS/SSL', 'Wireshark Packet Analysis', 'Subnetting & CIDR', 'HTTP/S Protocols', 'Nmap Scanning'],
      },
      {
        category: 'Software & Infrastructure',
        items: ['Python', 'Java', 'SQL (Preventing SQLi)', 'Docker Container Isolation', 'Git', 'Bash Scripting'],
      },
    ],
    experience: [
      {
        role: 'Systems & Security Software Projects',
        company: 'Independent Systems & Security Labs',
        location: 'Remote',
        period: '2023 — Present',
        highlights: [
          'Engineered secure authentication architectures with stateless JWT tokens, HTTP-only cookie storage, and automated token expiration checks.',
          'Configured and hardened virtual Linux servers using UFW firewalls, SSH key pairs, disabled root login, and automated log inspection.',
          'Conducted simulated OWASP vulnerability assessments across web applications, successfully remediating SQL injection and cross-site scripting (XSS) vectors.',
          'Built tamper-evident audit logging mechanisms tracking all privileged administrative mutations with actor identity and timestamp records.',
        ],
      },
      {
        role: 'IT & Lab Systems Support',
        company: 'Valley View University Computer Labs',
        location: 'Accra, Ghana',
        period: '2022 — 2024',
        highlights: [
          'Assisted in maintaining network security policies across campus lab workstations, preventing unauthorized software installations.',
          'Monitored local network connectivity, IP address assignments (DHCP), and DNS resolution across 40+ networked client machines.',
          'Guided students on secure coding practices, safe credential storage, and protection against common social engineering attacks.',
        ],
      },
    ],
    projects: [
      {
        name: 'Secure Multi-Tenant FYP Supervision System',
        description: 'Engineered strict Role-Based Access Control (RBAC) ensuring Students, Supervisors, and HODs only access authorized endpoints and document records.',
        technologies: ['Python', 'Flask', 'RBAC', 'JWT', 'MySQL', 'OWASP Standards'],
      },
      {
        name: 'Clean Architecture API with Security Audit Logging',
        description: 'Spring Boot 3 API with OIDC JWT authorization, Bucket4j IP rate limiting, and immutable audit logs capturing every state change.',
        technologies: ['Java 21', 'Spring Security', 'OIDC', 'Audit Trail', 'PostgreSQL'],
      },
      {
        name: 'Linux Security & Systems Labs',
        description: 'Hands-on hardening lab configs: UFW rules, SSH key pairs, systemd sandboxing, permission matrix audit, and network packet capture.',
        technologies: ['Linux', 'UFW', 'SSH', 'Wireshark', 'Bash'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Valley View University',
        period: 'Graduated 2024',
        details: 'Evaluated by World Education Services (WES). Coursework: Computer Security, Computer Networks, Operating Systems, Cryptography Foundations.',
      },
    ],
    certifications: [
      'Cisco: Introduction to Cybersecurity',
      'World Education Services (WES) Verified Academic Credential',
    ],
  },

  'it-infrastructure': {
    id: 'it-infrastructure',
    name: 'IT Infrastructure & Linux',
    targetRole: 'IT Support Specialist / Systems Administrator / Infrastructure Associate',
    badge: 'IT & Infrastructure',
    description: 'Emphasizes hands-on hardware/software troubleshooting, Linux OS administration, Bash automation, and network support.',
    accentColor: '#6366f1', // Indigo
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'Available for Full-Time Roles • Relocation / Remote Ready',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://www.abeeboladipupo.com',
    },
    summary:
      'Computer Science graduate with practical experience in IT support, computer lab administration, Linux system configuration, and network troubleshooting. Skilled in resolving operating system errors, setting up local area networks (LANs), configuring user accounts and file permissions, and automating routine administrative tasks with Bash scripts. Patient communicator dedicated to minimizing user downtime and maintaining dependable IT infrastructure.',
    skills: [
      {
        category: 'Operating Systems & Administration',
        items: ['Linux (Ubuntu, Debian)', 'Windows 10 / 11 / Server Basics', 'User & Group Management', 'Package Management (apt)', 'Systemd & Cron'],
      },
      {
        category: 'Networking & Hardware',
        items: ['LAN Setup & Cabling', 'TCP/IP, DHCP & DNS Configuration', 'Router & Switch Basics', 'Hardware Diagnostics & Repair', 'Peripherals Support'],
      },
      {
        category: 'Scripting & Automation',
        items: ['Bash Shell Scripting', 'Python Automation', 'Git Version Control', 'Automated Backups', 'Environment Setup Scripts'],
      },
      {
        category: 'Support & Collaboration',
        items: ['Technical Troubleshooting', 'Help Desk / Ticketing Workflows', 'User Training & Documentation', 'Remote Desktop Support'],
      },
    ],
    experience: [
      {
        role: 'Computer Systems & IT Lab Assistant',
        company: 'Valley View University Computer Science Department',
        location: 'Accra, Ghana',
        period: '2022 — 2024',
        highlights: [
          'Provided front-line technical support for 150+ students and faculty members across departmental computer laboratories.',
          'Diagnosed and resolved hardware issues (RAM faults, storage drives, power supplies) and software configuration errors.',
          'Configured static and DHCP network interfaces, verified default gateway routing, and resolved DNS resolution problems.',
          'Wrote Bash automation scripts to reset lab machine states, clean temporary directories, and verify network connectivity before classes.',
        ],
      },
      {
        role: 'Independent Systems & Infrastructure Projects',
        company: 'Self-Directed Engineering Labs',
        location: 'Remote',
        period: '2023 — Present',
        highlights: [
          'Configured Linux virtual machines hosting web applications, database instances, and reverse proxy servers.',
          'Implemented automated scheduled database backups using cron jobs and shell scripts with compression and retention policies.',
          'Configured Docker containers to isolate development environments and maintain reproducible service execution.',
        ],
      },
    ],
    projects: [
      {
        name: 'Automated Lab Maintenance & Health Check Scripts',
        description: 'Suite of Bash scripts checking disk usage, memory pressure, network gateway availability, and reporting alerts.',
        technologies: ['Bash', 'Linux', 'Cron', 'Systemd'],
      },
      {
        name: 'Multi-Service Containerized Environment',
        description: 'Docker Compose configuration running application servers, PostgreSQL databases, and Redis caching with isolated networks.',
        technologies: ['Docker', 'Linux', 'Networking', 'PostgreSQL'],
      },
      {
        name: 'Academic Supervision & Scheduling Systems Support',
        description: 'Managed local database installations, environment variables, and client-server connectivity for university projects.',
        technologies: ['MySQL', 'Python', 'Linux', 'Apache/Nginx'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Valley View University',
        period: 'Graduated 2024',
        details: 'Evaluated by World Education Services (WES). Coursework: Computer Architecture, Operating Systems, Computer Networks, Systems Administration Foundations.',
      },
    ],
    certifications: [
      'Cisco: Introduction to Cybersecurity',
      'World Education Services (WES) Verified Academic Credential',
    ],
  },

  'data-sql': {
    id: 'data-sql',
    name: 'Data Systems & SQL',
    targetRole: 'Database Developer / Data Analyst / SQL Specialist',
    badge: 'Data & SQL Systems',
    description: 'Emphasizes relational schema design (3NF), complex SQL queries, index optimization, and algorithm-driven constraint solving.',
    accentColor: '#f59e0b', // Amber
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'Available for Full-Time Roles • Relocation / Remote Ready',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://www.abeeboladipupo.com',
    },
    summary:
      'Computer Science graduate with deep focus on relational database design, SQL query engineering, data integrity, and constraint-satisfaction algorithms. Proficient in PostgreSQL and MySQL, schema normalization (3NF), indexing strategies, transactional isolation (ACID), and Flyway database migrations. Experienced in modeling complex real-world data systems, including university timetable scheduling constraints and multi-entity academic workflows.',
    skills: [
      {
        category: 'Databases & Querying',
        items: ['PostgreSQL', 'MySQL', 'Advanced SQL (Joins, Aggregations, CTEs, Window Functions)', 'Schema Normalization (1NF to 3NF)', 'Query Indexing & EXPLAIN'],
      },
      {
        category: 'Data Integrity & Architecture',
        items: ['ACID Transactions', 'Foreign Key Constraints', 'Cascade Rules', 'Flyway Migrations', 'Redis Cache-Aside Patterns'],
      },
      {
        category: 'Algorithms & Modeling',
        items: ['Constraint Satisfaction Problems (CSP)', 'Backtracking Heuristics', 'Relational Entity-Relationship Modeling (ERD)', 'Data Cleansing & Validation'],
      },
      {
        category: 'Programming & Analysis',
        items: ['Python (Pandas basics)', 'Java (Spring Data JPA / Hibernate)', 'CSV / JSON Data Pipelines', 'REST Data APIs'],
      },
    ],
    experience: [
      {
        role: 'Data & Database Systems Developer',
        company: 'Academic & Applied Data Projects',
        location: 'Remote',
        period: '2023 — Present',
        highlights: [
          'Engineered a multi-table normalized relational database for an AI timetabling system modeling courses, lecturers, room capacities, and time slots.',
          'Formulated complex SQL queries with multiple JOINs, group-by aggregations, and subqueries to detect timetable clashes and capacity bottlenecks.',
          'Authored Flyway database migration scripts ensuring repeatable schema versioning across development and production environments.',
          'Implemented Redis caching on high-frequency read queries to protect PostgreSQL connection budgets and reduce query response times.',
        ],
      },
      {
        role: 'Computer Science Department IT & Lab Assistant',
        company: 'Valley View University',
        location: 'Accra, Ghana',
        period: '2022 — 2024',
        highlights: [
          'Assisted students with understanding relational database theory, writing SQL queries, and designing ER diagrams.',
          'Assisted with database server installation and user permissions management for MySQL databases used in class projects.',
          'Reviewed student queries to help identify Cartesian products, unindexed table scans, and syntax errors.',
        ],
      },
    ],
    projects: [
      {
        name: 'AI Timetabling Constraint Engine & Database',
        description: 'Relational data model backing an automated scheduling algorithm. Validated room capacities, lecturer schedules, and enrollment clashes.',
        technologies: ['MySQL', 'SQL Optimization', 'Python', 'CSP Algorithms'],
      },
      {
        name: 'FYP Academic Supervision Relational Schema',
        description: 'Multi-entity schema with strict foreign key constraints, cascading policies, and status tracking for students, supervisors, and topic submissions.',
        technologies: ['MySQL', 'PostgreSQL', 'ER Modeling', 'Flask API'],
      },
      {
        name: 'Portfolio Platform Flyway Migration & Audit Schema',
        description: 'Versioned database migration suite (V1__init.sql) comprising 12 tables, pgcrypto UUIDs, audit logging, and soft-delete queries.',
        technologies: ['PostgreSQL', 'Flyway', 'Spring Data JPA', 'Redis'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Valley View University',
        period: 'Graduated 2024',
        details: 'Evaluated by World Education Services (WES). Coursework: Database Management Systems, Advanced SQL, Data Structures & Algorithms, Discrete Mathematics, Systems Analysis.',
      },
    ],
    certifications: [
      'Cisco: Introduction to Cybersecurity',
      'World Education Services (WES) Verified Academic Credential',
    ],
  },
}
