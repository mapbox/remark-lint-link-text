# remark-lint-link-text

A remark-lint plugin that warns against non-descriptive link text.

```
✅ Visit [Mapbox documentation](https://docs.mapbox.com) to learn more.
🚫 Learn more [here](https://docs.mapbox.com).
```

The linter warns against:

- click here
- here
- read more
- this link
- more here
- this article
- this [whatever words in between] article

And [several others](banned.json).

💡 For all banned phrases that begin with `this` or `the`, any words that come between will also fail. For example "this post", "this Mapbox post", and "this Mapbox blog post" will all fail.

## Install

```
npm install --save-dev remark-cli @mapbox/remark-lint-link-text
```

In `package.json`:

```
"scripts": {
  "lint-md": "remark src/pages/"
},
"remarkConfig": {
  "plugins": [
    ["@mapbox/remark-lint-link-text", [2]]
  ]
},
```

If you do not want the linter to fail, but only give warnings:

```
"remarkConfig": {
  "plugins": [
    "@mapbox/remark-lint-link-text"
  ]
},
```

## Banned link text

Save banned link text in [banned.json](banned.json).

## Proper link text guidelines

> When calling the user to action, use brief but meaningful link text that:
>
> - provides some information when read out of context
> - explains what the link offers
> - doesn't talk about mechanics
> - is not a verb phrase

- https://www.w3.org/QA/Tips/noClickHere

> Write links that make sense out of context. Use descriptive link text detailing the destination; not just “click here,” or other similar phrases.

- http://accessibility.psu.edu/linktext/
