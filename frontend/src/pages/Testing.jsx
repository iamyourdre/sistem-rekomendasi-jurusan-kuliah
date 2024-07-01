import React from "react";
import { Breadcrumb, TestingRunner } from "../components";
import useAuth from "../hooks/useAuth";

const Testing = ({ title, subtitle }) => {
  useAuth();

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <TestingRunner />
    </div>
  );
};

export default Testing;
