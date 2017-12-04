import { getContext, withProps, compose } from 'recompose'
import { object } from 'prop-types'

export const mapStateToProps = stateToProps => compose(
  getContext({store: object}),
  withProps(({store}) => stateToProps(store.getState()))
)