import React, { useEffect } from "react";
import Router from "next/router";
import RegistInfo from "../../components/User/RegistAdd";

export default function RegistPage() {
  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      // alert("불가능한 접근 방식입니다");
      // Router.push("/");
    }
  }, []);

  return <RegistInfo />;
}
