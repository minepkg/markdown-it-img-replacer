/**
 * @param {Token[]} markdown
 * @param {(url: string) => string | Promise<string>} replacer
 * @ignore
 */
function replaceImageUrls(tokens, replacer) {
  // For every token
  const ops = tokens.map(async (token) => {
    // fuse replacer for tokens with the image type
    if (token.type === 'image') {
      const url = token.attrGet('src');

      // If the token has an image URL, replace it
      if (url) {
        const newUrl = await replacer(url);
        token.attrSet('src', newUrl || url);
      }
    }

    // travel down the tree: find & replace all URLs of the token's children as well
    if (token.children) {
      await replaceImageUrls(token.children, replacer);
    }
  });

  return Promise.all(ops);
}

/**
 * Replaces image URLs in a markdown string.
 *
 * @param {markdownit} md A markdownit instance, tailored to your project.
 * @param {string} markdown The markdown string to replace the images of.
 * @param {(url: string) => string | Promise<string>} replacer Called for every
 * image in the markdown string. The URL is replaced with the returned string.
 *
 * @returns {Promise<string>} The modified markdown in HTML format.
 */
async function mir(md, markdown, replacer) {
  const parsed = md.parse(markdown, { references: {} });

  await replaceImageUrls(parsed, replacer);
  return md.renderer.render(parsed, {});
}

module.exports = mir;

/**
 * @typedef {Object} Token
 * @property {(type: string, tag: string, nesting: number) => Token} constructor
 * @property {(name: string) => string | null} attrGet
 * @property {(name: string) => number} attrIndex
 * @property {(name: string, value: string) => void} attrJoin
 * @property {(attrData: string[]) => void} attrPush
 * @property {(name: string, value: string) => void} attrSet
 * @property {string[][]} attrs
 * @property {boolean} block
 * @property {Token[]} children
 * @property {string} content
 * @property {boolean} hidden
 * @property {string} info
 * @property {number} level
 * @property {number[]} map
 * @property {string} markup
 * @property {any} meta
 * @property {number} nesting
 * @property {string} tag
 * @property {string} type
 */
