import React, { Fragment } from 'react'
import { TextInput } from '../ui/textInput'
import { Button } from '../ui/button'
import { inc, asyncInc, setCount, setColor, increaseTwice } from './actions'
import { Counter } from './fragments/counter'
import { Panel, panelsFragmentId } from './fragments/panels'
import { Inspectors, inspectorsFragmentId } from './fragments/inspectors'
import { intToString } from '../util/stringConversion'

const randomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange']
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

export const App = ({count, color, installComponentReducer, uninstallComponentReducer}) => {
  return (
    <Fragment>
      <div style={{display: 'grid', gridGap: '10px', gridTemplateColumns: '900px auto'}}>
        <div style={{gridColumn: '1'}}>
          <div style={{margin: '10px'}}>
            Count: {count}
          </div>
          <div style={{margin: '10px'}}>
            <Button color='gray' onClick={inc}>Increase</Button>
            <Button color='gray' onClick={asyncInc}>Increase Async</Button>
            <Button color='gray' onClick={increaseTwice}>Increase Twice</Button>
          </div>
          <div style={{margin: '10px'}}>
            <TextInput value={intToString(count)} onChange={setCount}/>
          </div>
          <div style={{margin: '10px', padding: '4px', color: 'white', textAlign: 'center', backgroundColor: color}}>
            Color
          </div>
          <Counter name='Bananas' fragmentId='counter-1' color='blue' onChange={setColor}/> 
          <Counter name='Apples' fragmentId='counter-2' color='green' onChange={setColor}/> 
          {
            (count > 4) && 
            <Fragment>
                <Counter name='Pears' fragmentId='counter-3' color={randomColor()} onChange={setColor} persistFragment={true}/>
                <Counter name='Strawberries' fragmentId='counter-4' color='orange' onChange={setColor}/>
            </Fragment>    
          }
        </div>
        <div style={{gridColumn: '2'}}>
          <Inspectors fragmentId={inspectorsFragmentId} persistFragment={true}/>
        </div>
      </div>
      <Panel fragmentId={panelsFragmentId} persistFragment={true}/>
    </Fragment>
  )
}