import { useEffect } from "react";

export default function HeavyComponentClientOnly() {
  useEffect(() => {
    console.log("Hello world client only");
  });
  return <div>Heavy component</div>;
}
