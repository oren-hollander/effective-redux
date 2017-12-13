import { createStore } from 'redux'
import { fragmentStore, combineFragmentReducers, replaceFragmentReducers } from './fragmentStore'

describe('fragment store', () => {
  const fragment1Reducer = (state = {name: 'fragment 1'}) => state
  const fragment2Reducer = (state = {name: 'fragment 2'}) => state

  const action1 = {type: 'action', fragmentId: 'fragment1'}
  const action2 = {type: 'action', fragmentId: 'fragment2'}

  const reducer = combineFragmentReducers({ 
    fragment1: fragment1Reducer,
    fragment2: fragment2Reducer     
  })
  
  let store
  let fragment1Store
  let fragment2Store

  beforeEach(() => {
    store = createStore(reducer)
    fragment1Store = fragmentStore('fragment1', store)
    fragment2Store = fragmentStore('fragment2', store)  
  })

  test('getState should return only fragment state', () => {
    expect(fragment1Store.getState()).toEqual({name: 'fragment 1'})
    expect(fragment2Store.getState()).toEqual({name: 'fragment 2'})
  })  

  test('subscribe should only notify for fragment store changes', () => {
    const fragment1Callback = jest.fn()
    const fragment2Callback = jest.fn()
    
    fragment1Store.subscribe(fragment1Callback)
    fragment2Store.subscribe(fragment2Callback)

    fragment1Store.dispatch(action1)
    fragment2Store.dispatch(action2)

    expect(fragment1Callback).toHaveBeenCalledTimes(1)
    expect(fragment2Callback).toHaveBeenCalledTimes(1)
  })

  test('notify the correct subscriber when dispatching an action via another fragment store', () => {
    const fragment1Callback = jest.fn()
    const fragment2Callback = jest.fn()
    
    fragment1Store.subscribe(fragment1Callback)
    fragment2Store.subscribe(fragment2Callback)
    fragment2Store.dispatch(action1)
    expect(fragment1Callback).toHaveBeenCalledTimes(1)
    expect(fragment2Callback).not.toHaveBeenCalled()
  })
  
  test('replace fragment reducers', () => {
    const fragment3Reducer = (state = {name: 'fragment 3'}) => state
    const fragment3Store = fragmentStore('fragment3', store)
    replaceFragmentReducers({ fragment1: fragment1Reducer, fragment2: fragment2Reducer, fragment3: fragment3Reducer }, store)

    expect(fragment1Store.getState()).toEqual({name: 'fragment 1'})
    expect(fragment2Store.getState()).toEqual({name: 'fragment 2'})
    expect(fragment3Store.getState()).toEqual({name: 'fragment 3'})
  })
})