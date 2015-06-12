#!/usr/bin/env node
process.chdir(require('path').resolve(__dirname, '../'));
require('../controller').run();