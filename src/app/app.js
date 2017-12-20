import React, { Fragment } from 'react'
import { TextInput, Button } from '../ui'
import { inc, asyncInc, setCount, setColor, increaseTwice } from './actions'
import { Counter } from './fragments'
import { Panel, panelsFragmentId } from './fragments/panels'
import { intToString } from '../util/stringConversion'

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

export const App = ({count, color, installComponentReducer, uninstallComponentReducer}) => {
  return <div>
    <div>
      {count}
    </div>
    <Button onClick={inc}>Increase</Button>
    <Button onClick={asyncInc}>Increase Async</Button>
    <TextInput value={intToString(count)} onChange={setCount}/>
    <div style={{backgroundColor: color}}>Color</div>
    <Counter fragmentId='counter-1' color='blue' onChange={setColor}/> 
    <Counter fragmentId='counter-2' color='green' onChange={setColor}/> 
    {
      ((count > 3 && count < 5) || count > 7) && 
      <Fragment>
          <Counter fragmentId='counter-3' color={randomColor()} onChange={setColor} persistFragment={true}/>
          <Counter fragmentId='counter-4' color='orange' onChange={setColor}/>
      </Fragment>    
    }
    <Button onClick={increaseTwice}>Increase Twice</Button>
    <Panel fragmentId={panelsFragmentId} persistFragment={true}/>
  </div>
}