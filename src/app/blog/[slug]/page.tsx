import BlogDetailsClient from "./BlogDetailsClient";

export function generateStaticParams() {
  return [
    { slug: "scaling-modern-web-applications-in-2026" },
    { slug: "the-art-of-cinematic-uiux-design" },
    { slug: "navigating-the-future-of-enterprise-it-ai-cloud-and-beyond" },
    { slug: "building-scalable-cloud-architectures" },
    { slug: "the-human-centered-approach-to-enterprise-ux" },
    { slug: "cybersecurity-in-the-age-of-generative-ai" },
    { slug: "the-evolution-of-devsecops-in-modern-enterprises" },
    { slug: "demystifying-microservices-vs-monoliths-for-fast-growing-firms" },
  ];
}

export default function BlogDetailsPage() {
  return <BlogDetailsClient />;
}
