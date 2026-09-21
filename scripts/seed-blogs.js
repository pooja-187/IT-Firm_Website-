/**
 * Idempotent Seed Script for Manzio Blog Articles
 * Ensures all 8 canonical articles exist in SQLite (api_blog) without creating duplicates.
 */
const { db } = require('../manzio-backend/db');

const CANONICAL_BLOGS = [
  {
    id: 1,
    title: "Scaling Modern Web Applications in 2026",
    date: "2026-05-18",
    meta_description: "A comprehensive guide to scaling high-traffic Next.js and Django platforms.",
    description: `Building high-performance digital ecosystems requires decoupling your frontend and backend. Using Next.js for Server-Side Rendering (SSR) paired with a robust Django REST API on SQLite/PostgreSQL gives developer efficiency and scalability. In this guide, we dive deep into database index tuning, server caching layers (like Redis), CDN distribution strategies, and custom asset pipeline handling that keeps your applications lighting fast globally.

Modern architectures demand seamless integration between client and server layers. By offloading static assets to edge CDNs and utilizing incremental static regeneration, platforms achieve sub-second response times worldwide while maintaining dynamic interactivity.

Furthermore, optimizing asset bundles and modern CSS rendering strategies eliminates render-blocking bottlenecks, ensuring superior user engagement and search visibility across all device types.`
  },
  {
    id: 2,
    title: "The Art of Cinematic UI/UX Design",
    date: "2026-05-12",
    meta_description: "Learn how micro-animations and HSL colors elevate modern SaaS dashboards.",
    description: `Design is not just what it looks like; it's how it feels and flows. Integrating GSAP, smooth CSS gradients, glassmorphism layers, and responsive column feeds creates trust and a premium feel. We explore HSL color tailoring, the psychology behind 3D rotational tilt cards, micro-interactions, and using spring-based motion curves instead of simple linear animations to create software that feels truly premium and alive.

Every touchpoint in an interface communicates intent. By choreographing motion to follow natural physical inertia, users experience software as an organic extension of their thoughts.

Visual hierarchy, typographic contrast, and restrained ambient glows establish a luxury aesthetic that commands attention while remaining functionally effortless.`
  },
  {
    id: 3,
    title: "Navigating the Future of Enterprise IT: AI, Cloud, and Beyond",
    date: "2026-04-28",
    meta_description: "How enterprise leaders are architecting resilient digital infrastructure in the era of artificial intelligence.",
    description: `Enterprise IT infrastructure is undergoing its most profound transformation in decades. As artificial intelligence moves from speculative experimentation into core business workflows, traditional cloud architectures must evolve to accommodate intensive data pipelines and low-latency inference requirements.

Organizations are increasingly adopting hybrid multi-cloud topologies that combine the elastic scalability of public cloud providers with the data sovereignty and security controls of dedicated private infrastructure.

Navigating this shifting landscape requires architectural discipline, robust data governance protocols, and a continuous focus on developer velocity and system observability.`
  },
  {
    id: 4,
    title: "Building Scalable Cloud Architectures",
    date: "2026-04-15",
    meta_description: "Key architectural patterns for multi-region redundancy, zero-downtime deployments, and elastic scalability.",
    description: `Designing cloud infrastructure that gracefully scales under unpredictable traffic surges requires a fundamental shift toward stateless, decoupled services. Containerization, automated cluster orchestration, and distributed database sharding form the bedrock of resilient enterprise systems.

Implementing zero-downtime blue-green deployments and canary rollouts ensures continuous delivery without risking service interruption for end users.

By leveraging edge computing nodes and intelligent routing layers, modern cloud architectures deliver ultra-low latency while preserving operational simplicity and cost efficiency.`
  },
  {
    id: 5,
    title: "The Human-Centered Approach to Enterprise UX",
    date: "2026-04-02",
    meta_description: "Why enterprise applications must prioritize intuitive user journeys and accessibility without sacrificing complexity.",
    description: `Enterprise software has historically suffered from cluttered interfaces, overwhelming cognitive load, and convoluted navigation patterns. A human-centered approach fundamentally challenges this status quo by applying consumer-grade design fidelity to mission-critical business tools.

By establishing consistent design token systems and empathetic workflow mapping, enterprise applications can handle complex domain data while remaining intuitive and accessible.

Reducing task completion friction directly correlates with operational efficiency, lower error rates, and heightened employee satisfaction across distributed teams.`
  },
  {
    id: 6,
    title: "Cybersecurity in the Age of Generative AI",
    date: "2026-03-20",
    meta_description: "Mitigating next-generation threat vectors, automated penetration testing, and zero-trust perimeter defense.",
    description: `The proliferation of generative AI tools has transformed the enterprise cybersecurity landscape. While adversaries leverage automated reconnaissance and sophisticated synthetic exploits, defensive operations must match this velocity with proactive zero-trust enforcement.

Implementing strict least-privilege identity access, continuous cryptographic validation, and automated vulnerability scanning across CI/CD pipelines creates deep defensive resilience.

Security can no longer exist as a reactive perimeter; it must be deeply woven into the software development lifecycle from initial design to production runtime.`
  },
  {
    id: 7,
    title: "The Evolution of DevSecOps in Modern Enterprises",
    date: "2026-03-08",
    meta_description: "Shifting security left into automated CI/CD pipelines to build faster without compromising compliance.",
    description: `DevSecOps is not merely a toolset; it is a cultural and architectural discipline that embeds security verification directly into engineering workflows. By shifting security assessments left into automated build and pull request stages, teams identify vulnerabilities before code reaches production.

Static Application Security Testing (SAST), dependency vulnerability scanning, and infrastructure-as-code linting operate continuously without impeding deployment frequency.

This continuous feedback loop empowers developers to remediate risks immediately, transforming security from a bureaucratic blocker into an engineering accelerator.`
  },
  {
    id: 8,
    title: "Demystifying Microservices vs Monoliths for Fast-Growing Firms",
    date: "2026-02-22",
    meta_description: "A pragmatic evaluation of when to modularize your core monolith and when to embrace distributed services.",
    description: `The architectural debate between monolithic applications and distributed microservices is often clouded by industry hype. For rapidly growing firms, prematurely splitting a cohesive system into dozens of services introduces network latency, distributed transaction complexity, and heavy operational overhead.

A modular monolith with well-defined domain boundaries frequently offers the optimal balance of developer velocity, straightforward testing, and high performance.

Organizations should only transition specific high-throughput domains into independent microservices when team scale and independent deployment cadences genuinely necessitate service decoupling.`
  }
];

function seedBlogs() {
  console.log('[seed-blogs] Checking SQLite api_blog table...');
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM api_blog').get();
  console.log(`[seed-blogs] Current records: ${existingCount.count}`);

  const checkStmt = db.prepare('SELECT id FROM api_blog WHERE title = ?');
  const insertStmt = db.prepare(`
    INSERT INTO api_blog (title, date, meta_description, description)
    VALUES (?, ?, ?, ?)
  `);

  let added = 0;
  for (const blog of CANONICAL_BLOGS) {
    const exists = checkStmt.get(blog.title);
    if (!exists) {
      insertStmt.run(blog.title, blog.date, blog.meta_description, blog.description);
      console.log(`[seed-blogs] Added: "${blog.title}"`);
      added++;
    } else {
      console.log(`[seed-blogs] Already exists (id: ${exists.id}): "${blog.title}"`);
    }
  }

  const finalCount = db.prepare('SELECT COUNT(*) as count FROM api_blog').get();
  console.log(`[seed-blogs] Completed: ${added} added. Total records in api_blog: ${finalCount.count}`);
}

seedBlogs();
