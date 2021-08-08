import fs from 'fs'
import { PostContent } from "./posts"

export async function generateSitemap(posts: PostContent[]) {
    const sitemap: string[] = []

    sitemap.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`)
    
    const nonBlogPages: PostContent[] = [
        {
            "title": "manj.io",
            "date": "2021-08-08T10:04:12.441Z",
            "fullPath": "",
            "urlPath": "/",
            "slug": "",
        },
        {
            "title": "Resume",
            "date": "2021-08-08T10:04:12.441Z",
            "fullPath": "",
            "slug": "resume",
            "urlPath": "/blog/2021/resume"
        },
        {
            "title": "Contacts",
            "date": "2021-08-08T10:04:12.441Z",
            "fullPath": "",
            "slug": "contacts",
            "urlPath": "/blog/2021/contacts"
        }
    ];

    nonBlogPages.concat(posts).map((page) => {
        const item: string[] = []
        item.push(`  <url>`)
        item.push(`    <loc>https://www.manj.io${page.urlPath}</loc>`)
        item.push(`    <lastmod>${page.date}</lastmod>`)
        item.push(`    <changefreq>daily</changefreq>`)
        item.push(`    <priority>0.7</priority>`)
        item.push(`  </url>\n`)
        sitemap.push(item.join('\n'))
    })

    sitemap.push(`\n</urlset>\n`)

    fs.writeFileSync('public/sitemap.xml', sitemap.join(""))
}