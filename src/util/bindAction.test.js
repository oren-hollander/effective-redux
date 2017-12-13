import { isAction, isBound, bindAction, isBoundTo, fragmentIdKey } from './bindAction'
import { has } from 'lodash/fp'

describe('tagAction', () => {
  describe('isAction', () => {
    test('should return false when arg is not an action', () => {
      expect(isAction({})).toBe(false)      
    })

    test('should return true when arg is an action', () => {
      expect(isAction({type: 'something'})).toBe(true)      
    })
  })

  describe('isTagged', () => {
    test('should return false when action is not tagged', () => {
      expect(isBound({type: 'something'})).toBe(false)
    })

    test('should return true when action is tagged', () => {
      expect(isBound({ type: 'something', [fragmentIdKey]: 'some tag' })).toBe(true)
    })
  })

  describe('tagAction', () => {
    const fragmentId = 'my fragment'
    
    test('should tag an untagged action', () => {
      expect(bindAction(fragmentId, { type: 'something' })).toEqual({ type: 'something', [fragmentIdKey]: fragmentId })
    })

    test('should not tag an already tagged fragment', () => {
      const otherFragmentId = 'other fragment id'
      const boundAction = bindAction(fragmentId, { type: 'something' })
      expect(bindAction(otherFragmentId, boundAction)).toEqual({ type: 'something', [fragmentIdKey]: fragmentId })
    })
  })

  describe('isTaggedWith', () => {
    const fragmentId = 'my fragment'

    test('should be tagged', () => {
      expect(isBoundTo(fragmentId, bindAction(fragmentId, { type: 'somthing' }))).toBe(true)
    })

    test('should not be tagged when tagged with a different fragment id', () => {
      const otherFragmentId = Symbol('my other fragment')
      expect(isBoundTo(otherFragmentId, bindAction(fragmentId, {type: 'somthing'}))).toBe(false)
    })    
    
    test('should not be tagged when not tagged', () => {
      expect(isBoundTo(fragmentId, { type: 'somthing' })).toBe(false)
    })    
  })
})