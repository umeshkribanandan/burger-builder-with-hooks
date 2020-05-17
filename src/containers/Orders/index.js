import React, { useEffect } from "react";
import { connect } from "react-redux";

import Order from "../../components/Order";
import axiosOrders from "../../axios-orders";
import Spinner from "../../components/UI/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler";

import { fetchOrders } from "./../../store/actions";

const Orders = (props) => {
  const { onFetchOrders } = props;
  useEffect(() => {
    onFetchOrders(props.token, props.userId);
  }, [onFetchOrders]);
  // componentDidMount() {
  //   this.props.onFetchOrders(this.props.token, this.props.userId);
  // axiosOrders
  //   .get("/orders.json")
  //   .then((response) => {
  //     const tempOrderArray = [];
  //     for (let key in response.data) {
  //       tempOrderArray.push({
  //         ...response.data[key],
  //         id: key,
  //       });
  //     }
  //     console.log(tempOrderArray);
  //     this.setState({ loading: false, orders: tempOrderArray });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     this.setState({ loading: false });
  //   });
  // }

  let ords = null;
  if (props.loading) {
    ords = <Spinner />;
  } else if (!props.loading && props.orders.length) {
    ords = props.orders.map((o) => {
      return <Order key={o.id} price={+o.price} ingredients={o.ingredients} />;
    });
  }

  if (!props.orders.length) {
    ords = <p>There are no Burgers Ordered by you, Please Order One </p>;
  }
  return <div>{ords}</div>;
};

const mapStateToProps = (state) => {
  return {
    orders: state.ords.orders,
    loading: state.ords.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) => {
      dispatch(fetchOrders(token, userId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axiosOrders));
