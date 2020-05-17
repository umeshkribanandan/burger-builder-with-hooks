import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./auth.module.css";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { auth } from "../../store/actions";
import Spinner from "../../components/UI/Spinner";
import { updateObject, validity } from "../../shared/utility";

const Auth = (props) => {
  const [controls, setControls] = useState({
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
    password: {
      elementType: "input",
      config: {
        type: "password",
        placeholder: "Your Passowrd",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valueType: "Password",
      valid: false,
      touched: false,
    },
  });
  const [validForm, setValidForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const inputChangeHandler = (event, key) => {
    const updatedForm = updateObject(controls, {
      [key]: updateObject(controls[key], {
        value: event.target.value,
        valid: validity(event.target.value, controls[key].validation),
        touched: true,
      }),
    });

    let isFormValid = true;
    for (let key in updatedForm) {
      isFormValid = updatedForm[key].valid && isFormValid;
    }
    setControls(updatedForm);
    setValidForm(isFormValid);
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    for (let key in controls) {
      const updatedForm = {
        ...controls,
        [key]: {
          ...controls[key],
          value: "",
          touched: false,
        },
      };
      setControls(updatedForm);
      setValidForm(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignUp);
    if (props.building) {
      props.history.push("/checkout");
    } else {
      props.history.push("/");
    }
  };

  const switchHandler = (event) => {
    event.preventDefault();
    setIsSignUp(!isSignUp);
  };

  let formelements = [];
  for (let key in controls) {
    formelements.push({
      id: key,
      config: controls[key],
    });
  }
  let form = (
    <form onSubmit={submitHandler}>
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
      {props.error ? <p> {props.error} </p> : null}
      <Button type="Danger" clicked={cancelHandler}>
        CANCEL
      </Button>
      <Button type="Success" disabled={!validForm}>
        SUBMIT
      </Button>
      <Button clicked={switchHandler} type="Danger">
        SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}
      </Button>
    </form>
  );
  return (
    <div className={styles.Auth}>{props.loading ? <Spinner /> : form}</div>
  );
};
const mapStateToProps = (state) => {
  return {
    building: state.ingre.building,
    loading: state.auth.loading,
    error: state.auth.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(auth(email, password)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
