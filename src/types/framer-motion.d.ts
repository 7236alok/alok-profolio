// types/framer-motion.d.ts
import 'framer-motion';
import { ComponentProps, ReactNode, HTMLAttributes, DetailedHTMLFactory } from 'react';

declare module 'framer-motion' {
  export interface MotionProps {
    children?: ReactNode;
    // Add specific motion props you use frequently
    animate?: object | string;
    initial?: object | string | false;
    exit?: object | string;
    transition?: object;
    variants?: object;
    whileHover?: object | string;
    whileTap?: object | string;
    whileFocus?: object | string;
    whileDrag?: object | string;
    custom?: any;
    layout?: boolean | 'position' | 'size' | 'preserve-aspect';
    [key: string]: any;
  }

  type MotionComponent<T extends keyof JSX.IntrinsicElements> = React.ComponentType<
    ComponentProps<T> & MotionProps
  >;

  export const motion: {
    // Basic elements
    div: MotionComponent<'div'>;
    span: MotionComponent<'span'>;
    a: MotionComponent<'a'>;
    button: MotionComponent<'button'>;
    img: MotionComponent<'img'>;
    p: MotionComponent<'p'>;
    h1: MotionComponent<'h1'>;
    h2: MotionComponent<'h2'>;
    h3: MotionComponent<'h3'>;
    h4: MotionComponent<'h4'>;
    h5: MotionComponent<'h5'>;
    h6: MotionComponent<'h6'>;
    ul: MotionComponent<'ul'>;
    ol: MotionComponent<'ol'>;
    li: MotionComponent<'li'>;
    section: MotionComponent<'section'>;
    nav: MotionComponent<'nav'>;
    main: MotionComponent<'main'>;
    header: MotionComponent<'header'>;
    footer: MotionComponent<'footer'>;
    form: MotionComponent<'form'>;
    input: MotionComponent<'input'>;
    textarea: MotionComponent<'textarea'>;
    label: MotionComponent<'label'>;
    select: MotionComponent<'select'>;
    option: MotionComponent<'option'>;
    // SVG elements
    svg: MotionComponent<'svg'>;
    circle: MotionComponent<'circle'>;
    rect: MotionComponent<'rect'>;
    path: MotionComponent<'path'>;
    line: MotionComponent<'line'>;
    g: MotionComponent<'g'>;
    polygon: MotionComponent<'polygon'>;
    // Add other elements as needed
  };

  export interface HTMLMotionElements {
    [tag: string]: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
  }

  // Re-export useful Framer Motion types
  export type { AnimationControls, AnimationProps, MotionValue, PanInfo, TapInfo, HoverHandlers } from 'framer-motion';
}