// in custom-plotly.js
var Plotly = require('plotly.js/lib/core');

// Load in the trace types for bar and line
Plotly.register([
    require('plotly.js/lib/bar'),
    require('plotly.js/lib/line')
]);

module.exports = Plotly;