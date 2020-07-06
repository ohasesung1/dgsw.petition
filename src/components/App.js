import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
      </Switch>
      <Switch>
          <Route
            exact
            path='/dgsw.petition'
            render={() => <Pages.Petition/>}
            />
      </Switch>
      <Switch>
          <Route
            exact
            path='/dgsw.petition/petition-write'
            render={() => <Pages.PetitionWrite/>}
            />
      </Switch>
      <Switch>
          <Route
            exact
            path='/dgsw.petition/admin'
            render={() => <Pages.Admin/>}
            />
      </Switch>
      <Switch>
          <Route
            exact
            path='/dgsw.petition/petition-detail'
            render={() => <Pages.PetitionDetail/>}
            />
      </Switch>
      <Switch>
          <Route
            exact
            path='/dgsw.petition/student-council'
            render={() => <Pages.StudentCouncil/>}
            />
      </Switch>
      <Modal />
    </>
  );
}

export default App;