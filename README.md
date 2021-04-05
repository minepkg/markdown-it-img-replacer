# markdown-it-img-replacer
Replace markdown image URLs.

[![Actions Status](https://github.com/minepkg/markdown-it-img-replacer/workflows/Node%20CI/badge.svg)](https://github.com/minepkg/markdown-it-img-replacer/actions)

## Usage

```js
const md = require('markdown-it')()
const mir = require('markdown-it-img-replacer')

const html = await mir(md, 'Image: ![alt text](https://example.com/image.png)', url => url + '?size=512')

/* html is
<p>Image: <img src="https://example.com/image.png?size=512" alt="alt text"></p>
*/
```

## Documentation
* Global exports
  * `mir(md, markdown, replacer)`
    * Replaces image URLs in a markdown string.  
    
    * `md: markdownit` - A markdownit instance, tailored to your project.
    * `markdown: string` - The markdown string to replace the images of.
    * `replacer: (url: string) => string | Promise<string>` - Called for every image in the markdown string. The URL is replaced with the returned string.
