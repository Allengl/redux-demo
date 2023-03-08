import React, { useContext, useEffect, useState } from 'react'

let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map((l) => l(state))
}
const store = {
  getState() {
    return state
  },
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  },
}

let dispatch = store.dispatch

const prevDispatch = dispatch

dispatch = (action) => {
  if (typeof action === 'function') {
    action(dispatch)
  } else {
    prevDispatch(action)
  }
}

const changed = (oldState, newState) => {
  let changed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true;
    }
  }
  return changed
};

export const connect = (selector, dispatchSelector) => (Component) => {
  return (props) => {

    const [_, update] = useState({})
    const data = selector ? selector(state) : { state }
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : { dispatch }

    useEffect(() => store.subscribe(() => {
      const newData = selector ? selector(state) : { state: state };
      if (changed(data, newData)) {
        update({})
      }
    }), [selector])

    return <Component {...props} {...data} {...dispatchers} />
  }
}

export const createStore = (_reducer, initState) => {
  state = initState
  reducer = _reducer
  return store
}

export const appContext = React.createContext(null)

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>
    {children}
  </appContext.Provider>
}
