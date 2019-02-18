'use strict';

const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const banned = require('./banned.json');

function descriptiveLinkText(ast, file) {
  const textToNodes = {};
  const aggregate = node => {
    const text = node.children.reduce((str, arr) => {
      if (arr.type == 'text') str += arr.value;
      return str;
    }, '');

    if (!text) return;

    if (!textToNodes[text]) {
      textToNodes[text] = [];
    }

    textToNodes[text].push(node);
  };

  visit(ast, 'link', aggregate);

  return Object.keys(textToNodes).map(txt => {
    const nodes = textToNodes[txt];
    if (!nodes) return;
    if (banned.indexOf(txt.toLowerCase()) > -1) {
      for (const node of nodes) {
        file.message(
          `Replace "${txt}" with descriptive link text that details the destination.`,
          node
        );
      }
    }
  });
}

module.exports = rule('remark-lint:link-text', descriptiveLinkText);
