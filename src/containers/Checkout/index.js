import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary";
import ContactData from "./ContactData";
import { purchaseInit } from "../../store/actions";

const Checkout = (props) => {
  const [cdataselected, setCdataSelected] = useState(false);
  const { onPurchaseInit } = props;
  useEffect(() => {
    onPurchaseInit();
  }, [onPurchaseInit]);

  const cancelHandler = () => {
    props.history.push("/");
  };

  const successHandler = () => {
    setCdataSelected(true);
    props.history.replace("checkout/contact-data");
  };

  return (
    <div>
      {!props.ingredients && <Redirect to="/" />}
      {!cdataselected ? (
        <CheckoutSummary
          cancel={cancelHandler}
          success={successHandler}
          ingredients={props.ingredients}
        />
      ) : null}
      {cdataselected ? (
        <Route
          path={props.match.path + "/contact-data"}
          render={() => <ContactData />}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingre.ingredients,
    totalPrice: state.ingre.totalPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPurchaseInit: () => {
      dispatch(purchaseInit());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
