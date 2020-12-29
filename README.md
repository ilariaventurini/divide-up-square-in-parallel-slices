<div align="center" style="text-align: center;">
  <h1>Divide a square in parallel slices</h1>

Divide a square in parallel slices whose area is proportional to the data
[demo page](https://divide-up-square-in-parallel-slices.vercel.app/)
</div>

<p align="center">
  <!-- npm version -->
  <a href="https://www.npmjs.com/package/divide-up-square-in-parallel-slices">
    <img alt="npm"
      src="https://img.shields.io/npm/v/divide-up-square-in-parallel-slices">
  </a>
</p>

</div>

---

This library allows you to divide a square into parallel slices whose area is proportional to the data received in input.
Here is an example:

![step1](https://user-images.githubusercontent.com/44204353/103179908-cf93ea00-4890-11eb-842b-8f7d56e98152.png)

This means that the red slice (`S1`) has area equal to 30% of the area of ​​the square, the blue slice (`S2`) also, and the green slice (`S3`) has area equal to 40% of the total square area.

## Install

```bash
yarn add divide-up-square-in-parallel-slices
```

or

```bash
npm install divide-up-square-in-parallel-slices --save
```

## Screenshots

![demo](https://user-images.githubusercontent.com/44204353/103179904-cacf3600-4890-11eb-9eed-687a068f2427.gif)

## API

As seen before, you can create parallel slices proportional to square area.

### `computeSquareSlices(dataset, squareSide)`

The `computeSquareSlices` function accepts two parameters and returns an array of objects containing useful information about each slice.

#### Parameters

| Argument     | Type     | Description                                                                              |
| ------------ | -------- | ---------------------------------------------------------------------------------------- |
| `dataset`    | `T[]`    | array of objects, each object must contains a `percentage` property (number in `[0, 1]`) |
| `squareSide` | `number` | square side lenght                                                                       |

**Note**: the sum of `percentage` values must be 1.

and:

```ts
interface Point {
  x: number
  y: number
}
```

#### Returns

The returned array contains one object for each slice. Each object has these properties:

| Property name              | Type                        | Description                                                        |
| -------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `...datum`                 | /                           | the original `dataset` object info                                 |
| `percentage`               | `number`                    | number in `[0, 1]`                                                 |
| `cumulativePercentage`     | `number`                    | cumulative percentage value                                        |
| `sidePosition`             | `left` or `right` or `over` | slice position compared to square diagonal                         |
| `vertices`                 | `Vertices`                  | slice vertices coordinates                                         |
| `height`                   | `number`                    | slice height                                                       |
| `middlePointLeftDiagonal`  | `Point`                     | coordinates of the point at the center of the slice left diagonal  |
| `middlePointRightDiagonal` | `Point`                     | coordinates of the point at the center of the slice right diagonal |
| `leftDiagonalLenght`       | `number`                    | left diagonal lenght                                               |
| `rightDiagonalLenght`      | `number`                    | rigth diagonal lenght                                              |
| `path`                     | `string`                    | slice path                                                         |

```ts
interface Vertices {
  ldt: Point
  ldb: Point
  rdt: Point
  rdb: Point
  rt: Point
  lb: Point
}
```

## Example

I hope the following example can better explain the information written above.

```ts
import { computeSquareSlices } from 'divide-up-square-in-parallel-slices'

const dataset = [
  { percentage: 0.3, color: "#ff787a" },
  { percentage: 0.3, color: "#7f7ad9" },
  { percentage: 0.4, color: "#74dfc9" },
]
const squareSide = 125
const slicesInfo = computeSquareSlices(dataset, squareSide)

// [
//   {
//     "percentage": 0.3,
//     "color": "#ff787a",
//     "cumulativePercentage": 0.3,
//     "sidePosition": "left",
//     "vertices": {
//       "ldt": { "x": 0,  "y": 0 },
//       "ldb": { "x": 0,  "y": 0 },
//       "rdt": { "x": 193.64916731037084, "y": 0 },
//       "rdb": { "x": 0, "y": 193.64916731037084 },
//       "rt": { "x": 193.64916731037084, "y": 0 },
//       "lb": { "x": 0, "y": 193.64916731037084 }
//     },
//     "height": 136.93063937629154,
//     "middlePointLeftDiagonal": { "x": 0, "y": 0 },
//     "middlePointRightDiagonal": { "x": 96.82458365518542, "y": 96.82458365518542 },
//     "leftDiagonalLenght": 0,
//     "rightDiagonalLenght": 273.8612787525831,
//     "path": "M 0 0L 193.64916731037084 0L 193.64916731037084 0L 0 193.64916731037084L 0 193.64916731037084L 0 0 Z"
//   },
//   { ... },
//   { ... }
```

You can draw the slice using the information above and here is the result:

![step1](https://user-images.githubusercontent.com/44204353/103179926-fce09800-4890-11eb-9de0-ec2cc5e07bf6.png)

In particular:

![stepS1](https://user-images.githubusercontent.com/44204353/103180717-9b242c00-4898-11eb-820e-9f9e96df0635.png)

the red slice has `side = left` because it lays on the left side of the square diagonal (the diagonal that connects the top-left vertice to the bottom-right vertice).

![stepS2](https://user-images.githubusercontent.com/44204353/103180718-9cedef80-4898-11eb-880d-1ad0d5e49032.png)

the blue slice has `side = over` because its area it's above the square diagonal.

And so on...

## Demo page

A [demo page](https://divide-up-square-in-parallel-slices.vercel.app/) is available.

## License

[MIT](https://github.com/ilariaventurini/divide-up-square-in-parallel-slices/blob/master/LICENSE) © [Ilaria Venturini](https://github.com/ilariaventurini)
