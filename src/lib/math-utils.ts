import { Point } from './types'

/**
 * Converts degree to radians.
 * @param deg angle in degree
 */
export function degToRad(deg: number): number {
  return (Math.PI / 180) * deg
}

/**
 * Converts radians to degree.
 * @param deg angle in radians
 */
export function radToDeg(rad: number): number {
  return (180 / Math.PI) * rad
}

/**
 *                        * new point
 *                   .     -
 *              .           -
 *         .  degAngle        -
 *    *........................*
 *  center                    point
 *
 * Rotates the point `point` by angle `degAngle` with rotation point `center`.
 * @param point point to rotate
 * @param center rotation point
 * @param degAngle angle in degree
 */
export function rotate(point: Point, center: Point, degAngle: number): Point {
  const radians = degToRad(degAngle)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (point.x - center.x) + sin * (point.y - center.y) + center.x
  const ny = cos * (point.y - center.y) - sin * (point.x - center.x) + center.y
  return { x: nx, y: ny }
}

/**
 * Return the geometric distance between the two points.
 * @param p1 point one
 * @param p2 point two
 */
export function distanceBetweenPoints(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

/**
 * Return the middle point between the two points.
 * @param p1 point one
 * @param p2 point two
 */
export function middlePoint(p1: Point, p2: Point): Point {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}
