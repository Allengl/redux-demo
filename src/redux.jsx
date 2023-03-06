import React, { useContext, useEffect, useState } from 'react'
export const connect = (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext)
    const [_, update] = useState({})

    useEffect(() => {
      store.subscribe(() => update({}))
    })

    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state} />
  }
}

export const store = {
  state: {
    user: { name: 'Allen', age: 18 }
  },
  setState(newState) {
    store.state = newState
    store.listeners.map((l) => l(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  },
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'updateUser':
      return { ...state, user: { ...state.user, ...payload } }
    default:
      return state
  }
}


export const appContext = React.createContext(null)

