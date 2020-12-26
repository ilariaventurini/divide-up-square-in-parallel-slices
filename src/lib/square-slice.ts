import { sumBy } from 'lodash'
import { CumulativePercentage, Height, Percentage, Point, Side, SliceInfo, Vertices } from './types'
import { distanceBetweenPoints } from './math-utils'

/**
 * Return an array containing the slices info.
 * @param dataset dataset containing a percentage value
 * @param side square side lenght
 * @param startPoint top left square point
 */
export function computeSquareSlices<T extends Percentage>(
  dataset: T[],
  side: number,
  startPoint: Point
): Array<SliceInfo<T>> {
  if (!dataset.length) throw new Error(`The dataset must contain at least one element.`)
  if (side < 0) throw new Error(`Side must be a positive number. Your value is ${side}.`)

  const percentageSum = sumBy(dataset, 'percentage')
  if (Math.abs(percentageSum - 1) > 0.001)
    throw new Error(`The sum of 'percentage' values must be 1. Your sum is ${percentageSum}.`)

  const cumulativePercentages = computeCumulativePercentages(dataset)

  return computeSlices(side, startPoint, cumulativePercentages)
}

/**
 * Given an array of objects containing the property `percentage` (number in [0, 1]),
 * it returns an array of objects containing the original values and the cumulative percentage value.
 * The cumulative percentage is "symmetric". This measn that when the cumulative value is > 0.5,
 * then the cumulatove vaues are computed starting from the end of the dataset array.
 * @param dataset array of objects containing a property `percentage` (number in [0, 1]) that is the percentage of area to be represented
 */
function computeCumulativePercentages<T extends Percentage>(
  dataset: T[]
): Array<CumulativePercentage<T>> {
  const withCumulativePercentage = [...dataset]
  let i = withCumulativePercentage.length - 1
  let cumulativePercentage = 0

  while (i >= 0) {
    cumulativePercentage += withCumulativePercentage[i].percentage

    // @ts-ignore
    withCumulativePercentage[i].cumulativePercentage =
      cumulativePercentage < 0.5
        ? cumulativePercentage
        : 1 - cumulativePercentage + withCumulativePercentage[i].percentage
    i--
  }
  return withCumulativePercentage as Array<CumulativePercentage<T>>
}

/**
 * Return an array containing the slices info.
 * @param squareSide square side lenght
 * @param startPoint top left square point
 * @param dataset dataset containing cumulative percentage values
 */
