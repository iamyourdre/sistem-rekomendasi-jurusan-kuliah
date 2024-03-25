import React from "react";
import { Breadcrumb, SrjkForm } from "../components";

const Srjk = ({ title, subtitle }) => {

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <SrjkForm/>
    </div>
  );
};

export default Srjk;
