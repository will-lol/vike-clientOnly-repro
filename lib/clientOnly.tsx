import React, {
  useState,
  useEffect,
  startTransition,
  type ComponentType,
  type ReactNode,
  type ComponentProps,
} from "react";

type LoadComponent = () => Promise<
  { default: ComponentType<any> } | ComponentType<any>
>;

export function clientOnly<T extends ComponentType<any>>(
  load: LoadComponent,
): ComponentType<ComponentProps<T> & { fallback?: ReactNode }> {
  const ClientOnlyComponent = (
    props: ComponentProps<T> & { fallback?: ReactNode },
  ) => {
    // 1. SSR & Hydration Mismatch Prevention
    // Always render fallback on the server and during initial hydration
    // We use a window check here which is standard for detecting the browser environment.
    const isClient = typeof window !== "undefined";

    if (!isClient) {
      return <>{props.fallback}</>;
    }

    const [Component, setComponent] = useState<T | null>(null);

    useEffect(() => {
      let isActive = true;

      load()
        .then((mod) => {
          if (!isActive) return;
          const Comp = mod && "default" in mod ? mod.default : mod;

          // Use startTransition to allow React to prioritize user input
          // while the new component renders.
          startTransition(() => {
            setComponent(() => Comp as T);
          });
        })
        .catch((err) => {
          console.error("vike-react clientOnly: Failed to load component", err);
        });

      return () => {
        isActive = false;
      };
    }, []);

    const { fallback, ...rest } = props;

    // 2. Loading Phase
    // Render fallback directly. Preserves state of the fallback
    // because the tree structure (Fragment -> Fallback) hasn't changed.
    if (!Component) {
      return <>{fallback}</>;
    }

    // 3. Loaded Phase
    // Render component, passing ref through props (React 19)
    // Note: TypeScript might still treat 'ref' specially depending on configuration,
    // but at runtime in React 19, it's just a prop in 'props'.
    return <Component {...(rest as any)} />;
  };

  ClientOnlyComponent.displayName = `ClientOnly`;
  return ClientOnlyComponent as ComponentType<
    ComponentProps<T> & { fallback?: ReactNode }
  >;
}
