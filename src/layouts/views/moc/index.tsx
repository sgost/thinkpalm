import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Moc() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((json: any) => {
        setData(json);
      });
  }, []);

  return <div>{data?.data?.title}</div>;
}
