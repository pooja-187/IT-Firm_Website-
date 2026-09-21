import BlogDetailsClient from "./BlogDetailsClient";
import { getAllBlogs, slugify } from "@/data/blogData";

export function generateStaticParams() {
  return getAllBlogs().map((blog) => ({
    slug: slugify(blog.title),
  }));
}

export default function BlogDetailsPage() {
  return <BlogDetailsClient />;
}
