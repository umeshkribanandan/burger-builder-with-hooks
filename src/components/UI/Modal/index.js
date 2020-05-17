import React, { Component } from "react";
import styles from "./modal.module.css";

import Aux from "../../../hoc/Aux";
import Backdrop from "../Backdrop";

const Modal = (props) => {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.show !== this.props.show ||
  //     nextProps.children !== this.props.children
  //   );
  // }

  return (
    <Aux>
      <Backdrop clicked={props.modalClosed} show={props.show} />
      <div
        className={styles.Modal}
        style={{
          transform: props.show ? "traslateY(0)" : "transalteY(-100)",
          opacity: props.show ? "1" : "0",
          zIndex: props.show ? "500" : "-100",
        }}
      >
        {props.children}
      </div>
    </Aux>
  );
};

export default React.memo(Modal, (prevProps, nextProps) => {
  return (
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
  );
});
