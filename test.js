'use strict';

const remark = require('remark');
const dedent = require('dedent');
const plugin = require('.');
const banned = require('./banned.json');

const processMarkdown = (markdown, opts) => {
  return remark()
    .use(plugin, opts)
    .process(markdown);
};

describe('banned.json', () => {
  test(`banned.json is an array`, () => {
    expect(typeof banned).toBe('object');
    expect(banned.length).toBeGreaterThan(0);
  });

  banned.forEach(phrase => {
    test(`"${phrase}" is a string`, () => {
      expect(typeof phrase).toBe('string');
    });
    test(`"${phrase}" is lowercase`, () => {
      expect(phrase.toLowerCase()).toEqual(phrase);
    });
  });
});

describe('remark-lint-link-text', () => {
  test('no errors when no links present', () => {
    const lint = processMarkdown(dedent`
      # Title

      No URLs in here.
    `);
    return lint.then(vFile => {
      expect(vFile.messages.length).toBe(0);
    });
  });

  test('warns against banned link text', () => {
    const lint = processMarkdown(
      dedent`
      # Title

      A good link: Visit [Mapbox Documentation](https://docs.mapbox.com) for more infomration.

      A bad link: [click here](https://docs.mapbox.com).
    `
    );

    return lint.then(vFile => {
      expect(vFile.messages.length).toBe(1);
      expect(vFile.messages[0].reason).toBe(
        'Replace "click here" with descriptive link text that details the destination.'
      );
    });
  });

  test('warns against banned link text, case insensitve', () => {
    const lint = processMarkdown(
      dedent`
      # Title

      A bad link: [Click here](https://docs.mapbox.com).
    `
    );

    return lint.then(vFile => {
      expect(vFile.messages.length).toBe(1);
      expect(vFile.messages[0].reason).toBe(
        'Replace "Click here" with descriptive link text that details the destination.'
      );
    });
  });
});
