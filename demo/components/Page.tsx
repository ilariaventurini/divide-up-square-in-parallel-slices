import React from 'react'
import { computeSquareSlices } from '../../dist';
import { randomWithFixedSum } from '../array-utils';
import { Square } from './Square';

export const Page = () => {
  const dataset = generateData(10)
  const res = computeSquareSlices(dataset, 300, { x: 0, y: 0 })
  console.log('res: ', res);

  return (
    <div className="-page">
      <Square />
      <div className="">Again!</div>
    </div>
  )
}

function generateData(howManyData: number) {
  const data = randomWithFixedSum(howManyData, 1)
  return data.map(d => ({ percentage: d }))
}