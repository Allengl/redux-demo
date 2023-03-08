import React from 'react'
import { appContext, store, connect } from './redux.jsx'

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
const 幺儿子 = connect(state => {
  return { group: state.group }
})(({ group }) => {
  console.log('幺儿子 render');
  return <section>幺儿子<div>Group: {group.name}</div></section>
})

const User = connect(state => {
  return { user: state.user }
})(({ user }) => {
  console.log('User render');
  return <div>User:{user.name}</div>
})

const UserModifier = connect()(({ dispatch, state, children }) => {

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

