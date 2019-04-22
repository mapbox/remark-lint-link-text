'use strict';

const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const banned = require('./banned.json');

const starts = ['this', 'the'];
const bannedRegex = banned.reduce((arr, b) => {
  starts.forEach(s => {
    const trimmed = b.replace(s, '').trim();
    if (b.startsWith(s) && arr.indexOf(trimmed) === -1)
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b`);
  });
  return arr;
}, []);

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

    // test regex
    starts.forEach(start => {
      if (txt.toLowerCase().startsWith(start)) {
        bannedRegex.forEach(reg => {
          if (new RegExp(`${reg}`, 'i').test(txt)) {
            for (const node of nodes) {
              file.message(
                `Replace "${txt}" with descriptive link text that details the destination.`,
                node
              );
            }
          }
        });
      }
    });

    // test banned words
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
