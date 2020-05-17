import React, { useState } from "react";
import { connect } from "react-redux";
import Aux from "../Aux";
import style from "./layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer";

const Layout = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const closeSideDrawerHandler = () => {
    setShowSideDrawer(false);
  };

  const drawerToggleHandler = () => {
    setShowSideDrawer(!showSideDrawer);
  };

  return (
    <Aux>
      <Toolbar isLoggedIn={props.userId} drawerClick={drawerToggleHandler} />
      <SideDrawer
        isLoggedIn={props.userId}
        open={showSideDrawer}
        close={closeSideDrawerHandler}
      />
      <main className={style.content}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps, null)(Layout);
