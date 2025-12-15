import { useEffect } from "react";

export default function HeavyComponent() {
  useEffect(() => {
    console.log("Hello world");
  });
  return <div>Heavy component</div>;
}
