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

export type SidePosition = 'left' | 'right' | 'over'
export interface Vertices {
  ldt: Point
  ldb: Point
  rdt: Point
  rdb: Point
  rt: Point
  lb: Point
}
export type SliceInfo<T> = CumulativePercentage<T> & {
  sidePosition: SidePosition
  vertices: Vertices
  height: number
  middlePointLeftDiagonal: Point
  middlePointRightDiagonal: Point
  leftDiagonalLenght: number
  rightDiagonalLenght: number
  path: string
}
