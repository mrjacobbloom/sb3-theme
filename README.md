**sb3-theme** is a javascript engine that makes it easy to create themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) (and Scratch 3.0). It adds classes to every block and input so you can easily style them with CSS. For a list of these classes, see [the wiki](https://github.com/Airhogs777/sb3-theme/wiki/Classes). It also has [a few other functions](#methods-and-properties) that make styling easier.

Just like Scratch-Blocks, this is a **work-in-progress**. Everything is subject to change. Use at your own risk. :package:

# Getting Started
The easiest way to play with this right now is to download or clone this repository. There's a hacked copy of the Scratch-Blocks repo inside of the `tests` folder, where you can tinker with it.

If you really want your own copy, download the above file called `sb3-theme.js` and link to it in your copy of `horizontal_playground.html` or `vertical_playground.html`. Eventually, I might put this on github pages so you can just link it.

# Example
## make control blocks black
```html
<script src="sb3-theme.js"></script>
<style>
.control .block-background {
  fill: black;
}
.control > text {
  font-family: serif;
}
</style>
```
Result:

![repeat block with black fill](resources/black-serif-repeat.png)
![black blocks in the horizontal editor](resources/black-flyout.png)

#### [For more examples, see the wiki.](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples)

# Methods and Properties
sb3-theme will store itself in a global object called `sb3theme`. So, to access its methods and properties, you'll write things like `sb3theme.horizontal`.

## Methods

* `addOnChange(function)` - add a function that will run every time the number of blocks changes. [See example](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples#make-stop-block-big)
* `addFilter(string)` - add a filter to the `<defs>` area of the SVG. Input should be a string containing an entire `<filter>` tag and its contents. [See example](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples#add-a-blur-filter-to-the-repeat-block)
* `getBlocksWithText(string)` - returns an array of newly-added SVG groups whose text contains the text `string`. All the text will be separated by spaces, and inputs should be ignored. For example, `wait secs`. Note that this returns the groups, which can contain text, paths (backgrounds, boolean inputs), and even other groups (other inputs, icons). [See example](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples#add-a-blur-filter-to-the-repeat-block)
* `getBlocksWithIcon(string)` - returns an array of newly-added SVG groups whose icon URL contains the substring `string`. Again, it returns groups, not paths. [See example](https://github.com/Airhogs777/sb3-theme/wiki/Code-Examples#make-stop-block-big)

## Properties

None of these properties can be accessed immediately when sb3-theme is initialized. You can access them from within an onChange function.

* `newBlocks` - an array of blocks that have been added in the last onChange event.
* `horizontal` - true if you're in horizontal mode.
* `svg` - the `<svg>` element in which the editor is housed.
