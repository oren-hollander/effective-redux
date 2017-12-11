import { isAction, isTagged, tagAction, isTaggedWith, tagActionCreator, tag } from './tagAction'
import { Fragment } from '../effective/fragment'

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
      expect(isTagged({type: 'something'})).toBe(false)
    })

    test('should return true when action is tagged', () => {
      expect(isTagged({type: 'something', [Fragment]: Symbol('some tag')})).toBe(true)
    })
  })

  describe('tagAction', () => {
    const fragmentId = Symbol('my fragment')
    
    test('should tag an untagged action', () => {
      expect(tagAction(fragmentId, {type: 'something'})).toEqual({type: 'something', [Fragment]: fragmentId})
    })

    test('should not tag an already tagged fragment', () => {
      const otherFragmentId = Symbol('other fragment id')
      const taggedAction = tagAction(fragmentId, {type: 'something'})
      expect(tagAction(otherFragmentId, taggedAction)).toEqual({type: 'something', [Fragment]: fragmentId})
    })
  })

  describe('isTaggedWith', () => {
    const fragmentId = Symbol('my fragment')

    test('should be tagged', () => {
      expect(isTaggedWith(fragmentId, tagAction(fragmentId, {type: 'somthing'}))).toBe(true)
    })

    test('should not be tagged when tagged with a different fragment id', () => {
      const otherFragmentId = Symbol('my other fragment')
      expect(isTaggedWith(otherFragmentId, tagAction(fragmentId, {type: 'somthing'}))).toBe(false)
    })    
    
    test('should not be tagged when not tagged', () => {
      expect(isTaggedWith(fragmentId, {type: 'somthing'})).toBe(false)
    })    
  })

  describe('tagActionCreator', () => {
    const fragmentId = Symbol('my fragment')
    const actionCreator = () => ({type: 'something'})
    
    test('should tag an action', () => {
      expect(isTaggedWith(fragmentId, tagActionCreator(fragmentId, actionCreator)())).toBe(true)
    })

    test('should not tag an action of an already tagged action creator', () => {
      expect(isTaggedWith(fragmentId, tagActionCreator(Symbol('other fragment id'), tagActionCreator(fragmentId, actionCreator)()))).toBe(true)
    })
  })

  describe('tag', () => {
    const fragmentId = Symbol('my fragment')

    test('should tag action', () => {
      expect(isTaggedWith(fragmentId, tag(fragmentId, {type: 'something'}))).toBe(true)
    })

    test('should tag action creator', () => {
      const actionCreator = () => ({type: 'something'})
      expect(isTaggedWith(fragmentId, tag(fragmentId, actionCreator)())).toBe(true)
    })
  })
})