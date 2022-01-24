import React, { useState, useEffect } from "react";
import Router from "next/router";
import RegistNecessary from "./RegistNecessary";
import RegistAdd from "./RegistAdd";

export default function Regist() {
  const [register, setRegister] = useState(true);

  return <>{register ? <RegistNecessary /> : <RegistAdd />}</>;
}
