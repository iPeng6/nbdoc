import { parse } from "https://deno.land/std@0.204.0/encoding/yaml.ts";
import { join } from "https://deno.land/std@0.204.0/path/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import MarkdownIt from "https://esm.sh/markdown-it";

const markdown = new MarkdownIt();

/**
 * 将 Markdown 内容转换为 RSS 文件
 * @param markdownContent Markdown 文档内容
 * @param outputFile 输出 RSS 文件路径
 */
async function markdownToRSS(markdownContent: string, outputFile: string) {
  const rssTemplateStart = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>前端周刊-神农尝百码</title>
    <link>https://godcode.win/#/page.html?p=doc/feweekly/archive.md</link>
    <description>前端周刊归档</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

  const rssTemplateEnd = `
  </channel>
</rss>
`;

  // 分割 Markdown 内容为每期
  const issues = markdownContent.split("## ").slice(1); // 去掉第一个非标题部分
  let items = "";

  for (const issue of issues) {
    const lines = issue.trim().split("\n");
    const title = lines[0].trim(); // 标题 (例如: "2024年12月17日 - 第37期")
    const descriptionMarkdown = lines.slice(1).join("\n").trim(); // 其余部分
    const descriptionHTML = markdown.render(descriptionMarkdown); // 转换为 HTML

    // 提取发布日期
    const dateMatch = title.match(/\d{4}年\d{2}月\d{2}日/);
    const pubDate = dateMatch
      ? new Date(
          dateMatch[0].replace(/年|月/g, "-").replace("日", ""),
        ).toUTCString()
      : new Date().toUTCString();

    // 生成 <item>
    items += `
    <item>
      <title>${title}</title>
      <link>https://你的周刊链接/${title.split(" ")[0]}</link>
      <description><![CDATA[${descriptionHTML}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }

  // 合并 RSS 文件
  const rssContent = rssTemplateStart + items + rssTemplateEnd;

  // 写入到输出文件
  await Deno.writeTextFile(outputFile, rssContent);
  console.log(`RSS 文件已生成: ${outputFile}`);
}

// 示例使用
const markdownFilePath = join(Deno.cwd(), "weekly.md"); // 替换为你的 Markdown 文件路径
const outputRSSPath = join(Deno.cwd(), "weekly_rss.xml");

// 读取 Markdown 文件
try {
  const markdownContent = await Deno.readTextFile(markdownFilePath);
  await markdownToRSS(markdownContent, outputRSSPath);
} catch (err) {
  console.error("读取 Markdown 文件失败:", err);
}
