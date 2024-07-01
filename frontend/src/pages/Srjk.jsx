import React from "react";
import { Breadcrumb, SrjkForm } from "../components";
import useAuth from "../hooks/useAuth";

const Srjk = ({ title, subtitle }) => {

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <SrjkForm/>
    </div>
  );
};

export default Srjk;
