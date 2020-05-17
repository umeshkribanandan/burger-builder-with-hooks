import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger";
import Controls from "../../components/Burger/Controls";
import Price from "../../components/Burger/Price";
import OrderButton from "../../components/Burger/OrderButton";
import OrderSummary from "../../components/Burger/OrderSummary";
import Modal from "../../components/UI/Modal";
import Spinner from "../../components/UI/Spinner";
import axiosOrders from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler";
import {
  addIngredient,
  removeIngredient,
  initIngredient,
} from "../../store/actions/index";

export const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);
  const [loading, setLoading] = useState(false);

  const ingredients = useSelector((state) => state.ingre.ingredients);
  const totalPrice = useSelector((state) => state.ingre.totalPrice);
  const error = useSelector((state) => state.ingre.error);
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const onAddIngredient = (type) => dispatch(addIngredient(type));
  const onRemoveIngredient = (type) => dispatch(removeIngredient(type));
  const onInitIngredient = useCallback(() => dispatch(initIngredient()), [
    dispatch,
  ]);

  const updatePurchasable = () => {
    if (!ingredients) return false;
    const purchase = Object.keys(ingredients)
      .map((ig) => {
        return ingredients[ig];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return purchase > 0;
  };

  useEffect(() => {
    onInitIngredient();
  }, [onInitIngredient]);

  const updatePurchasing = () => {
    if (!userId) {
      props.history.push("/auth");
    } else {
      setPurchasing(true);
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const continueHandler = () => {
    setLoading(true);
    props.history.push("/checkout");
  };

  let orderSummary = "";

  if (loading) {
    orderSummary = <Spinner />;
  }
  if (props.ingredients) {
    orderSummary = (
      <OrderSummary
        price={totalPrice}
        ingredients={ingredients}
        cancel={purchaseCancelHandler}
        continue={continueHandler}
      />
    );
  }

  let mainSection = (
    <div>
      <Burger ingredients={ingredients} />
      <Price cost={totalPrice} />
      <Controls
        addIngredients={onAddIngredient}
        removeIngredients={onRemoveIngredient}
      />
      <OrderButton
        isLoggedIn={userId}
        ordered={updatePurchasing}
        buttonStatus={!updatePurchasable()}
      />
    </div>
  );
  if (!ingredients && !error) {
    mainSection = <Spinner />;
  }
  if (props.error) {
    mainSection = <p>Ingredients is not loading .... </p>;
  }

  return (
    <Aux>
      <Modal modalClosed={purchaseCancelHandler} show={purchasing}>
        {orderSummary}
      </Modal>
      {mainSection}
    </Aux>
  );
};

export default withErrorHandler(BurgerBuilder, axiosOrders);
