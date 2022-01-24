import React, { useState, useEffect } from "react";
import Router from "next/router";
import RegistNecessary from "./RegistNecessary";
import RegistAdd from "./RegistAdd";

function MoreInfo(data) {
  setRegister(!data);
}

export default function Regist() {
  const [register, setRegister] = useState(true);

  return <><RegistNecessary /></>;

  // return <>{register ? <RegistNecessary /> : <RegistAdd />}</>;
}
