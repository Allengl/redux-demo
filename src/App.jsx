import React, { useState, useContext, useEffect } from 'react'

const connect = (Component) => {
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


const appContext = React.createContext(null)
const store = {
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
export const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User /></section>
const 二儿子 = () => <section>二儿子<UserModifier></UserModifier></section>
const 幺儿子 = () => <section>幺儿子</section>

const User = connect(({ state, dispatch }) => {
  console.log('User render');
  return <div>User:{state.user.name}</div>
})

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'updateUser':
      return { ...state, user: { ...state.user, ...payload } }
    default:
      return state
  }
}


const UserModifier = connect(({ dispatch, state, children }) => {

  const onChange = (e) => {
    state.user.name = e.target.value
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })
  }
  return <div>
    {children}
    <input value={state.user.name}
      onChange={onChange} />
  </div>
})
