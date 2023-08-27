# CLI for generate svg-sprite for Reactjs projects

[![](https://img.shields.io/npm/v/react-svg-sprite-generator?style=flat)](https://www.npmjs.com/package/react-svg-sprite-generator)

Install:
npm i --save-dev react-svg-sprite-generator

Run:
svgsprite --src ./assets/icons --dest ./src/components/Icon

This command:
1. Take all svg images in the folder ./assets/icons
2. Combine them into one svg file and save into file ./src/components/Icon/sprite.svg
3. Generate file with constants names and thumbnails for each image: ./src/components/Icon/names.js
4. Generate Readme.md file: ./src/components/Icon/Readme.md


Run without installation (with npx):
npx react-svg-sprite-generator  --src ./assets/icons --dest ./src/components/Icon

