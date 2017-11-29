import React from 'react'
import { compose } from 'lodash/fp'
import { Button } from '../ui/button'
import { TextInput } from '../ui/textInput'
import { inc, asyncInc, setCount, setColor } from './actions'
import { emitting } from '../effective/effective'
import { counter, Counter } from '../components/counter'

const SessionCounter = counter(window.sessionStorage)

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

const stringToInt = str => {
  const num = Number.parseInt(str, 10)
  return Number.isNaN(num) ? 0 : num
}

export const App = emitting(({count, color, emit, installComponentReducer, uninstallComponentReducer}) => {
 return <div>
    <div>
      {count}
    </div>
    <Button onClick={inc}>Increase</Button>
    <Button onClick={asyncInc}>Increase Async</Button>
    <TextInput value={count} onChange={compose(setCount, stringToInt)}/>
    <div style={{backgroundColor: color}}>Color</div>
    <Counter color='blue' onChange={setColor}/> 
    <Counter color='green' onChange={setColor}/> 
    {
      ((count > 3 && count < 5) || count > 7) && <Counter color={randomColor()} onChange={setColor}/>
    }
    {
      ((count > 3 && count < 5) || count > 7) && <SessionCounter color='orange' onChange={setColor}/>
    }
  </div>
})