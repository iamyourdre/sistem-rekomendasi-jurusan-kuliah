import React from "react";
import { Breadcrumb, TableTestHistory } from "../components";
import useAuth from "../hooks/useAuth";

const TestHistory = ({ title, subtitle }) => {
  useAuth();

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle} />
      <TableTestHistory />
    </div>
  );
};

export default TestHistory;
