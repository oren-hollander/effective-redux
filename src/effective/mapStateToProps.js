import { getContext, withProps, mapProps, compose } from 'recompose'
import { storePropType } from './propTypes'
import { omit } from 'lodash/fp'

export const mapStateToProps = stateToProps => compose(
  getContext({ fragmentStore: storePropType }),
  withProps(({ fragmentStore }) => stateToProps(fragmentStore.getState())),
  mapProps(omit('fragmentStore'))
)