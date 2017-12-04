import React, { Fragment } from 'react'
import { compose, defaultTo } from 'lodash/fp'
import { Button } from '../ui/button'
import { TextInput } from '../ui/textInput'
import { inc, asyncInc, setCount, setColor, doMultipleThings } from './actions'
import { Counter } from '../fragments/counter'

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
    <Button onClick={asyncInc}>Increase Async</Button>
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