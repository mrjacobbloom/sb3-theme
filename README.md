This set of tools should make it easier to write themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) (and Scratch 3.0). It might work for vanilla Blockly too, but I haven't tested it there.

This is a **work-in-progress**. Everything is subject to change. Use at your own risk. :package:

# Getting Started
The easiest way to play with this right now is to download or clone this repo. There's a copy of the Scratch-Blocks repo inside of the `tests` folder, where you can tinker with it.

If you really want your own copy, download the above file called `sb3-theme.js` and insert it into your copy of `horizontal_playground.html` or `vertical_playground.html`. Eventually, I might put this on gh-pages so you can just link it.

# Example
## make control blocks black
```javascript
//initialize a new Sb3Theme object and store it in the variable "t"
var t = new Sb3Theme();

// "addInit" functions only run when the editor is first opened
t.addInit(function() {

  // using CSS, change the styles for children of elements with the class "black"
  t.css.innerHTML += `
  .black > path {
    fill: black;
  }
  .black > text {
    font-family: serif;
  }`;
});

// "addOnChange" functions run whenever the number of blocks changes
t.addOnChange(function() {

  // find all the SVG groups with the fill color #FFAB19 (the color for control blocks)
  var controls = t.getBlocksWithFillColor('#FFAB19');

  // give them all the class name "black"
  controls.forEach(function(elem) {
    elem.classList.add("black");
  });
});
```
Result:

![repeat block with black fill](resources/black-serif-repeat.png)
![black blocks in the horizontal editor](resources/black-flyout.png)

#### [For more examples, see the wiki.](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples)

# Methods and Properties
## Methods

* `addInit(function)` - add a function to run once after the SVG has been initialized.
* `addOnChange(function)` - add a function that will run every time the number of blocks changes.
* `addFilter(string)` - add a filter to the `<defs>` area of the SVG. Input should be a string containing an entire `<filter>` tag and its contents.
* `getBlocksWithText(string)` - returns an array of SVG groups whose text contains the text `string`. All the text will be separated by spaces, and inputs/nested blocks should be ignored. For example, `repeat times`. Note that this returns the groups, which can contain text, paths (backgrounds), and even other groups.
* `getBlocksWithFillColor(string)` - returns an array of SVG groups whose path (background) color matches `string`. You can use color names, RGB[A], HSL, you name it--it'll be converted to the correct format for color comparison. Again, note that this returns groups.
* `getBlocksWithIcon(string)` - returns an array of SVG groups whose icon URL contains the substring `string`. Once again, it's groups, not paths.
* `getInputs(array)` - takes an array of blocks and returns an array of the inputs within those blocks.

## Properties

* `css` - a `<style>` element that I've created just for you. Do what you wish with it.
* `svg` - the `<svg>` element in which the editor is housed.
* `dragsvg` - the `<svg>` element where blocks go while you drag them.
* `defs` - the `<defs>` element where you'll find filters and things.
* `allBlocks` - an array of all the blocks in the SVGs. Note that this includes inputs.
