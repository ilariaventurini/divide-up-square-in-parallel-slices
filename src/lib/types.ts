export interface Point {
  x: number
  y: number
}

export interface Percentage {
  percentage: number
}

export interface Datum extends Percentage {
  label: string
  value: number
  onClick?: () => void
}

export type CumulativePercentage<T> = T & Percentage & { cumulativePercentage: number }

export type Side = 'left' | 'right' | 'over'

export interface Height {
  h: number
  middlePointLeftDiagonal: Point
  middlePointRightDiagonal: Point
}
export interface Vertices {
  ldt: Point
  ldb: Point
  rdt: Point
  rdb: Point
  rt: Point
  lb: Point
}
export type SliceInfo<T> = CumulativePercentage<T> & {
  side: Side
  area: number
  cumulativeArea: number
  tmpL: number
  cumulativeL: number
  l: number
  height: Height
  vertices: Vertices
  leftDiagonalLenght: number
  rightDiagonalLenght: number
  slicePath: string
}
