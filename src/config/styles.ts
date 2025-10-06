// src/config/styles.ts

/**
 * Centralized style configuration
 * Following design system principles
 */

export const SPACING = {
  iconContainer: {
    width: 'w-20',
    height: 'h-20',
    margin: 'mx-auto mb-4',
  },
  icon: {
    width: 'w-12',
    height: 'h-12',
  },
  card: {
    padding: 'pb-4',
    gap: 'gap-6',
  },
  section: {
    margin: 'mb-12',
    padding: 'px-4 py-12',
  },
} as const;

export const LAYOUT = {
  grid: {
    base: 'grid',
    cols: {
      mobile: 'grid-cols-1',
      desktop: 'md:grid-cols-3',
    },
  },
  flex: {
    center: 'flex items-center justify-center',
    col: 'flex flex-col',
  },
  container: {
    full: 'w-full',
    maxWidth: 'max-w-6xl',
    screen: 'min-h-screen',
  },
} as const;

export const EFFECTS = {
  transition: 'transition-shadow',
  hover: {
    shadow: 'hover:shadow-xl',
  },
  cursor: {
    pointer: 'cursor-pointer',
  },
  border: {
    default: 'border-2',
    rounded: {
      full: 'rounded-full',
      default: 'rounded-lg',
    },
  },
} as const;

export const TEXT = {
  align: {
    center: 'text-center',
  },
  size: {
    hero: 'text-4xl md:text-5xl',
    subtitle: 'text-xl',
    title: 'text-2xl',
    feature: 'text-3xl',
    body: 'text-lg',
    small: 'text-sm',
  },
  weight: {
    bold: 'font-bold',
    semibold: 'font-semibold',
    normal: 'font-normal',
  },
  color: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
  },
} as const;

export const COLORS = {
  patient: {
    main: 'blue',
    icon: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    hoverBorder: 'hover:border-blue-500',
    button: 'bg-blue-600',
    hoverButton: 'hover:bg-blue-700',
  },
  doctor: {
    main: 'green',
    icon: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-500',
    hoverBorder: 'hover:border-green-500',
    button: 'bg-green-600',
    hoverButton: 'hover:bg-green-700',
  },
  uploader: {
    main: 'purple',
    icon: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    hoverBorder: 'hover:border-purple-500',
    button: 'bg-purple-600',
    hoverButton: 'hover:bg-purple-700',
  },
} as const;