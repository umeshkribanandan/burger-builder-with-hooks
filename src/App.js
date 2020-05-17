import React, { useEffect, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout";
import BurgerBuilder from "./containers/BurgerBuilder";

import { authCheck } from "./store/actions";

const Checkout = React.lazy(() => {
  return import("./containers/Checkout");
});

const Orders = React.lazy(() => {
  return import("./containers/Orders");
});

const Auth = React.lazy(() => {
  return import("./containers/Auth");
});

const Logout = React.lazy(() => {
  return import("./containers/Auth/Logout");
});

const App = (props) => {
  const { onAutoAuthCheck } = props;

  useEffect(() => {
    onAutoAuthCheck();
  }, [onAutoAuthCheck]);

  let routes = (
    <Switch>
      <Route path="/auth" exact render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      {/* <Route component={() => <h1>404 page</h1>} /> */}
    </Switch>
  );

  if (props.isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/logout" exact render={(props) => <Logout {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Route component={() => <h1>404 page</h1>} />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading....</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.userId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAutoAuthCheck: () => dispatch(authCheck()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

// import React from 'react';
// import { render } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
