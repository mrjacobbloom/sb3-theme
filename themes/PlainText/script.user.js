// ==UserScript==
// @name         sb3theme: PlainText
// @author       Airhogs777
// @include      /^.*/vertical_playground.html?$/
// @grant        none
// @require      https://airhogs777.github.io/sb3-theme/sb3-theme.js
// ==/UserScript==

(function() {
  'use strict';

  sb3theme.options.menuColors = false;
  sb3theme.style(`
    .blocklyMainBackground {
      fill: white !important;
    }
    .block-background {
      fill: white;
      stroke: none;
    }
    .reporter .block-background, .input-background {
      stroke: gray;
      fill: white;
    }
    .insertion-marker > path, .replaceable path {
      fill: #eee !important;
      fill-opacity: 1;
    }
    .block > text, .input text {
      fill: black !important;
    }
    .dropdown-menu {
      background: #f5f5f5 !important;
      border-color: gray !important;
    }
    .dropdown-menu .goog-menuitem {
      color: #555 !important;
    }`);
 sb3theme.onNew(function(name, block, classes, blockData) {
    blockData.lines = [];
    if(classes.indexOf("c-block") != -1) {
      for(let i in blockData.inputList) {
        let input = blockData.inputList[i];
        if(input.name.match(/SUBSTACK/)) {
          let line = document.createElementNS( sb3theme.svg.namespaceURI , 'line');
          line.setAttribute("x1", 15);
          line.setAttribute("x2", 15);
          line.setAttribute("stroke", "gray");
          block.appendChild(line);
          blockData.lines.push([input, line]);
        }
      }
    }
  });

  sb3theme.onChange(function(name, block, classes, blockData) {
    for(let i in blockData.lines) {
      let input = blockData.lines[i][0];
      let line = blockData.lines[i][1];
      let y1 = input.connection.y_ - input.sourceBlock_.getRelativeToSurfaceXY().y;
      line.setAttribute("y1", y1);
      line.setAttribute("y2", y1 + input.renderHeight);
    }
  });
})();