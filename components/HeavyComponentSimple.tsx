import { DetailedHTMLProps, HTMLAttributes, useEffect } from "react";

export default function HeavyComponentSimple() {
  useEffect(() => {
    console.log("Hello world simple");
  });

  return <div>Heavy component</div>;
}
