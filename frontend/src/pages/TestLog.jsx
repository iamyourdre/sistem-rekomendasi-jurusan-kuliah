import React from "react";
import { Breadcrumb, TableTestLog } from "../components";
import useAuth from "../hooks/useAuth";
import { NavLink, useParams } from "react-router-dom";

const TestLog = ({ title, subtitle }) => {
  useAuth();
  const { id } = useParams();

  return (
    <div className="w-full">
      <Breadcrumb menu={title} submenu={subtitle}/>
      <TableTestLog id={id}/>
    </div>
  );
};

export default TestLog;
