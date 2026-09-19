// ```plantuml / ```puml  -> PlantUML サーバでレンダリングした <img>（クリックで原寸SVG）
// ```mermaid            -> <pre class="mermaid">（クライアント側で mermaid が描画）
import { visit } from 'unist-util-visit';
import plantumlEncoder from 'plantuml-encoder';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function remarkDiagrams(options = {}) {
  const server = (options.server ?? 'https://www.plantuml.com/plantuml').replace(/\/$/, '');
  const format = options.format ?? 'svg';

  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      const lang = (node.lang ?? '').toLowerCase();
      const caption = node.meta ? escapeHtml(node.meta.trim()) : '';

      if (lang === 'plantuml' || lang === 'puml' || lang === 'uml') {
        let src = node.value.trim();
        if (!/^@start\w+/m.test(src)) src = `@startuml\n${src}\n@enduml`;
        const url = `${server}/${format}/${plantumlEncoder.encode(src)}`;
        parent.children[index] = {
          type: 'html',
          value:
            `<figure class="diagram diagram-plantuml">` +
            (caption ? `<figcaption>${caption}</figcaption>` : '') +
            `<a href="${url}" target="_blank" rel="noopener">` +
            `<img src="${url}" alt="${caption || 'PlantUML 図'}" loading="lazy"></a>` +
            `<details class="diagram-source"><summary>PlantUML ソース</summary>` +
            `<pre><code>${escapeHtml(src)}</code></pre></details>` +
            `</figure>`,
        };
      } else if (lang === 'mermaid') {
        parent.children[index] = {
          type: 'html',
          value:
            `<figure class="diagram diagram-mermaid">` +
            (caption ? `<figcaption>${caption}</figcaption>` : '') +
            `<pre class="mermaid">${escapeHtml(node.value)}</pre>` +
            `<details class="diagram-source"><summary>Mermaid ソース</summary>` +
            `<pre><code>${escapeHtml(node.value)}</code></pre></details>` +
            `</figure>`,
        };
      }
    });
  };
}
