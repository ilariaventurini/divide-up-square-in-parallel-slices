import React from 'react'
import { computeSquareSlices } from '../../dist';
import { Datum } from './Page';

export const SQUARE_SIDE = 250
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
  const slicesInfo = computeSquareSlices(dataset, SQUARE_SIDE)
  console.log('slicesInfo: ', slicesInfo);

  return (
    <div className={`-square ${className}`}>
      <svg width={SQUARE_SIDE} height={SQUARE_SIDE} x={START_POINT.x} y={START_POINT.y} >
        {slicesInfo.map((wave, i) => {
          // @ts-ignore
          const { percentage, color, path } = wave
          const isHovered = i === hoveredIndex

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
