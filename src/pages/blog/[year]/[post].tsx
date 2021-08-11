import fs from "fs";
import { parseISO } from 'date-fns';
import matter from "gray-matter";
import yaml from "js-yaml";
import { GetStaticProps, GetStaticPaths } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";
import Script from 'next/script';
import Gist from 'react-gist';
import InstagramEmbed from "react-instagram-embed";
import { TwitterTweetEmbed } from "react-twitter-embed";
import YouTube from "react-youtube";
import CustomLink from "../../../components/link";
import PostLayout from "../../../components/PostLayout";
import { fetchPostContent } from "../../../lib/posts";

export type Props = {
  title: string;
  dateString: string;
  slug: string;
  tags?: string[];
  author: string;
  description?: string;
  source: MdxRemote.Source;
};

const components = {
    Instagram: InstagramEmbed,
    YouTube: YouTube,
    Twitter: TwitterTweetEmbed,
    Script: Script,
    Gist: Gist,
    a: CustomLink };
const slugToPostContent = (postContents => {
  const hash = {}
  postContents.forEach(it => hash[it.slug] = it)
  return hash;
})(fetchPostContent());

export default function Post({
  title,
  dateString,
  slug,
  tags,
  author,
  description = "",
  source,
}: Props) {
  const content = hydrate(source, { components })
  return (
    <PostLayout
      title={title}
      date={parseISO(dateString)}
      slug={slug}
      tags={tags}
      author={author}
      description={description}
    >
      {content}
    </PostLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPostContent().map(it => "/blog/" + it.date.split('-')[0] + "/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.post as string;
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
  });
  const mdxSource = await renderToString(content, { components, scope: data });
  return {
    props: {
      title: data.title,
      dateString: data.date,
      slug: slug,
      description: data.description != undefined ? data.description : "No description",
      tags: data.tags != undefined ? data.tags : [],
      author: data.author,
      source: mdxSource
    },
  };
};

