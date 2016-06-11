function Sb3Theme() {

  // hang out until the SVG exists, then run the init function
  var observer = new MutationObserver(function(mutations) {
    if(document.querySelector('svg.blocklySvg')) {
      observer.disconnect();
      initSVG();
    }
  });

  if(document.querySelector('svg.blocklySvg')) {
    initSVG();
  } else {
    observer.observe(document.getElementsByTagName('html')[0], {childList: true, subtree: true}); // <body> doesn't always exist at runtime
  }

  function initSVG() {
    this.svg = document.querySelector('svg.blocklySvg'); // Blockly.WorkspaceSVG.cachedParentSvg_;
    this.horizontal = Blockly.WorkspaceSVG.horizontalLayout;
    this.css = Blockly.Css.styleSheet;
    this.NS = Blockly.SVG_NS;
    this.defs = this.svg.getElementsByTagName('defs')[0];
    runOnLoads();
  }

  var onLoads = [];
  this.addInit = function(func) {
    onLoads.push(func);
  }
  function runOnLoads() {
    for(i in onLoads) {
      onLoads[i]();
    }
  }

  this.addFilter = function(filter) {
    console.log("namespace: " + this.NS);
    var doc = new DOMParser().parseFromString(`<svg xmlns="` + this.NS + `">` + filter + `</svg>`, 'image/svg+xml');
    defs.appendChild( this.defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
  }

}
