import React, { useState } from 'react'
import { randomColor, randomIntegerInRange, randomWithFixedSum, roundToTwoDecimals } from '../utils';
import { FILL_HOVERED_OPACITY, FILL_OPACITY, Square } from './Square';

export interface Datum {
  percentage: number
  color: string
}

const MAX_SUM = 1
const COUNTER_EXTENT = [2, 6] as [number, number]
const datasetInit = generateData(3)

export const Page = () => {
  const [dataset, setDataset] = useState(datasetInit)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  console.log('dataset: ', dataset);

  const generateNewDataset = () => {
    const counter = randomIntegerInRange(COUNTER_EXTENT)
    const newDataset = generateData(counter)
    setDataset(newDataset)
  }

  return (
    <div className="-page w-full h-full flex flex-row justify-center items-center">
      <div className="flex">

        <div className="flex flex-col justify-center items-center">
          <Square dataset={dataset} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
          <div className="cursor-pointer select-none mt-4 px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 font-light rounded-sm" onClick={generateNewDataset}>Again!</div>
        </div>

        <div className="ml-4">
          {dataset.map((datum: Datum, i: number) => {
            const { percentage, color } = datum
            const isHovered = i === hoveredIndex
            return (
              <div
                key={i}
                className="flex flex-row items-center select-none cursor-pointer"
                onPointerOver={() => setHoveredIndex(i)}
                onPointerOut={() => setHoveredIndex(null)}
              >
                <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: color, opacity: isHovered ? FILL_HOVERED_OPACITY : FILL_OPACITY }}></div>
                <div className={`text-gray-800 ${isHovered ? 'font-normal' : 'font-light'}`} style={{ minWidth: 100 }}>{`${roundToTwoDecimals(percentage * 100)}%`}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function generateData(howManyData: number): Datum[] {
  const dataset = randomWithFixedSum(howManyData, MAX_SUM)
  return dataset.map(d => ({ percentage: d, color: randomColor() }))
}