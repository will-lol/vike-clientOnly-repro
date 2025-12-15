import { useEffect } from "react";

export default function HeavyComponent() {
  useEffect(() => {
    console.log("Hello world client only");
  });
  return <div>Heavy component</div>;
}
