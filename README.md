This set of tools should make it easier to write themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) (and Scratch 3.0). It might work for vanilla Blockly too, but I haven't tested it there.

This is a work-in-progress. Everything is subject to change. Use at your own risk. :package:

# Examples
## blur the repeat block
```javascript
//initialize a new Sb3Theme object and store it in the variable "t"
var t = new Sb3Theme();

// "addInit" funcions only run when the editor is first opened
t.addInit(function() {

  // add a blur filter to the SVG
  t.addFilter(`<filter id="myFilter">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
  </filter>`);

  // using CSS, add the filter to all <path> elements directly inside elements with the class "myRepeats"
  t.css.innerHTML += `.myRepeats > path {
    filter: url(#myFilter)
  }`;
});

// "addOnChange" functions run whenever the number of blocks changes
t.addOnChange(function() {

  // find all the SVG groups with the word "repeat"
  var repeats = t.getBlocksWithText('repeat times');

  // give them all the class name "myRepeats"
  repeats.forEach(function(elem) {
    elem.classList.add("myRepeats");
  });
});
```
Result:

![repeat block with blur filter](resources/blurred-repeat.png)


## make control blocks black
```javascript
//initialize a new Sb3Theme object and store it in the variable "t"
var t = new Sb3Theme();

// "addInit" funcions only run when the editor is first opened
t.addInit(function() {

  // using CSS, change the styles for all <path> elements directly inside elements with the class "black"
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

  // give them all the class name "myRepeats"
  controls.forEach(function(elem) {
    elem.classList.add("black");
  });
});
```
Result:

![forever block with black fill](resources/black-serif-repeat.png)



# Methods and Properties
## Methods

* `addInit()` - add a function to run once after the SVG has been initialized.
* `addOnChange()` - add a function that will run every time the number of blocks changes.
* `addFilter()` - add a filter to the `<defs>` area of the SVG. Input should be a string containing an entire `<filter>` tag and its contents
* `getBlocksWithText(text)` - returns an array of SVG groups whose text contains the text `text`. All the text will be separated by spaces, and inputs/nested blocks should be ignored. For example, `repeat times`. Note that this returns the groups, which can contain text, paths (backgrounds), an potentially other groups.
* `getBlocksWithFillColor(color)` - returns an array of SVG groups whose path (background) color matches `color`. You can use color names, RGB[A], HSL, you name it. Again, note that this returns groups.

## Properties

* `css` - a `<style>` element that I've created just for you. Do what you wish with it.
* `svg` - the `<svg>` element in which the editor is housed.
* `defs` - the `<defs>` element where you'll find filters and things.
* `draggables` - a NodeList of all the elements in the SVG with have the class `blocklyDraggable`. You probably don't need to worry about this, it's mostly used internally
