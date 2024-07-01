import React from "react";
import { Breadcrumb, TestingRunner } from "../components";

const Testing = ({ title, subtitle }) => {

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <TestingRunner />
    </div>
  );
};

export default Testing;
