import { getContext, withProps, compose } from 'recompose'
import { storePropType } from './propTypes'

export const mapStateToProps = stateToProps => compose(
  getContext({ fragmentStore: storePropType }),
  withProps(({ fragmentStore }) => stateToProps(fragmentStore.getState()))
)