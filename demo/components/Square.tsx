import React from 'react'
import { computeSquareSlices } from '../../dist';
import { randomWithFixedSum } from '../array-utils';

const SIDE = 300
const START_POINT = { x: 0, y: 0 }

export const Square = () => {
  const dataset = generateData(3)
  const slicesInfo = computeSquareSlices(dataset, SIDE, START_POINT)
  console.log('slicesInfo: ', slicesInfo);

  return (
    <div className="-square">
      <svg className="" width={SIDE} height={SIDE} x={START_POINT.x} y={START_POINT.y} >
        {slicesInfo.map((wave, i) => {
          const {
            percentage,
            vertices, height
          } = wave
          const { middlePointLeftDiagonal, middlePointRightDiagonal } = height
          const { ldt, ldb, rdt, rdb, rt, lb } = vertices

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
              <g key={i}>
                <circle className="-ldt" cx={ldt.x} cy={ldt.y} r={5} fill="cyan" />
                <circle className="-rt" cx={rt.x} cy={rt.y} r={5} fill="green" />
                <circle className="-rdt" cx={rdt.x} cy={rdt.y} r={5} fill="yellow" />
                <circle className="-rdb" cx={rdb.x} cy={rdb.y} r={5} fill="blue" />
                <circle className="-lb" cx={lb.x} cy={lb.y} r={5} fill="steelblue" />
                <circle className="-ldb" cx={ldb.x} cy={ldb.y} r={5} fill="purple" />
                <path
                  key={i}
                  className=""
                  d={path}
                  stroke={'black'}
                  strokeWidth={1}
                  fill="red"
                  fillOpacity={0.1}
                />
              </g>
            )
          )
        })}
      </svg>
    </div>
  )
}

function generateData(howManyData: number) {
  const data = randomWithFixedSum(howManyData, 1)
  return data.map(d => ({ percentage: d }))
}