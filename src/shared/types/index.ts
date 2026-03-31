// ============ User ============
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isStudent: boolean;
  isAdmin?: boolean;
}

// ============ Path ============
export interface Path {
  _id: string;
  name: string;
  slug?: string;
}

// ============ University ============
export interface University {
  _id: string;
  name: string;
  slug?: string;
  color?: string;
  path_id?: string | null;
  path_ids?: string[] | null;
}

// ============ Announcement ============
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  updatedAt?: string;
  group?: string;
  author?: string;
  tags?: string[];
  pathId?: string | null;
  updatedBy?: string | null;
  eventDate?: string | null;
}

export interface AnnouncementGroup {
  _id: string;
  name: string;
}

// ============ Step ============
export interface Step {
  _id: string;
  title: string;
  content: string;
  path: string;
  order: number;
  summaries?: StepSummary[];
  links?: StepLink[];
}

export interface StepSummary {
  _id: string;
  title: string;
  contents: StepSummaryContent[];
}

export interface StepSummaryContent {
  _id: string;
  content: string;
  university?: string;
}

export interface StepLink {
  _id: string;
  label: string;
  url: string;
}

// ============ Section ============
export interface Section {
  _id: string;
  name: string;
  path: string;
  order: number;
}

// ============ DataGroup / DataField ============
export interface DataGroup {
  _id: string;
  name: string;
  section: string;
  order: number;
  isOptional?: boolean;
}

export interface DataField {
  _id: string;
  name: string;
  type: string;
  group: string;
  order: number;
  validations?: DataFieldValidation[];
  options?: DataFieldOption[];
}

export interface DataFieldValidation {
  _id: string;
  type: string;
  value: number;
  message: string;
}

export interface DataFieldOption {
  _id: string;
  label: string;
  value: string;
}

// ============ Calculation ============
export interface Calculation {
  _id: string;
  name: string;
  university: string;
  path: string;
}

// ============ DataTable ============
export interface DataTable {
  _id: string;
  name: string;
  path: string;
  isEnabled?: boolean;
  thresholds?: Threshold[];
}

export interface Threshold {
  _id: string;
  university: string;
  value: number;
}

// ============ Question ============
export interface Question {
  _id: string;
  title: string;
  content: string;
  path: string;
  topic?: string;
}

// ============ Topic ============
export interface Topic {
  _id: string;
  name: string;
  path: string;
}

// ============ Library ============
export interface Library {
  _id: string;
  title: string;
  description?: string;
  path: string;
  fileUrl?: string;
  fileType?: string;
}

// ============ Comment ============
export interface Comment {
  _id: string;
  content: string;
  author: string;
  authorName?: string;
  parent?: string;
  announcement?: string;
  date: string;
  likes: string[];
  dislikes: string[];
}

// ============ Inquiry ============
export interface Inquiry {
  _id: string;
  type: string;
  content: string;
  status: string;
  statusNote?: string;
  admin?: string;
  user: string;
}

// ============ StatsInput ============
export interface StatsInput {
  _id: string;
  path: string;
  university: string;
}

// ============ Message ============
export interface AppMessage {
  type: "success" | "error" | "";
  text: string;
}

// ============ UserData ============
export interface UserData {
  _id: string;
  user: string;
  table: string;
  sections: UserDataSection[];
}

export interface UserDataSection {
  section: string;
  groups: UserDataGroup[];
}

export interface UserDataGroup {
  group: string;
  fields: UserDataFieldValue[];
}

export interface UserDataFieldValue {
  field: string;
  value: unknown;
}

// ============ Page ============
export interface Page {
  _id: string;
  name: string;
  slug: string;
  path: string;
}
