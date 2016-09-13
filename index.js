import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Tree from './modules/Tree'

render((
  <Router history={hashHistory}>
    <Route path="/" component={Tree}>
    <Route path="/search/:search" component={Tree}/>
    </Route>
  </Router>
), document.getElementById('container'))
