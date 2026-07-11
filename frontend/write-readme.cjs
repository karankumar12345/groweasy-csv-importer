'use strict';
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'README.md');
const REPO = 'https://github.com/karankumar12345/groweasy-csv-importer';
const CLONE = 'https://github.com/karankumar12345/groweasy-csv-importer.git';
const lines = [];
const L = (s) => lines.push(s);