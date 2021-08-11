import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

export type PostContent = {
  readonly date: string;
  readonly title: string;
  readonly slug: string;
  readonly tags?: string[];
  readonly description?: string;
  readonly fullPath: string;
  readonly urlPath: string;
};

let postCache: PostContent[];

export function fetchPostContent(is_blog = true): PostContent[] {
  if (postCache) {
    return postCache;
  }
  const postsDirectory = !is_blog ? path.join(process.cwd(), "content/pages") : path.join(process.cwd(), "content/posts")

  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      console.log(fileName)
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        date: string;
        title: string;
        slug: string;
        tags?: string[];
        description?: string;
        fullPath: string,
        urlPath: string,
      };
      if (matterData.tags === undefined) {
        matterData.tags = []
      }

      if (matterData.description === undefined) {
        matterData.description = "No description"
      }

      matterData.fullPath = fullPath;

      const year = matterData.date.split("-")[0]
      matterData.urlPath = path.join("/blog/", year, fileName.replace(/\.mdx$/, ""))

      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function countPosts(tag?: string): number {
  return fetchPostContent().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listPostContent(
  page: number,
  limit: number,
  tag?: string,
  year?: string
): PostContent[] {
  return fetchPostContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .filter((it => !year || (it.date.split("-")[0] === year)))
    .slice((page - 1) * limit, page * limit);
}
