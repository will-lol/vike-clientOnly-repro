import { useEffect } from "react";

export default function HeavyComponentLazy() {
  useEffect(() => {
    console.log("Hello world lazy");
  });
  return <div>Heavy component</div>;
}
