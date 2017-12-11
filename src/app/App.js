import React, { Fragment } from 'react'
import { compose, defaultTo } from 'lodash/fp'
import { TextInput, Button } from '../ui'
import { inc, setCount, setColor, doMultipleThings, delayedInc } from './actions'
import { Counter } from './fragments'

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

const stringToInt = str => defaultTo(0, Number.parseInt(str, 10))

const intToString = int => Number(int).toString()

export const App = ({count, color, installComponentReducer, uninstallComponentReducer}) => {
  return <div>
    <div>
      {count}
    </div>
    <Button onClick={inc}>Increase</Button>
    <Button onClick={delayedInc}>Increase Async</Button>
    <TextInput value={intToString(count)} onChange={compose(setCount, stringToInt)}/>
    <div style={{backgroundColor: color}}>Color</div>
    <Counter color='blue' onChange={setColor}/> 
    <Counter color='green' onChange={setColor}/> 
    {
      ((count > 3 && count < 5) || count > 7) && 
      <Fragment>
          <Counter color={randomColor()} onChange={setColor}/>
          <Counter color='orange' onChange={setColor}/>
      </Fragment>    
    }
    <Button onClick={doMultipleThings}> Do Multiple things</Button>

  </div>
}