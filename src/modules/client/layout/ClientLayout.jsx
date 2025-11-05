import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../../../components/TopBar";

export default function ClientLayout() {
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  );
}
