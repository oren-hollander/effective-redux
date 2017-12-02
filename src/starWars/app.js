import React from 'react'
import { application } from '../effective/application'
import { dispatching } from '../effective/effective'
import { effect } from '../effective/effectiveStoreEnhancer'
import { map, partial, toPairs, identity, defaultTo, isEmpty } from 'lodash/fp'
import { mapStateToProps } from '../effective/effective'

const baseUrl = 'https://swapi.co'

const FETCH_DATA = 'fetch-data'
const fetchData = (view, url) => ({ type: FETCH_DATA, view, url })

const PROCESS_DATA = 'process-data'
const processData = (view, data) => ({ type: PROCESS_DATA, view, data })

const ERROR = 'error'
const error = message => ({ type: ERROR, message })

const CATEGORIES = 'categories'
const RESULTS = 'results'
const ARTICLE = 'article'

const initialState = {
  loading: false,
  errorMessage: '',
  view: '',
  data: {}
}

const fetchFromServer = (view, url) => fetch(url)
  .then(response => response.json())
  .then(x => {
    return x
  })
  .then(partial(processData, [view]))
  .catch(error)


const reducer = (state = initialState, action) => {
  switch(action.type){
    case FETCH_DATA:
      return effect({...state, loading: true}, fetchFromServer(action.view, action.url))
    case PROCESS_DATA:
      return {...state, loading: false, errorMessage: '', view: action.view, data: action.data}
    case ERROR: 
      return {...state, loading: false, errorMessage: action.message}
    default:
      return state
  }
}

const Link = dispatching(({ label, view, url, dispatch }) => 
  <span style={{cursor: 'pointer', border: '2px solid orange', backgroundColor: 'darkblue', color: 'white', padding: '0px', margin: '0px'}} onClick={() => dispatch(fetchData(view, url))}>{label}</span>)

const Welcome = () => <div>Welcome</div>

const Categories = mapStateToProps({categories: state => state.data})(({categories}) => 
  <div>
    <p>Categories</p>
    <div>
      {
        map(([category, url]) => <div key={category}><Link label={category} view={RESULTS} url={url}/></div>, toPairs(categories))
      }
    </div>
  </div>
)

const Results = mapStateToProps({
  count: state => state.data.count, 
  next: state => state.data.next,
  previous: state => state.data.previous,
  results: state => state.data.results
})(({
    count, next, previous, results
  }) => 
  <div>
    <div><Link label='Categories' view={CATEGORIES} url='https://swapi.co/api/'/></div>
    Count: {count}
    {!isEmpty(next) && <Link label='Next' view={RESULTS} url={next}/>}
    {!isEmpty(previous) && <Link label='Prev' view={RESULTS} url={previous}/>}
    { 
      map(result => <a/>, results)
    }
  </div>
)

const views = {
  [CATEGORIES]: Categories,
  [RESULTS]: Results
}

const StarWars = ({view}) => {
  const View = defaultTo(Welcome, views[view])
  return <div>
    Star Wars
    <View/>
  </div>
}

const ConnectedSW = mapStateToProps({
  view: state => state.view
})(StarWars)

const subsciptions = dispatch => {
  dispatch(fetchData(CATEGORIES, 'https://swapi.co/api/'))
}

export const main = rootElementId => {
  application(rootElementId, ConnectedSW, reducer, subsciptions)  
}