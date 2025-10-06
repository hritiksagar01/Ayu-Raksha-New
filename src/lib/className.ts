// src/lib/classNames.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build card classes based on variant
 */
export function buildCardClasses(variant: 'patient' | 'doctor' | 'uploader') {
  const baseClasses = 'hover:shadow-xl transition-shadow cursor-pointer border-2';
  
  const variantClasses = {
    patient: 'hover:border-blue-500',
    doctor: 'hover:border-green-500',
    uploader: 'hover:border-purple-500',
  };
  
  return cn(baseClasses, variantClasses[variant]);
}

/**
 * Build icon container classes
 */
export function buildIconContainerClasses(variant: 'patient' | 'doctor' | 'uploader') {
  const baseClasses = 'mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4';
  
  const variantClasses = {
    patient: 'bg-blue-100',
    doctor: 'bg-green-100',
    uploader: 'bg-purple-100',
  };
  
  return cn(baseClasses, variantClasses[variant]);
}

/**
 * Build icon classes
 */
export function buildIconClasses(variant: 'patient' | 'doctor' | 'uploader') {
  const baseClasses = 'w-12 h-12';
  
  const variantClasses = {
    patient: 'text-blue-600',
    doctor: 'text-green-600',
    uploader: 'text-purple-600',
  };
  
  return cn(baseClasses, variantClasses[variant]);
}

/**
 * Build button classes
 */
export function buildButtonClasses(variant: 'patient' | 'doctor' | 'uploader') {
  const baseClasses = 'w-full';
  
  const variantClasses = {
    patient: 'bg-blue-600 hover:bg-blue-700',
    doctor: 'bg-green-600 hover:bg-green-700',
    uploader: 'bg-purple-600 hover:bg-purple-700',
  };
  
  return cn(baseClasses, variantClasses[variant]);
}