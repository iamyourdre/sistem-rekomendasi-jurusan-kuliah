import React from "react";
import { Breadcrumb, EvalRunner } from "../components";

const Evaluation = ({ title, subtitle }) => {

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <EvalRunner />
    </div>
  );
};

export default Evaluation;
