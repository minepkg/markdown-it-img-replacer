const { describe, it } = require('mocha');
const { expect } = require('chai');

const md = require('markdown-it')();
const mir = require('../');

const markdown = [
  'Image 1: ![alt text](https://example.com/image.png)',
  'Image 2: ![alt text 2](https://example.com/image2.png)',
].join('\n');


const replaced = [
  '<p>Image 1: <img src="https://example.com/image.png?size=500" alt="alt text">',
  'Image 2: <img src="https://example.com/image2.png?size=500" alt="alt text 2"></p>',
  '', // new line
].join('\n');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const demoBusinessLogic = (url) => `${url}?size=500`;

describe('Replacing Images', () => {
  it('should work with sync functions', async () => {
    const html = await mir(md, markdown, demoBusinessLogic);

    expect(html).to.equal(replaced);
  });

  it('should work with async functions', async () => {
    const started = new Date().getTime();

    const html = await mir(md, markdown, async (url) => {
      await delay(50);
      return demoBusinessLogic(url);
    });

    const elapsed = new Date().getTime() - started;

    expect(html).to.equal(replaced);
    // Greater than or equal to
    expect(elapsed).to.be.gte(50);
  });
});
