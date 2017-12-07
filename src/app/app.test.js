import { reducer } from './reducer'
import { doMultipleThings, waitIsOver, waitASecond, doOneThing, doOtherThing, waitASecondImpl } from './actions'
import { effect } from '../effective'
import { command, batch, execute } from '../effective/command'

describe('reducer', () => {

  test('do mutilple things', () => {
    expect(reducer({}, doMultipleThings())).toEqual(effect({}, waitASecond(waitIsOver())))
    expect(reducer({}, waitIsOver())).toEqual(effect({}, batch(doOneThing(), doOtherThing())))
  })

  test('waitASecond', () => {
    const delay = millis => Promise.resolve()

    const myAction = {type: 'my action'}
    const cmd = waitASecondImpl(delay)(myAction)
    execute(cmd).then(action => expect(action).toEqual(myAction))
  })
})