function computeSlices<T extends Percentage>(
  squareSide: number,
  startPoint: Point,
  dataset: Array<CumulativePercentage<T>>
): Array<SliceInfo<T>> {
  const { x: xs, y: ys } = startPoint
  const squareArea = squareSide * squareSide

  // find index of element that lay on square diagonal
  const overSliceIndex = dataset.findIndex((d) => d.cumulativePercentage >= 0.5)

  // add side (left | right | null) property to each datum
  // based on its position respect of the diagonal
  const withSide = dataset.map((datum, i) => ({
    ...datum,
    side: (i < overSliceIndex ? 'left' : i === overSliceIndex ? 'over' : 'right') as Side,
  }))

  // add area, cumulativeArea, tmpL and cumulativeL to each datum
  const withAreaAndTmpL = withSide.map((datum) => {
    const { percentage, cumulativePercentage } = datum
    const area = squareArea * percentage
    const cumulativeArea = squareArea * cumulativePercentage
    const tmpL = Math.sqrt(2 * area)
    const cumulativeL = Math.sqrt(2 * cumulativeArea)
    return { ...datum, area, cumulativeArea, tmpL, cumulativeL }
  })

  // add real l to each datum
  // l is the slice width (see disegnini)
  const withAreaAndL = withAreaAndTmpL.map((datum, i) => {
    const isFirst = i === 0
    const isLast = i === withAreaAndTmpL.length - 1
    const { side, cumulativeL } = datum
    let l = null
    if (isFirst || isLast) l = cumulativeL
    else if (side === 'left') l = cumulativeL - withAreaAndTmpL[i - 1].cumulativeL
    // don't remember why +1 is necessary
    else if (side === 'right') l = cumulativeL - withAreaAndTmpL[i + 1].cumulativeL + 1
    else l = 0 // 0 is is over element
    return { ...datum, l }
  })

  const xLeft = xs
  const xRight = xs + squareSide
  const yTop = ys
  const yBottom = ys + squareSide

  // compute polygons coordinates of first, last and middle slices
  const withVertices = withAreaAndL.map((datum, i) => {
    const { l, cumulativeL, side } = datum
    const isFirst = i === 0
    const isLast = i === withAreaAndL.length - 1
    const isLeft = side === 'left'
    const isRight = side === 'right'

    let vertices = {}
    if (isLeft) {
      const xm = isFirst ? xLeft : xLeft + cumulativeL - l
      const xr = xLeft + cumulativeL
      const ym = isFirst ? yTop : yTop + cumulativeL - l
      const yb = yTop + cumulativeL
      const a = { x: xm, y: yTop }
      const b = { x: xr, y: yTop }
      const c = { x: xr, y: yTop }
      const d = { x: xLeft, y: yb }
      const e = { x: xLeft, y: yb }
      const f = { x: xLeft, y: ym }
      vertices = { ldt: a, ldb: f, rdt: c, rdb: d, rt: b, lb: e } as Vertices
    }
    if (isRight) {
      const xm = isLast ? xRight : xRight - cumulativeL + l
      const xl = xRight - cumulativeL
      const ym = isLast ? yBottom : yBottom - cumulativeL + l
      const yt = yBottom - cumulativeL
      const a = { x: xRight, y: yt }
      const b = { x: xRight, y: yt }
      const c = { x: xRight, y: ym }
      const d = { x: xm, y: yBottom }
      const e = { x: xl, y: yBottom }
      const f = { x: xl, y: yBottom }
      vertices = { ldt: a, ldb: f, rdt: c, rdb: d, rt: b, lb: e } as Vertices
    }
    return { ...datum, vertices: vertices }
  })

  // compute polygon coordinates of over slice
  let overElementVertices = {}
  if (overSliceIndex === 0) {
    // percentage = 1 -> square
    if (dataset.length === 1) {
      overElementVertices = {
        ldt: { x: xLeft, y: yTop },
        ldb: { x: xLeft, y: yTop },
        rdt: { x: xRight, y: yBottom },
        rdb: { x: xRight, y: yBottom },
        rt: { x: xRight, y: yTop },
        lb: { x: xLeft, y: yBottom },
      } as Vertices
    } else {
      // first slice
      const nextOver = withVertices[overSliceIndex + 1].vertices as Vertices
      overElementVertices = {
        ldt: { x: xLeft, y: yTop },
        ldb: { x: xLeft, y: yTop },
        rdt: { ...nextOver.ldt },
        rdb: { ...nextOver.ldb },
        rt: { x: xRight, y: yTop },
        lb: { x: xLeft, y: yBottom },
      } as Vertices
    }
  } else if (overSliceIndex === dataset.length - 1) {
    const prevOver = withVertices[overSliceIndex - 1].vertices as Vertices
    overElementVertices = {
      ldt: { ...prevOver.rdt },
      ldb: { ...prevOver.rdb },
      rdt: { x: xRight, y: yBottom },
      rdb: { x: xRight, y: yBottom },
      rt: { x: xRight, y: yTop },
      lb: { x: xLeft, y: yBottom },
    } as Vertices
  } else {
    const prevOver = withVertices[overSliceIndex - 1].vertices as Vertices
    const nextOver = withVertices[overSliceIndex + 1].vertices as Vertices

    overElementVertices = {
      ldt: { ...prevOver.rdt },
      ldb: { ...prevOver.rdb },
      rdt: { ...nextOver.ldt },
      rdb: { ...nextOver.ldb },
      rt: { x: xRight, y: yTop },
      lb: { x: xLeft, y: yBottom },
    } as Vertices
  }
  withVertices[overSliceIndex] = {
    ...withVertices[overSliceIndex],
    vertices: overElementVertices as Vertices,
  }

  // compute slices height and diagonals lenght
  const withHeightAndDiagonalsLenght = withVertices.map((slice) => {
    const { ldt, ldb, rdt, rdb } = slice.vertices as Vertices
    const middlePointLeftDiagonal = {
      x: (ldt.x + ldb.x) / 2,
      y: (ldt.y + ldb.y) / 2,
    }
    const middlePointRightDiagonal = {
      x: (rdt.x + rdb.x) / 2,
      y: (rdt.y + rdb.y) / 2,
    }
    const height = distanceBetweenPoints(middlePointLeftDiagonal, middlePointRightDiagonal)
    const leftDiagonalLenght = distanceBetweenPoints(ldt, ldb)
    const rightDiagonalLenght = distanceBetweenPoints(rdt, rdb)
    return {
      ...slice,
      height: {
        h: height,
        middlePointLeftDiagonal,
        middlePointRightDiagonal,
      } as Height,
      leftDiagonalLenght,
      rightDiagonalLenght,
    }
  })

  // add slice path
  const withSlicePath = withHeightAndDiagonalsLenght.map((datum) => {
    const { vertices } = datum
    // @ts-ignore
    const { ldt, ldb, rdt, rdb, rt, lb } = vertices

    const slicePath = `
            M ${ldt.x} ${ldt.y}
            L ${rt.x} ${rt.y}
            L ${rdt.x} ${rdt.y}
            L ${rdb.x} ${rdb.y}
            L ${lb.x} ${lb.y}
            L ${ldb.x} ${ldb.y}
            Z
          `
    return { ...datum, slicePath }
  })

  // @ts-ignore
  return withSlicePath
}
