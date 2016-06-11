This set of tools should make it easier to write themes/skins for [Scratch-Blocks](https://github.com/LLK/scratch-blocks) and Scratch 3.0. It might work for vanilla Blockly too, but I haven't tested it there.

# Examples
```
var t = new Sb3Theme();

t.addInit(function() {
  t.addFilter('<filter id="myFilter"> ... </filter>');
});
```
