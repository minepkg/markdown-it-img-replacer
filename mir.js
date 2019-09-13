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
async function mir (md, markdown, replacer) {
  const parsed = md.parse(markdown, { references: {} });

  await replaceImageUrls(parsed, replacer);
  return md.renderer.render(parsed, {});
}

/**
 * @param {Token[]} markdown
 * @param {(url: string) => string | Promise<string>} replacer
 * @ignore
 */
async function replaceImageUrls (markdown, replacer) {
  // For every token in the markdown
  for (let i = 0; i < markdown.length; i++) {
    const token = markdown[i];
    const url = getImageUrl(token);

    // If the token has an image URL, replace it
    if (url) {
      const newUrl = await replacer(url);
      token.attrSet('src',  newUrl || url);
    }

    // Replace all URLs of the token's children as well
    if (token.children) {
      await replaceImageUrls(token.children, replacer);
    } 
  }
}

/**
 * Gets the image URL of a markdown token, if any.
 * @param {Token} token The markdown token.
 * @returns {string | null} The image URL. Null if there is none.
 * @ignore
 */
function getImageUrl (token) {
  if (token.type !== 'image') {
    return null;
  }

  return token.attrGet('src');
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
