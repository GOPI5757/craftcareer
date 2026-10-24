# CraftCareer offline icons

The creator bundles 2,259 choices: the complete 2,234-name Google Material Icons catalog, 19 Simple Icons brand marks, and six small original symbols. All 616 Material names requested for CraftCareer are included. Material icons include some synonymous names that share a glyph.

The icon picker displays the picture and its name. Search accepts the original underscore names as well as friendly names. Icons are bundled locally; no Google Fonts request, CDN, sign-in, or network connection is needed when editing or viewing an exported portfolio.

## Sources and licenses

- **Material Icons**: Google Material Design Icons, Apache License 2.0. The original font and name/codepoint list are retained here with `MATERIAL-LICENSE.txt`. Font obtained from the official Google Fonts Material Icons v145 endpoint: `https://fonts.gstatic.com/s/materialicons/v145/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2`. Name/codepoint source: `https://github.com/google/material-design-icons/blob/master/font/MaterialIcons-Regular.codepoints`.
- **Brand marks**: Simple Icons 11.14.0, CC0 1.0. Source: `https://github.com/simple-icons/simple-icons/tree/11.14.0/icons`. See `SIMPLE-ICONS-LICENSE.md`. Included: Unreal Engine, Unity, C++, C#, HTML, CSS, JavaScript, Autodesk Maya, LinkedIn, GitHub, Sketchfab, ArtStation, itch.io, Steam, YouTube, Discord, Figma, Adobe Photoshop, Blender. Brand names and marks belong to their respective owners.
- **Original geometric symbols**: wireframe cube, Git branch/fork/pull request, favicon. These are original CraftCareer SVG drawings, released under CC0 1.0 for reuse with exported websites.
- **Marmoset Toolbag** is represented by an explicitly labelled **MT monogram**. It is a text abbreviation, not the official Marmoset logo.

## Integration

Load `icons.js` before the editor or site runtime. The same script works in a browser or with CommonJS:

```js
CraftIcons.catalog                 // [{id, name, category, keywords, kind, ...}]
CraftIcons.categories              // category names; prepend your own “All” tab
CraftIcons.search('git', 'All')     // matching catalog entries
CraftIcons.get('mi:home')           // one catalog entry, or null
CraftIcons.resolve('C++')           // 'brand:cplusplus'
CraftIcons.has('cloud_upload')      // true
CraftIcons.render('mi:home', document) // a safe DOM span; auto-installs local CSS
CraftIcons.install(document)       // optional early font CSS installation
CraftIcons.css                     // complete CSS, including embedded WOFF2 font
```

Persist `id` values in config files. Supported IDs are `mi:name`, `brand:name`, and `custom:name`. For compatibility, raw Material names and documented aliases also resolve. Unknown strings are rendered as plain text, so older portfolios’ simple symbol icons remain usable. Icons are decorative (`aria-hidden`); give an icon-only button or meaningful standalone icon an accessible name on its containing element.

`render()` accepts a target document, so preview iframe icons use the correct DOM and font. Its output does not use `innerHTML`, external SVG links, or executable content. Icons inherit `color` and scale with the container’s `font-size`.

To regenerate after editing the catalog, run `node icons/build-icons.cjs` from the creator directory. To verify coverage against the actual bundled font, run `node icons/verify-icons.cjs`. The latter independently decodes the WOFF2 character map and checks every catalog glyph.

Keep `icons.js` and this license folder in distributed creator packages. Exported sites need `icons.js` plus the license notices; the separate font/SVG originals are optional because the script already contains their data.

Additional social, publishing and collaboration logos are bundled from Simple Icons 11.14.0 (CC0-1.0), the same licensed source as the original brand library. Brand names and logos remain subject to their respective trademark policies.
