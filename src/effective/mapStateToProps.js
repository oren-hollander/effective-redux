import { getContext, withProps, compose } from 'recompose'
import { storePropType } from './propTypes'

export const mapStateToProps = stateToProps => compose(
  getContext({store: storePropType}),
  withProps(({store}) => stateToProps(store.getState()))
)