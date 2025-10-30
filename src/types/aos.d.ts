declare module 'aos/dist/aos.css';

declare module 'aos' {
  interface AosOptions {
    duration?: number;
    once?: boolean;
    offset?: number;
    easing?: string;
    delay?: number;
    anchor?: string;
    anchorPlacement?: string;
    disable?: boolean | string | (() => boolean);
    startEvent?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    throttleDelay?: number;
    debounceDelay?: number;
  }

  interface Aos {
    init: (options?: AosOptions) => void;
    refresh: () => void;
    refreshHard: () => void;
  }

  const aos: Aos;
  export default aos;
}