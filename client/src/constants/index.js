// Task related constants
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// Intern related constants
export const INTERN_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  TERMINATED: 'terminated',
};

export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  PAID: 'paid',
};

// User related constants
export const USER_ROLES = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  INTERN: 'intern',
};

// Sort order constants
export const SORT_ORDERS = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

// Default pagination values
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

// Default filter values
export const DEFAULT_FILTERS = {
  search: '',
  status: [],
  priority: [],
  department: [],
  dateRange: null,
};

// File upload constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]; 