**sb3-theme** is a javascript engine that makes it easy to create themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) (and Scratch 3.0) as userscripts. It adds classes to every block and input so you can easily style them with CSS. For a list of these classes, see [the wiki](https://github.com/Airhogs777/sb3-theme/wiki/Classes). It also has [a few other functions](#methods-and-properties) that make styling easier.

Just like Scratch-Blocks, this is a **work-in-progress**. Everything is subject to change. Use at your own risk. :package:

#### [Check out the wiki for help getting started.](https://github.com/Airhogs777/sb3-theme/wiki)

# Example
## make control blocks black
```javascript
// ==UserScript==
// @name         make control blocks black
// @include      /^.*/(vertical|horizontal)_playground.html?$/
// @grant        none
// @require      https://airhogs777.github.io/sb3-theme/sb3-theme.js
// ==/UserScript==

(function() {
    'use strict';

    sb3theme.css.innerHTML += `.control .block-background {
      fill: black;
    }
    .control > text {
      font-family: serif;
    }`;
})();
```

Result:

![repeat block with black fill](resources/black-serif-repeat.png)
![black blocks in the horizontal editor](resources/black-flyout.png)

#### [For more examples, see the wiki.](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples)
