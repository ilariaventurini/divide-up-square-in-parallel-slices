import React, { useState } from 'react'
import { randomColor, randomIntegerInRange, randomWithFixedSum, roundToTwoDecimals } from '../utils';
import { FILL_HOVERED_OPACITY, FILL_OPACITY, SQUARE_SIDE, Square } from './Square';

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

  const generateNewDataset = () => {
    const counter = randomIntegerInRange(COUNTER_EXTENT)
    const newDataset = generateData(counter)
    setDataset(newDataset)
  }

  return (
    <div className="-page w-full h-full flex flex-row justify-center items-center">
      <div className="flex">

        <div className="flex flex-col">
          <Square dataset={dataset} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
          <Legend className="md:hidden mt-4 flex flex-wrap justify-between" dataset={dataset} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
          <Button className="flex justify-center" onClick={generateNewDataset} />
        </div>

        <Legend className="ml-4 hidden md:block" dataset={dataset} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
      </div>
    </div>
  )
}

const Legend = ({ className = "", dataset, hoveredIndex, setHoveredIndex }) => {
  return (
    <div className={`${className}`} style={{ maxWidth: SQUARE_SIDE }}>
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
            <div className={`text-gray-800 ${isHovered ? 'font-normal' : 'font-light'}`} style={{ minWidth: 60 }}>{`${roundToTwoDecimals(percentage * 100)}%`}</div>
          </div>
        )
      })}
    </div>
  )
}

const Button = ({ className = "", onClick }) => {
  return (
    <div className={`${className}`}>
      <div
        className="cursor-pointer select-none mt-4 flex justify-center items-center bg-gray-800 text-white hover:bg-gray-700 font-light rounded-sm"
        onClick={onClick}
        style={{ width: 80, height: 30 }}
      >Again!</div>
    </div>
  )
}

function generateData(howManyData: number): Datum[] {
  const dataset = randomWithFixedSum(howManyData, MAX_SUM)
  return dataset.map(d => ({ percentage: d, color: randomColor() }))
}