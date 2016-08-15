# Jolly

[1]: <http://github.com/Gerrproger/Jolly>

_Modern responsive carousel with zooming_

## Demo

[http://gerrproger.github.io/Jolly](http://gerrproger.github.io/Jolly)

## Browser support

Works on IE10+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

## Dependencies

None!

## Features

- Modern and lightweight carousel.
- With no dependencies.
- Fully customizable appearance through CSS.
- Lovely zooming out of the box.
- Easy customizable effects & timings (CSS3 transitions).
- Responsive with infinite looping.
- Simple API and easy initialization (supports [data-] attributes).
- Has browser support detection.

## Quick setup
Here's a quick run through on getting up and running.

### Download
Get Jolly JS and CSS files.
- via npm: `npm install jolly-carousel`
- or via Bower: `bower install jolly-carousel`

### HTML
You just need any element in which the carousel would be installed. You can use `data-` attibutes, find more under [data attributes](#data attributes).
```html
<div id="myJolly"></div>
```

### CSS
Include the `jolly.min.css` stylsheet into your `<head>`. Of course you can then overwrite styles to fit your needs.
```html
<link rel="stylesheet" href="path/to/jolly.min.css">
```

### JavaScript 
Include the `jolly.min.js` script before the closing `</body>` tag and then call `jolly()` with two arguments: selector for the carousel target element and an array containing links with your images. More info on setup can be found under [initialising](#initialising).
```html
<script src="path/to/jolly.min.js"></script>
<script>
  jolly('#myJolly', [
    'path/to/image1.jpg',
    'path/to/image2.jpg',
    'path/to/image3.jpg'
  ]);
</script>
```

_Zoomed image size will be equal it's original size._

## Advanced

### Initialising
You only need to call `jolly(elements, images, settings)` function. All arguments are optional. Sometimes it is more convenient to use `data-` attributes for initialization, please see more under [data attributes](#data attributes).

#### Elements
You can specify one or more target elements passing NodeList, HTMLElement, Array of HTMLElements or string selector.
```js
jolly(document.querySelectorAll('.all-carousels'), settings);
jolly(document.querySelector('.carousel'), images, settings);
jolly('.carousel', images, settings);
```

#### Images
Specify an array containing link strings (URLs) with your images.
```js
jolly(elements, ['/img/image1.jpg', '/img/image2.jpg', '/img/image3.png'], settings);
jolly(['http://images.example/image1.jpg', 'https://images.example/image2.jpg', 'http://images.example/image3.png']);
```

#### Settings
Specify an object with options which will extend the default.
```js
jolly(elements, images, {offset: 200});
jolly({ offset: 100, reversed: true, zooming: false});
```

Here is a table of available settings:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `offset` | Number | `300` | Specify an offset (in `px`) from the left side of the carousel (or the right if the carousel is reflected) to the active image border. |
| `reflected` | Boolen | `false` | Reflects the carousel like in the mirror so it would stick to the right side. |
| `reversed` | Boolen | `false` | Your image would be scrolling in other direction. Usefull if you want to stick the carousel to the right side (with `reflected`) but want to preserve the images order. |
| `zooming` | Boolen | `true` | Enables zooming of the active image by hovering. Zoomed image size equals it's original size. So if the original image size (plus `zoomDif` value) is under the carousel element size no zooming will be performed. |
| `height` | Boolen or Number | `false` | Specify the height (in `px`) of the carousel. If equals `false` will be calculated automatically based on the target element's height.  |
| `zoomOffset` | Number | `5` | An offset from the border of the active image inside it which will be the "dead zone" of zooming. So you don't need to move the cursor to the very border to see the edge of the image. It is a coefficient and recommended values are form `0` to `10`. |
| `zoomDif` | Number | `10` | If the image side length plus this value (in `px`) is over it's original side length zooming will not be performed. This way you can set the minimal zooming threshold. |
| `zoomAnimDelay` | Number | `20` | Internal setting which is responsible for the animation smoothness when a zoom is performing. |
| `zoomAnimIncr` | Number | `0.3` | Internal setting which is responsible for the animation smoothness when a zoom is performing. |
| `selectors` | Object | [See source code](src/jolly.js#L35-L56) | You can override default `class` names if need to. |

### Data attributes
In progress..

## API
In progress..

## Issues

If you find anything weird with Jolly, please let me know using the GitHub issues tracker.

## License

Released under the terms of MIT License.
