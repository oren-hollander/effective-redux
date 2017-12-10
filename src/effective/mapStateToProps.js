import { getContext, withProps, compose } from 'recompose'
import { func } from 'prop-types'

export const mapStateToProps = stateToProps => compose(
  getContext({getState: func}),
  withProps(({getState}) => stateToProps(getState()))
)