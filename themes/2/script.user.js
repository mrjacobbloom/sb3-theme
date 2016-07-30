// ==UserScript==
// @name         sb3theme: 2
// @author       Airhogs777
// @include      /^.*/(vertical|horizontal)_playground.html?$/
// @grant        none
// @require      https://airhogs777.github.io/sb3-theme/sb3-theme.js
// ==/UserScript==

(function() {
  'use strict';
  sb3theme.options.menuColors = false;
  
  // filters created by @as-com and stolen with love from from github.com/tjvr/scratchblocks 
  sb3theme.addFilter(`<filter id="bevelFilter" x0="-50%" y0="-50%" width="200%" height="200%">
          <feGaussianBlur result="blur-1" in="SourceAlpha" stdDeviation="1 1" />
          <feFlood result="flood-2" in="undefined" flood-color="#fff" flood-opacity="0.15" />
          <feOffset result="offset-3" in="blur-1" dx="1" dy="1" />
          <feComposite result="comp-4" operator="arithmetic" in="SourceAlpha" in2="offset-3" k2="1" k3="-1" />
          <feComposite result="comp-5" operator="in" in="flood-2" in2="comp-4" />
          <feFlood result="flood-6" in="undefined" flood-color="#000" flood-opacity="0.7" />
          <feOffset result="offset-7" in="blur-1" dx="-1" dy="-1" />
          <feComposite result="comp-8" operator="arithmetic" in="SourceAlpha" in2="offset-7" k2="1" k3="-1" />
          <feComposite result="comp-9" operator="in" in="flood-6" in2="comp-8" />
          <feMerge result="merge-10">
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="comp-5" />
            <feMergeNode in="comp-9" />
          </feMerge>
          </filter>`);
  sb3theme.addFilter(`<filter id="inputDarkFilter" x0="-50%" y0="-50%" width="200%" height="200%">
          <!-- dark filter chunk -->
           <feFlood result="flood-1" in="undefined" flood-color="#000" flood-opacity="0.2"></feFlood>
           <feComposite result="comp-2" operator="in" in="flood-1" in2="SourceAlpha"></feComposite>
           <feMerge result="merge-3">
              <feMergeNode in="comp-2"></feMergeNode>
           </feMerge>
           <!-- bevel filter chunk -->
           <feGaussianBlur result="blur-1" in="SourceAlpha" stdDeviation="1 1"></feGaussianBlur>
           <feFlood result="flood-2" in="undefined" flood-color="#fff" flood-opacity="0.15"></feFlood>
           <feOffset result="offset-3" in="blur-1" dx="-1" dy="-1"></feOffset>
           <feComposite result="comp-4" operator="arithmetic" in="SourceAlpha" in2="offset-3" k2="1" k3="-1"></feComposite>
           <feComposite result="comp-5" operator="in" in="flood-2" in2="comp-4"></feComposite>
           <feFlood result="flood-6" in="undefined" flood-color="#000" flood-opacity="0.7"></feFlood>
           <feOffset result="offset-7" in="blur-1" dx="1" dy="1"></feOffset>
           <feComposite result="comp-8" operator="arithmetic" in="SourceAlpha" in2="offset-7" k2="1" k3="-1"></feComposite>
           <feComposite result="comp-9" operator="in" in="flood-6" in2="comp-8"></feComposite>
           <feMerge result="merge-10">
              <feMergeNode in="comp-5"></feMergeNode>
              <feMergeNode in="comp-9"></feMergeNode>
           </feMerge>
           <feMerge result="merge-11">
              <feMergeNode in="SourceGraphic"></feMergeNode>
              <feMergeNode in="merge-3"></feMergeNode>
              <feMergeNode in="merge-10"></feMergeNode>
           </feMerge>
        </filter>`);
  sb3theme.addFilter(`<filter id="inputBevelFilter" x0="-50%" y0="-50%" width="200%" height="200%">
           <feGaussianBlur result="blur-1" in="SourceAlpha" stdDeviation="1 1"></feGaussianBlur>
           <feFlood result="flood-2" in="undefined" flood-color="#fff" flood-opacity="0.15"></feFlood>
           <feOffset result="offset-3" in="blur-1" dx="-1" dy="-1"></feOffset>
           <feComposite result="comp-4" operator="arithmetic" in="SourceAlpha" in2="offset-3" k2="1" k3="-1"></feComposite>
           <feComposite result="comp-5" operator="in" in="flood-2" in2="comp-4"></feComposite>
           <feFlood result="flood-6" in="undefined" flood-color="#000" flood-opacity="0.7"></feFlood>
           <feOffset result="offset-7" in="blur-1" dx="1" dy="1"></feOffset>
           <feComposite result="comp-8" operator="arithmetic" in="SourceAlpha" in2="offset-7" k2="1" k3="-1"></feComposite>
           <feComposite result="comp-9" operator="in" in="flood-6" in2="comp-8"></feComposite>
           <feMerge result="merge-10">
              <feMergeNode in="SourceGraphic"></feMergeNode>
              <feMergeNode in="comp-5"></feMergeNode>
              <feMergeNode in="comp-9"></feMergeNode>
           </feMerge>
        </filter>`);
  sb3theme.addFilter(`<filter id="dragFilter" height="140%" width="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur>
          <feComponentTransfer result="offsetBlur">
              <feFuncA type="linear" slope="0.5"></feFuncA>
          </feComponentTransfer>
          <feOffset in="offsetBlur" dx="10" dy="10" result="shadow"/>
          <feComposite in="SourceGraphic" in2="shadow" operator="over"></feComposite>
          
       </filter>`);

  sb3theme.onLoad(function() {
    sb3theme.colors.motion.primary = '#4a6cd4';
    sb3theme.colors.motion.secondary = '#4a6cd4';
    sb3theme.colors.motion.tertiary = '#4a6cd4';
    sb3theme.colors.looks.primary = '#8a55d7';
    sb3theme.colors.looks.secondary = '#8a55d7';
    sb3theme.colors.looks.tertiary = '#8a55d7';
    sb3theme.colors.sounds.primary = '#bb42c3';
    sb3theme.colors.sounds.secondary = '#bb42c3';
    sb3theme.colors.sounds.tertiary = '#bb42c3';
    sb3theme.colors.pen.primary = '#0e9a6c';
    sb3theme.colors.pen.secondary = '#0e9a6c';
    sb3theme.colors.pen.tertiary = '#0e9a6c';
    sb3theme.colors.event.primary = '#c88330';
    sb3theme.colors.event.secondary = '#c88330';
    sb3theme.colors.event.tertiary = '#c88330';
    sb3theme.colors.control.primary = '#e1a91a';
    sb3theme.colors.control.secondary = '#e1a91a';
    sb3theme.colors.control.tertiary = '#e1a91a';
    sb3theme.colors.sensing.primary = '#2ca5e2';
    sb3theme.colors.sensing.secondary = '#2ca5e2';
    sb3theme.colors.sensing.tertiary = '#2ca5e2';
    sb3theme.colors.operators.primary = '#5cb712';
    sb3theme.colors.operators.secondary = '#5cb712';
    sb3theme.colors.operators.tertiary = '#5cb712';
    sb3theme.colors.data.primary = '#ee7d16';
    sb3theme.colors.data.secondary = '#ee7d16';
    sb3theme.colors.data.tertiary = '#ee7d16';
  });

  sb3theme.style(`
    .blocklyMainBackground {
      fill: rgb(221, 222, 222) !important;
    }
    .blocklyDragSurface > g {
      filter: url(#dragFilter);
    }
    .block-background {
      filter: url(#bevelFilter);
    }
    .input-background {
      filter: url(#inputBevelFilter);
    }
    .input-dropdown .input-background, .input-boolean.input-background {
      filter: url(#inputDarkFilter) !important;
    }
    text.blocklyText {
        font-weight: bold;
    }
    .blocklyEditableText > text {
      font-weight: normal;
      word-spacing: 0;
    }
    .blocklyDropdownText tspan {
      fill: black;
      font-size: 16pt;
    }
    .replaceable.input > .input-background,
    .replaceable.input-boolean,
    .replaceable > .block-background {
      stroke: rgba(255, 255, 255, .5);
      stroke-width: 5px;
    }
    `);

})();