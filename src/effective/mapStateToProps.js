import { getContext, withProps, mapProps, compose } from 'recompose'
import { fragmentStorePropType } from './propTypes'
import { omit } from 'lodash/fp'

export const mapStateToProps = stateToProps => compose(
  getContext({ fragmentStore: fragmentStorePropType }),
  withProps(({ fragmentStore }) => stateToProps(fragmentStore.getState())),
  mapProps(omit('fragmentStore'))
)