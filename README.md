**sb3-theme** is a javascript engine that makes it easy to create themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) (and Scratch 3.0) as userscripts. It adds classes to every block and input so you can easily style them with CSS. For a list of these classes, see [the wiki](https://github.com/Airhogs777/sb3-theme/wiki/Classes). It also has [a few other functions](https://github.com/Airhogs777/sb3-theme/wiki/Methods-and-Properties) that make styling easier.

Just like Scratch-Blocks, this is a **work-in-progress**. Everything is subject to change. Use at your own risk. :package:

#### [Developers: check out the wiki for help getting started.](https://github.com/Airhogs777/sb3-theme/wiki)

## Install a theme
sb3-themes are shared as UserScripts. To install them, you'll need a UserScript Manager. Choose one of the options below to install one:
* Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
* Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (note that Chrome has built-in UserScript support but a manager will make your life much easier)
* Safari: [Tampermonkey](https://tampermonkey.net/?browser=safari)

Once you've done that, head over to our [Themes Library](https://github.com/Airhogs777/sb3-theme/wiki/Themes-Library) to pick a theme and install it.

## Example: make control blocks black
```javascript
// ==UserScript==
// @name         make control blocks black
// @include      /^.*/(vertical|horizontal)_playground.html?$/
// @grant        none
// @require      https://airhogs777.github.io/sb3-theme/sb3-theme.js
// ==/UserScript==

(function() {
    'use strict';

    sb3theme.style(`
      .control .block-background {
        fill: black;
      }
      .control > text {
        font-family: serif;
      }`);
})();
```

Result:

![repeat block with black fill](resources/black-serif-repeat.png)
![black blocks in the horizontal editor](resources/black-flyout.png)

#### [For more examples, see the wiki.](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples)
