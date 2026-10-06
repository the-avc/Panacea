/**
 * PANACEA CONSULTANCY — Shared UI Component Library
 *
 * Reusable components for the public website, client portal, and admin portal.
 * Components follow UI-SPEC.md §43 component library specification.
 */

// ---- Design Tokens ----
export * from './tokens';
export { default as panaceaPreset } from './tailwind-preset';

// ---- Components ----
export { Button, type ButtonProps } from './components/Button';
export { Badge, type BadgeProps } from './components/Badge';
export { StatusBadge, type StatusBadgeProps } from './components/StatusBadge';
export {
  ClassificationBadge,
  type ClassificationBadgeProps,
} from './components/ClassificationBadge';
export { Container, type ContainerProps } from './components/Container';
export { Section, type SectionProps } from './components/Section';
export { Heading, type HeadingProps } from './components/Heading';
export { Card, type CardProps } from './components/Card';
export { Input, type InputProps } from './components/Input';
export { Textarea, type TextareaProps } from './components/Textarea';
export { Select, type SelectProps } from './components/Select';
export { Modal, type ModalProps } from './components/Modal';
export { Toast, type ToastProps } from './components/Toast';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { ErrorState, type ErrorStateProps } from './components/ErrorState';
export { LoadingState, type LoadingStateProps } from './components/LoadingState';
export { SecurityNotice, type SecurityNoticeProps } from './components/SecurityNotice';
export { DataTable, type DataTableProps, type DataTableColumn } from './components/DataTable';
export { Pagination, type PaginationProps } from './components/Pagination';
