import React from 'react';
import { Switch, Route, Redirect, BrowserRouter  } from 'react-router-dom';
import * as Pages from '../pages';
import Modal from 'containers/Common/Modal';

function App() {
  return (
    <>
      <Switch>
          <Route
            exact
            path='/dgsw.petition/sign'
            render={() => <Pages.Sign/>}
            />
          <Route
            exact
            path='/dgsw.petition/'
            render={() => <Pages.Petition/>}
            />
          <Route
            exact
            path='/dgsw.petition/petition-write'
            render={() => <Pages.PetitionWrite/>}
            />
          <Route
            exact
            path='/dgsw.petition/admin'
            render={() => <Pages.Admin/>}
            />
          <Route
            exact
            path='/dgsw.petition/petition-detail'
            render={() => <Pages.PetitionDetail/>}
            />
          <Route
            exact
            path='/dgsw.petition/student-council'
            render={() => <Pages.StudentCouncil/>}
            />
            <Route render={() => {
              var segmentCount = 1;

              var l = window.location;
              l.replace(
                  l.protocol + '//' + l.hostname + (l.port ?   ':' + l.port : '') +
                  l.pathname.split('/').slice(0, 1 +  segmentCount).join('/') + '/?p=/' +
                  l.pathname.slice(1).split('/').slice  (segmentCount).join('/').replace(/&/g,  '~and~') +
                  (l.search ? '&q=' + l.search.slice(1) .replace(/&/g, '~and~') : '') +
                  l.hash
              );
            }}/>
      </Switch>
      <Modal />
    </>
  );
}

export default App;