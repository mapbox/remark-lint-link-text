'use strict';

const remark = require('remark');
const dedent = require('dedent');
const plugin = require('.');
const banned = require('./banned.json');

const processMarkdown = (markdown, opts) => {
  return remark().use(plugin, opts).process(markdown);
};

describe('banned.json', () => {
  test(`banned.json is an array`, () => {
    expect(typeof banned).toBe('object');
    expect(banned.length).toBeGreaterThan(0);
  });

  banned.forEach((phrase) => {
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
    return lint.then((vFile) => {
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

    return lint.then((vFile) => {
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

    return lint.then((vFile) => {
      expect(vFile.messages.length).toBe(1);
      expect(vFile.messages[0].reason).toBe(
        'Replace "Click here" with descriptive link text that details the destination.'
      );
    });
  });

  test('the...documentation should pass', () => {
    const lint = processMarkdown(
      dedent`
      # Title

      A good link: [the Mapbox Isochrone API documentation](https://docs.mapbox.com).
    `
    );

    return lint.then((vFile) => {
      expect(vFile.messages.length).toBe(0);
    });
  });

  test('should pass', () => {
    const lint = processMarkdown(
      dedent`
      ## Option 1: Choropleth
      
      In this option, we will create a choropleth visualization using data from [The Washington Post's "2ºC: Beyond the Limit" series about rising temperatures](https://github.com/washingtonpost/data-2C-beyond-the-limit-usa), which analyzes warming temperatures in the United States.
    `
    );

    return lint.then((vFile) => {
      expect(vFile.messages.length).toBe(0);
    });
  });

  test('warns against banned link text, regex match', () => {
    const lint = processMarkdown(
      dedent`
      # Title

      A bad link: [this mapbox article](https://docs.mapbox.com).
      A bad link: [this Mapbox article](https://docs.mapbox.com).
      A bad link: [this article](https://docs.mapbox.com).
      A bad link: [this blog post](https://docs.mapbox.com).
      A bad link: [the Mapbox blog post](https://docs.mapbox.com).
    `
    );

    return lint.then((vFile) => {
      expect(vFile.messages.length).toBe(5);
      expect(vFile.messages[0].reason).toBe(
        'Replace "this mapbox article" with descriptive link text that details the destination.'
      );
      expect(vFile.messages[1].reason).toBe(
        'Replace "this Mapbox article" with descriptive link text that details the destination.'
      );
      expect(vFile.messages[2].reason).toBe(
        'Replace "this article" with descriptive link text that details the destination.'
      );
      expect(vFile.messages[3].reason).toBe(
        'Replace "this blog post" with descriptive link text that details the destination.'
      );
      expect(vFile.messages[4].reason).toBe(
        'Replace "the Mapbox blog post" with descriptive link text that details the destination.'
      );
    });
  });
});
