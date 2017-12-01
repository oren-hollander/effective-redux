import React, { Fragment } from 'react'
import { compose } from 'lodash/fp'
import { Button } from '../ui/button'
import { TextInput, TextInput2 } from '../ui/textInput'
import { inc, asyncInc, setCount, setColor } from './actions'
import { counterWithStorage, Counter } from '../components/counter'

const SessionCounter = counterWithStorage(window.sessionStorage)

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

const stringToInt = str => {
  const num = Number.parseInt(str, 10)
  return Number.isNaN(num) ? 0 : num
}

export const App = ({count, color, installComponentReducer, uninstallComponentReducer}) => {
 return <div>
    <div>
      {count}
    </div>
    <Button onClick={inc}>Increase</Button>
    <Button onClick={asyncInc}>Increase Async</Button>
    <TextInput2 value={count} onChange={compose(setCount, stringToInt)}/>
    <div style={{backgroundColor: color}}>Color</div>
    <Counter color='blue' onChange={setColor}/> 
    <Counter color='green' onChange={setColor}/> 
    {
      ((count > 3 && count < 5) || count > 7) && 
      <Fragment>
          <Counter color={randomColor()} onChange={setColor}/>
          <SessionCounter color='orange' onChange={setColor}/>
      </Fragment>    
    }
    <TextInput2/>    
  </div>
}