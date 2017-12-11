import { INC, SET_COUNT, SET_COLOR } from './actions'

const initialState = {
  count: 0,
  color: 'lightgrey'
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case INC:
      return { ...state, count: state.count + 1 }
    case SET_COUNT:
      return { ...state, count: action.count }
    case SET_COLOR:
      return { ...state, color: action.color}
    default:
      return state
  }
}
