// ```plantuml / ```puml -> ビルド時に SVG を取得してインライン展開（ソースは表示しない）
// ```mermaid           -> <pre class="mermaid">（クライアント側で mermaid が描画）
//
// SVG は PLANTUML_SERVER から取得し、.cache/plantuml/ にソースのハッシュで保存する。
// 2 回目以降はキャッシュを使うのでオフラインでもビルドできる。
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import plantumlEncoder from 'plantuml-encoder';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 取得した SVG を HTML に埋め込める形に整える
//  - XML 宣言を外す
//  - ルート要素の固定 width/height スタイルを外し、CSS で縮小できるようにする
//  - 拡大はしない（元の幅を上限にし、狭い画面では縮小のみ）
function cleanSvg(svg) {
  svg = svg.replace(/^\s*<\?xml[^>]*\?>\s*/i, '');
  return svg.replace(/^<svg\b([^>]*)>/i, (_, attrs) => {
    const width = Number((attrs.match(/\swidth="(\d+)(?:px)?"/i) ?? [])[1]);
    const style = (attrs.match(/\sstyle="([^"]*)"/i) ?? [])[1] ?? '';
    const kept = style.split(';').map((x) => x.trim()).filter((x) => x && !/^(width|height)\s*:/.test(x));
    if (width) kept.push(`max-width:${width}px`);
    attrs = attrs.replace(/\sstyle="[^"]*"/i, '').replace(/\sclass="[^"]*"/i, '');
    return `<svg class="plantuml"${kept.length ? ` style="${kept.join(';')}"` : ''}${attrs}>`;
  });
}

async function fetchSvg(server, src, cacheDir) {
  const hash = createHash('sha256').update(server + '\n' + src).digest('hex').slice(0, 24);
  const file = path.join(cacheDir, `${hash}.svg`);
  try {
    return await readFile(file, 'utf8');
  } catch {}
  const url = `${server}/svg/${plantumlEncoder.encode(src)}`;
  const res = await fetch(url);
  const svg = await res.text();
  if (!svg.trimStart().startsWith('<?xml') && !svg.trimStart().startsWith('<svg')) {
    throw new Error(`PlantUML server returned non-SVG (${res.status}) from ${server}`);
  }
  // 構文エラー時もサーバはエラー内容を描いた SVG を返す（HTTP 400）。キャッシュせず表示する。
  if (res.ok) {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(file, svg, 'utf8');
  }
  return svg;
}

export default function remarkDiagrams(options = {}) {
  const server = (options.server ?? 'https://www.plantuml.com/plantuml').replace(/\/$/, '');
  const cacheDir = options.cacheDir ?? path.join(process.cwd(), '.cache', 'plantuml');

  return async (tree, file) => {
    const tasks = [];
    visit(tree, 'code', (node, index, parent) => {
      const lang = (node.lang ?? '').toLowerCase();
      const caption = node.meta ? escapeHtml(node.meta.trim()) : '';
      const fig = (cls, inner) =>
        `<figure class="diagram ${cls}">${caption ? `<figcaption>${caption}</figcaption>` : ''}${inner}</figure>`;

      if (lang === 'plantuml' || lang === 'puml' || lang === 'uml') {
        let src = node.value.trim();
        if (!/^@start\w+/m.test(src)) src = `@startuml\n${src}\n@enduml`;
        tasks.push(
          fetchSvg(server, src, cacheDir)
            .then((svg) => {
              parent.children[index] = { type: 'html', value: fig('diagram-plantuml', cleanSvg(svg)) };
            })
            .catch((err) => {
              console.warn(`[remark-diagrams] ${file?.path ?? ''}: ${err.message}`);
              parent.children[index] = {
                type: 'html',
                value: fig(
                  'diagram-plantuml diagram-error',
                  `<p class="diagram-error-msg">図を取得できませんでした（${escapeHtml(err.message)}）</p>` +
                    `<pre><code>${escapeHtml(src)}</code></pre>`,
                ),
              };
            }),
        );
      } else if (lang === 'mermaid') {
        parent.children[index] = {
          type: 'html',
          value: fig('diagram-mermaid', `<pre class="mermaid">${escapeHtml(node.value)}</pre>`),
        };
      }
    });
    await Promise.all(tasks);
  };
}
