import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import BasicMeta from "../../../components/meta/BasicMeta";
import OpenGraphMeta from "../../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../../components/meta/TwitterCardMeta";
import PostList from "../../../components/PostList";
import config from "../../../lib/config";
import { fetchPostContent } from "../../../lib/posts";
import { countPosts, listPostContent, PostContent } from "../../../lib/posts";
import { listTags, TagContent } from "../../../lib/tags";

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};

function uniq(array: string[]): string[]{
  return Array.from(new Set(array))
}

export default function Index({ posts, tags, pagination }: Props) {
  const router = useRouter()
  const year = String(router.query["year"])
  const url = "/blog/" + year;
  const title = year + " posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const year = params.year
  const posts = listPostContent(1, config.posts_per_page, undefined, String(year));
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countPosts() / config.posts_per_page),
  };
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = uniq(fetchPostContent().map(it => "/blog/" + it.date.split('-')[0]));
  return {
    paths: paths,
    fallback: false,
  };
};