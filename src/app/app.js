import React, { Fragment } from 'react'
import { TextInput, Button } from '../ui'
import { inc, asyncInc, setCount, setColor, increaseTwice } from './actions'
import { Counter } from './fragments'
import { Panel } from './fragments/panels'

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

const intToString = int => Number(int).toString()

export const App = ({count, color, installComponentReducer, uninstallComponentReducer}) => {
  return <div>
    <div>
      {count}
    </div>
    <Button onClick={inc}>Increase</Button>
    <Button onClick={asyncInc}>Increase Async</Button>
    <TextInput value={intToString(count)} onChange={setCount}/>
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
    <Button onClick={increaseTwice}>Increase Twice</Button>
    <Panel/>
  </div>
}