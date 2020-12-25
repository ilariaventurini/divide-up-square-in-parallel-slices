import React, { useState } from 'react'
import { computeSquareSlices } from '../../dist';
import { randomWithFixedSum } from '../utils';
import { Datum } from './Page';

const SIDE = 270
const START_POINT = { x: 0, y: 0 }
export const FILL_OPACITY = 0.6
export const FILL_HOVERED_OPACITY = 0.8

interface Props {
  className?: string
  dataset: Datum[]
  hoveredIndex: null | number
  setHoveredIndex: (index: null | number) => void
}

export const Square: React.FC<Props> = ({ className = "", dataset, hoveredIndex, setHoveredIndex }) => {
  const slicesInfo = computeSquareSlices(dataset, SIDE, START_POINT)

  return (
    <div className={`-square ${className}`}>
      <svg width={SIDE} height={SIDE} x={START_POINT.x} y={START_POINT.y} >
        {slicesInfo.map((wave, i) => {
          const {
            // @ts-ignore
            percentage, color,
            vertices, height
          } = wave
          const { middlePointLeftDiagonal, middlePointRightDiagonal } = height
          const { ldt, ldb, rdt, rdb, rt, lb } = vertices
          const isHovered = i === hoveredIndex

          const path = `
            M ${ldt.x} ${ldt.y}
            L ${rt.x} ${rt.y}
            L ${rdt.x} ${rdt.y}
            L ${rdb.x} ${rdb.y}
            L ${lb.x} ${lb.y}
            L ${ldb.x} ${ldb.y}
            Z
          `

          return (
            percentage > 0 && (
              <path
                key={i}
                className="cursor-pointer"
                d={path}
                fill={color}
                fillOpacity={isHovered ? FILL_HOVERED_OPACITY : FILL_OPACITY}
                onPointerOver={() => setHoveredIndex(i)}
                onPointerOut={() => setHoveredIndex(null)}
              />
            )
          )
        })}
      </svg>
    </div >
  )
}
