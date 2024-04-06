# CLI for generate svg-sprite for Reactjs projects

[![](https://img.shields.io/npm/v/react-svg-sprite-generator?style=flat)](https://www.npmjs.com/package/react-svg-sprite-generator)

## **Overview**

The **react-svg-sprite-generator** is a library specifically designed for React.js applications. It aids in generating SVG sprites from a directory of SVG files.

### Image Preview in an Autocomplete

![](./assets/autocomplete.gif)

The unique feature of the generated names.js is the inclusion of inline Base64 encoded previews of the SVG icons.
This means that in certain IDEs with markdown preview or image tooltip capabilities, you can actually hover over
the constant or view the names.js file to see a visual representation of the corresponding icon.

**Autocomplete** in IDEs **VSCode** and **Webstorm** will show a small image preview of the icon.
This visual feedback is invaluable when you're trying to pick the right icon for a specific context in your application.

By the way, I've created a [GitHub template](https://github.com/simprl/svg-icons-sprite-example) that simplifies the process of setting up and managing SVG icon libraries in the **GitHub**.
It also allows for easy **generation and publishing of a npm package** with the SVG sprite.
It's a great way to streamline your icon workflow. Check it out!

## **How to Use**

### Install:

```bash
npm i --save-dev react-svg-sprite-generator
```


### Setting up Source Files

Place your SVG icons in a directory. By default, the library looks for SVG files in the **src/assets/icons** directory.

For example, let's consider the following structure:

```css
src  
└── assets  
   └── icons
      └── group1
         ├── icon1.svg  
         └── icon2.svg
```

### Running the Generator

Execute the command from your terminal:

```bash
svgsprite
```

If you wish to specify a different source or destination directory, you can use the **\--src** and **\--dest** arguments respectively:

```bash
svgsprite --src assets/icons --dest src/components/Icon --doc docs/index.html
```

**--src:** Source directory containing SVG icons. By default, this parameter is **assets/icons**.

**--dest:** Destination directory where the generated sprite and other files will be placed. By default, this parameter is **src/components/Icon**.

**--doc:** Directory where the generated documentation will be saved (Optional).

### Generated Files Structure

After the execution, the default directory where the generated files will be placed is **./src/components/Icon**.

This will generate:

*   A combined SVG sprite (**sprite.svg**)
*   A JavaScript file with the names of your icons (**names.js**)
*   A markdown file for documentation (**Readme.md**)

For our example with **icon1.svg** and **icon2.svg**, the directory will look something like this:

```css
src
└── components
    └── Icon
        ├── sprite.svg
        ├── names.js
        └── Readme.md
docs
└── index.html
```

### Understanding the Generated Files

**sprite.svg:**

```xml
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="GROUP1_ICON1" viewBox="0 0 24 24">
        <!-- SVG content of icon1.svg -->
        <path d="..."></path>
        <!-- ... other SVG elements of icon1.svg ... -->
    </symbol>
    <symbol id="GROUP1_ICON2" viewBox="0 0 24 24">
        <!-- SVG content of icon2.svg -->
        <path d="..."></path>
        <!-- ... other SVG elements of icon2.svg ... -->
    </symbol>
</svg>
```

**names.js**: This file exports constant names for each SVG icon. The naming convention transforms the icon's file path and name to an uppercased version replacing non-alphanumeric characters with **\_**.

For instance, for our two icons, the **names.js** might look like:

```javascript
/**
 * ![](data:image/png;base64,...)  
 * group1/icon1.svg
 */
export const GROUP1_ICON1 = 'GROUP1_ICON1';

/**
 * ![](data:image/png;base64,...)  
 * group1/icon2.svg
 */
export const GROUP1_ICON2 = 'GROUP1_ICON2';
```

**Readme.md**: This file provides a markdown table which visually presents each icon, its name (as defined in **names.js**), and its original path.

For our example icons, the **Readme.md** will look like:

```plaintext
| Icon                                   | Name          | Path            | Source                   |
|----------------------------------------|---------------|-----------------|--------------------------|
| <svg width="24" height="24" ....>      | GROUP1_ICON1  | group1/icon1.svg| ![](....group1/icon1.svg)|
| <svg width="24" height="24" ....>      | GROUP1_ICON2  | group1/icon2.svg| ![](....group1/icon1.svg)|
```

**doc/index.html**: HTML file documenting the list of icons.

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <!-- Styles -->
  </head>
  <body>
    <table>
      <tr><th>Icon</th><th>Name</th><th>Path</th></tr>
      <tr><td><svg width="24" height="24" ....></td><td>GROUP1_ICON1</td><td>group1/icon1.svg</td></tr>
      <tr><td><svg width="24" height="24" ....> </td><td>GROUP1_ICON2</td><td>group1/icon2.svg</td></tr>
    </table>
  </body>
</html>
```
GitHub pages live example: [https://simprl.github.io/svg-icons-sprite-example/](https://simprl.github.io/svg-icons-sprite-example/)

GitHub pages example source code: [https://github.com/simprl/svg-icons-sprite-example/](https://github.com/simprl/svg-icons-sprite-example/)

![GitHub pages](./assets/github-pages.png)

### Usage in React

```tsx
import * as IconNames from './names.js';
import spriteUrl from './sprite.svg';

interface IconProps {
    name: (typeof IconNames)[keyof typeof IconNames];
}

const Icon = ({ name }: IconProps ) => {
    return (
        <svg>
            <use href={`${spriteUrl}#${name}`} />
        </svg>
    );
};

export default Icon;

```

```javascript
import * as IconNames from './names.js';
import Icon  from './Icon.js';

<Icon name={IconNames.ICON1} />

```

