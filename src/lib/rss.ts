import RSS from 'rss';
import {listPostContent} from './posts'

export async function generateFeedXml() {
  const feed = new RSS({
    title: "タイトル",
    description: "説明",
    site_url: "サイトのURL",
    feed_url: "フィードページのURL",
    language: 'ja',
  });

  // 例としてpostsを含めるイメージ
  // このあたりの書き方はライブラリのドキュメントを参考にしてください
  const posts = await listPostContent(
      1,
      100000
  );
  posts?.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      url: `https://www.manj.io${post.urlPath}`,
    });
  })
  
  // XML形式の文字列にする
  return feed.xml();
}