# Jolly

[1]: <http://github.com/Gerrproger/Jolly>

_Modern responsive infinite carousel with zooming_

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
- Target element remains untouched.
- Has browser support detection.

## Quick setup
Here's a quick run through on getting up and running.

### Download
Get Jolly JS and CSS files.
- via npm: `npm install jolly-carousel`
- or via Bower: `bower install jolly-carousel`

### HTML
You just need any element in which the carousel would be installed. You can use `data-` attibutes, find more under [data attributes](#data-attributes).
```html
<div id="myJolly"></div>
```

### CSS
Include the `jolly.min.css` stylsheet into your `<head>`. Of course you can then overwrite styles to fit your needs.
```html
<link rel="stylesheet" href="path/to/jolly.min.css">
```

### JavaScript 
Include the `jolly.min.js` script before the closing `</body>` tag and then call `jolly()` with two arguments: target elements selector and an array containing links with your images. More info on setup can be found under [initialising](#initialising).
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
You only need to call `jolly(elements, images, settings)` function. All arguments are optional. Sometimes it is more convenient to use `data-` attributes for initialization, please see more under [data attributes](#data-attributes).  

_This function returns an Array of HTMLElements (carousel target elements) or `false` if some error occurred. For example if browser is not supported._

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
jolly(['http://images.example/image1.jpg', 'https://images.example/image2.jpg']);
```

#### Settings
Specify an object with options which will extend the default.
```js
jolly(elements, images, {offset: 200});
jolly({ offset: 100, reversed: true, zooming: false});
```

Here is a table of the available settings:

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
| `selectors` | Object | [Refer source code](src/jolly.js#L35-L56) | You can override default `class` names if need to. |

### Data attributes
All arguments in `jolly()` function are optioanl. And you can use `data-jolly` and `data-jolly-settings` attributes to specify _images_ and _settings_ for each carousel.
```html
<div data-jolly="['img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg']"
  data-jolly-settings="{'offset': 100}"></div>
...
<div data-jolly="['img/image4.jpg', 'img/image5.jpg', 'img/image6.jpg']"
  data-jolly-settings="{'offset': 200, 'zooming': false}"></div>
...
<script>
  jolly('.carousels');
</script>
```
_Values should contain valid JSON except quotes, you can use single quotes instead of double._  

If you don't provide _elements_ argument, Jolly will find all elemnts with `data-jolly` attributes and they become targets.
```html
<!-- Offset is 100 -->
<div data-jolly="['img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg']"
  data-jolly-settings="{'offset': 100}"></div>
<!-- Offset is 200 -->
<div data-jolly="['img/image4.jpg', 'img/image5.jpg', 'img/image6.jpg']"></div>
<!-- Offset is 300 -->
<div data-jolly="['img/image7.jpg', 'img/image8.jpg', 'img/image9.jpg']"
  data-jolly-settings="{'offset': 300,}"></div>
...
<script>
  jolly({offset: 200});
</script>
```
_Data attributes always override options specified upon initialization via javascript._  

## API
A `jolly` object is added to any element that Jolly is initialized on. You can then control the carousel by accessing methods in the `jolly` object.  

You can use the return value from the call to `jolly()`. An array of instances is returned so you need to use an index.
```js
var instance = jolly('#myJolly')[0].jolly;
```

This will return an array of Jolly instances that were setup, so you need to specify the index of the instance you want or loop through of course.  

Once you have your instance, you can use the API methods on it.

```js
instance.next();
```

Here's a list of the methods supported:

| Method | Parameter | Description |
| --- | --- | --- |
| `prev()` | — | Makes active the previous image. |
| `next()` | — | Makes active the next image. |
| `destroy()` | — | Destroys the carousel and the current instance. Use this instead of the direct removing Jolly from DOM. |
| `enableZoom()` | — | Enables zooming for the active image. |
| `disableZoom` | — | Disables zooming for the active image. |
| `updateOffset(...)` | Number | Updates the `offset` [setting](#settings) and recalculates all distances. If no argument is passed the offset will be copied from the settings. |
| `updateHeight(...)` | Boolen or Number | Installs the new height according to the `height` [setting](#settings) and recalculates distances. If no argument is passed the value will be copied from the settings. This way if the height of the container (target element) changed you just need to call `updateHeight()` to update the carousel elements dimensions. |

You also can access the `settings` object to get the current settings and the `tree` object to get some internal information. These are read-only!

## Issues

If you find anything weird with Jolly, please let me know using the GitHub issues tracker.

## License

Released under the terms of MIT License.
