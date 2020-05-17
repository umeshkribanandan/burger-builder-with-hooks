import React from "react";
import Modal from "../../components/UI/Modal";
import useHttpErrorHandler from "../../hooks/http-error-handler";

import Aux from "../Aux";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, errorHandler] = useHttpErrorHandler(axios);

    return (
      <Aux>
        <Modal modalClosed={errorHandler} show={error}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
