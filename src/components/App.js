import React from "react";
import { Switch, Route } from "react-router";
import styled from "styled-components";
import CreateLink from "./createLink";
import Header from "./Header";
import Login from "./Login";
import Search from "./search";
import { Redirect } from "react-router-dom";
import LinkList from "./LinkList.";

const App = () => {
  return (
    <Wrapper className="center w85">
      <Header />
      <div className="padding backgroun-gray">
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/new/1" />}
          />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/new/:page" component={LinkList} />
        </Switch>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 85%;
  margin: auto;
  padding: 0rem 1rem 2rem 0rem;

  .padding {
    padding: 4rem 1.875rem;
  }
`;

export default App;
