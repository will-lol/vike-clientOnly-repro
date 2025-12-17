import { useEffect } from "react";

export default function HeavyComponentSolution() {
  useEffect(() => {
    console.log("Hello world solution");
  });
  return <div>Heavy component</div>;
}
