import { reducer } from './reducer'
import { increaseTwice, waitIsOver, waitASecond, firstIncrease, secondIncrease, waitASecondImpl } from './actions'
import { effect } from '../effective/effect'
import { command, batch, execute } from '../effective/command'

describe('reducer', () => {

  test('do mutilple things', () => {
    expect(reducer({}, increaseTwice)).toEqual(effect({}, waitASecond(waitIsOver)))
    expect(reducer({}, waitIsOver)).toEqual(effect({}, batch(firstIncrease(), secondIncrease())))
  })

  test('waitASecond', () => {
    const delay = millis => Promise.resolve()

    const myAction = { type: 'my action' }
    const cmd = waitASecondImpl(delay)(myAction)
    execute({})(cmd).then(action => expect(action).toEqual(myAction))
  })
})