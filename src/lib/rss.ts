import fs from 'fs'
import RSS from 'rss';
import {PostContent} from './posts';

export async function generateFeedXml(posts: PostContent[]) {
  const feed = new RSS({
    title: "タイトル",
    description: "説明",
    site_url: "サイトのURL",
    feed_url: "フィードページのURL",
    language: 'ja',
  });

  posts?.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      url: `https://www.manj.io${post.urlPath}`,
    });
  })
  
  fs.writeFileSync('public/feed.xml', feed.xml())
}