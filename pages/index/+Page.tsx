import { clientOnly } from "vike-react/clientOnly";
import AnimatedLoader from "../../components/AnimatedLoader";
import { ClientOnly as ClientOnlyTanstack } from "../../components/ClientOnlyTanstack";
import HeavyComponent from "../../components/HeavyComponent";
import HeavyComponentSimple from "../../components/HeavyComponentSimple";
import {
  lazy,
  ReactNode,
  Suspense,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { clientOnly as clientOnlySolution } from "../../lib/clientOnly";
import { clientOnlySimple } from "../../lib/clientOnlySimple";

const HeavyComponentClientOnlySimple = clientOnlySimple(HeavyComponentSimple);

const HeavyComponentClientOnly = clientOnly(
  () => import("../../components/HeavyComponentClientOnly"),
);

const HeavyComponentLazy = lazy(
  () => import("../../components/HeavyComponentLazy"),
);

const HeavyComponentSolution = clientOnlySolution(
  () => import("../../components/HeavyComponentSolution"),
);

export default function Page() {
  const [stage, setStage] = useState<ClientOnlyDemoProps["stage"]>("server");

  return (
    <main className="prose">
      <h1>React clientOnly reproduction</h1>
      <h2>Example 1: vike clientOnly</h2>
      <HeavyComponentClientOnly
        fallback={<AnimatedLoader />}
      ></HeavyComponentClientOnly>
      <h2>
        Example 2:{" "}
        <a href="https://github.com/TanStack/router/blob/main/packages/react-router/src/ClientOnly.tsx">
          Tanstack Router ClientOnly component
        </a>
        . No suspense or lazy is required.
      </h2>
      <ClientOnlyTanstack fallback={<AnimatedLoader />}>
        <HeavyComponent />
      </ClientOnlyTanstack>
      <h2>
        Example 3: Demonstration that adding Suspense causes deletion and
        recreation of fallback
      </h2>
      <label htmlFor="stage-select">Select a stage:</label>
      <select
        id="stage-select"
        value={stage}
        className="border"
        onChange={(e) =>
          setStage(e.currentTarget.value as ClientOnlyDemoProps["stage"])
        }
      >
        <option value="server">
          clientOnly component as it was rendered on the server
        </option>
        <option value="clientWhileHydrating">
          clientOnly component while it is hydrating
        </option>
        <option value="clientAfterEffect">
          clientOnly component after it has mounted and the effect has run
        </option>
      </select>
      <ClientOnlyDemo stage={stage} fallback={<AnimatedLoader />}>
        <HeavyComponent />
      </ClientOnlyDemo>
      <h2>Example 4: React lazy with Suspense</h2>
      <Suspense>
        <HeavyComponentLazy />
      </Suspense>
      <h2>
        Example 5: clientOnly, loading component using effect rather than
        Suspense
      </h2>
      <HeavyComponentSolution fallback={<AnimatedLoader />} />
      <h2>Example 6: clientOnlySimple</h2>
      <HeavyComponentClientOnlySimple fallback={<AnimatedLoader />} />
    </main>
  );
}

interface ClientOnlyDemoProps {
  stage: "clientAfterEffect" | "clientWhileHydrating" | "server";
  fallback: ReactNode;
  children: ReactNode;
}

function ClientOnlyDemo({ stage, fallback, children }: ClientOnlyDemoProps) {
  const { promise, resolve } = useSuspender();

  switch (stage) {
    case "server":
      return fallback;
    case "clientWhileHydrating":
      return fallback;
    case "clientAfterEffect":
      return (
        <>
          <button className="border" onClick={() => resolve()}>
            Resolve suspense
          </button>
          <Suspense fallback={fallback}>
            <SuspendChildren promise={promise}>{children}</SuspendChildren>
          </Suspense>
        </>
      );
  }
}

function useSuspender() {
  const [lock] = useState(() => {
    let internalResolve: (value: void | PromiseLike<void>) => void = () => {};

    const promise = new Promise<void>((resolve) => {
      internalResolve = resolve;
    });

    return { promise, resolve: internalResolve };
  });

  return lock;
}

function SuspendChildren({
  promise,
  children,
}: {
  promise: Promise<void>;
  children?: ReactNode;
}) {
  use(promise);
  return children;
}
