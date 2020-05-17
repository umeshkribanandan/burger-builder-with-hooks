import React, { useState } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./contactdata.module.css";
import Button from "../../../components/UI/Button";
import axiosOrders from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner";
import Input from "../../../components/UI/Input";

import withErrorHandler from "../../../hoc/withErrorHandler";
import { purchase } from "../../../store/actions";
import { updateObject, validity } from "../../../shared/utility";

const ContactData = (props) => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      config: {
        type: "text",
        placeholder: "Your Name",
      },
      value: "",
      validation: {
        required: true,
      },
      valueType: "Name",
      valid: false,
      touched: false,
    },
    email: {
      elementType: "input",
      config: {
        type: "email",
        placeholder: "Your Email",
      },
      value: "",
      validation: {
        required: true,
      },
      valueType: "Email",
      valid: false,
      touched: false,
    },
    street: {
      elementType: "input",
      config: {
        type: "text",
        placeholder: "Your Street",
      },
      value: "",
      validation: {
        required: true,
      },
      valueType: "Street",
      valid: false,
      touched: false,
    },
    pincode: {
      elementType: "input",
      config: {
        type: "text",
        placeholder: "Your Pin Code",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
        maxLength: 6,
      },
      valueType: "Pincode",
      valid: false,
      touched: false,
    },
    country: {
      elementType: "input",
      config: {
        type: "text",
        placeholder: "Your Country",
      },
      value: "",
      validation: {
        required: true,
      },
      valueType: "Country",
      valid: false,
      touched: false,
    },
    deliveryMode: {
      elementType: "select",
      config: {
        options: [
          { label: "Prime", value: "prime" },
          { label: "Normal", value: "normal" },
        ],
        placeholder: "Select Deleivery Mode",
      },
      validation: {
        required: true,
      },
      value: "Prime",
      valueType: "Delivery Mode",
      touched: false,
      valid: true,
    },
  });
  const [validForm, setValidForm] = useState(false);

  const cancelHandler = () => {
    props.history.push("/");
  };

  const inputChangeHandler = (event, key) => {
    const updatedFormElement = updateObject(orderForm[key], {
      value: event.target.value,
      valid: validity(event.target.value, orderForm[key].validation),
      touched: true,
    });
    const updatedOrderForm = updateObject(orderForm, {
      [key]: updatedFormElement,
    });

    let isFormValid = true;
    for (let key in updatedOrderForm) {
      isFormValid = updatedOrderForm[key].valid && isFormValid;
    }
    setOrderForm(updatedOrderForm);
    setValidForm(isFormValid);
  };

  const orderHandler = (event) => {
    event.preventDefault();
    // this.setState({ loading: true });
    const order = {
      userId: props.userId,
      ingredients: props.ingredients,
      price: props.price,
      customer: {
        name: orderForm.name.value,
        address: {
          street: orderForm.street.value,
          pincode: orderForm.pincode.value,
          country: orderForm.country.value,
        },
        email: orderForm.email.value,
        deliveryMode: orderForm.deliveryMode.value,
      },
    };

    props.onPurchase(order, props.token);
    // axiosOrders
    //   .post("/orders.json", order)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.setState({ loading: false });
    //     this.props.history.push("/");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setState({ loading: false });
    //   });
  };

  let formelements = [];
  for (let key in orderForm) {
    formelements.push({
      id: key,
      config: orderForm[key],
    });
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formelements.map((formelement) => {
        return (
          <Input
            key={formelement.id}
            elementType={formelement.config.elementType}
            elementConfig={formelement.config.config}
            value={formelement.value}
            invalid={!formelement.config.valid}
            shouldValidate={formelement.config.validation}
            touched={formelement.config.touched}
            valueType={formelement.config.valueType}
            change={(event) => inputChangeHandler(event, formelement.id)}
          />
        );
      })}
      <Button type="Danger" clicked={cancelHandler}>
        CANCEL
      </Button>
      <Button type="Success" disabled={!validForm}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }

  return (
    <div className={styles.ContactData}>
      {props.purchased && <Redirect to="/" />}
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

export const mapStateToProps = (state) => {
  return {
    price: state.ingre.totalPrice,
    ingredients: state.ingre.ingredients,
    order: state.ords.order,
    loading: state.ords.loading,
    purchased: state.ords.purchased,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onPurchase: (order, token) => dispatch(purchase(order, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(withRouter(ContactData), axiosOrders));
