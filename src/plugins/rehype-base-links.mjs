/**
 * Lets you write root-relative links in Markdown ("/shelf", "/journal/my-post")
 * and have them work when the site is served from a sub-path (e.g. GitHub Pages
 * project sites at /Portfolio_aymar/).
 */
export default function rehypeBaseLinks({ base = '/' } = {}) {
  const prefix = base.replace(/\/$/, '');
  const fix = (v) =>
    typeof v === 'string' && prefix && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(prefix + '/') ? prefix + v : v;
  const walk = (node) => {
    if (node.type === 'element') {
      if (node.properties?.href) node.properties.href = fix(node.properties.href);
      if (node.tagName === 'img' && node.properties?.src) node.properties.src = fix(node.properties.src);
    }
    node.children?.forEach(walk);
  };
  return (tree) => walk(tree);
}
