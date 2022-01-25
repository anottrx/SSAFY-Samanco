import React, { useEffect } from "react";
import Router from "next/router";
import RegistInfo from "../../components/User/RegistAdd";

export default function RegistPage() {
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
    }
  }, []);

  return <RegistInfo />;
}
