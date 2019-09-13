// Run npm i --no-save markdown-it before testing

const { describe, it } = require('mocha')
const { expect } = require('chai')

const mir = require('../')
const md = require('markdown-it')()

const markdown =
  'Image 1: ![alt text](http://example.com/image.png)\n' +
  'Image 2: ![alt text 2](https://example.com/image2.png)'

const replaced =
  '<p>Image 1: <img src="https://example.com/image.png" alt="alt text">\n' +
  'Image 2: <img src="http://example.com/image2.png" alt="alt text 2"></p>\n'

describe('Replacing Images', () => {
  it('should work with sync functions', async () => {
    const html = await mir(md, markdown, url => url.startsWith('http://') ?
      url.replace('http://', 'https://') : url.replace('https://', 'http://'))

    expect(html).to.equal(replaced)
  })

  it('should work with async functions', async () => {
    const started = new Date().getTime()

    const html = await mir(md, markdown, async url => {
      await wait(50)

      if (url.startsWith('http://')) {
        return url.replace('http://', 'https://')
      } else {
        return url.replace('https://', 'http://')
      }
    })

    const elapsed = new Date().getTime() - started

    expect(html).to.equal(replaced)
    // Greater than or equal to
    expect(elapsed).to.be.gte(50)
  })
})

function wait (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
