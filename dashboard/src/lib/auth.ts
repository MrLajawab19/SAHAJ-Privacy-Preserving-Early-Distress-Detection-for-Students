// src/lib/auth.ts
// Mock authentication data. In production these would be server-side.

export type StudentUser = {
  id: string
  name: string
  username: string
  password: string
  role: 'student'
  parentId: string
  grade: string
}

export type ParentUser = {
  id: string
  name: string
  username: string
  password: string
  role: 'parent'
  childId: string
}

export type User = StudentUser | ParentUser

export const MOCK_USERS: User[] = [
  {
    id: 'stu1',
    name: 'Ananya Sharma',
    username: 'ananya',
    password: 'demo123',
    role: 'student',
    parentId: 'par1',
    grade: 'Class 11',
  },
  {
    id: 'stu2',
    name: 'Rohan Verma',
    username: 'rohan',
    password: 'demo123',
    role: 'student',
    parentId: 'par2',
    grade: 'Class 9',
  },
  {
    id: 'par1',
    name: 'Sunita Sharma',
    username: 'sharma.parent',
    password: 'demo123',
    role: 'parent',
    childId: 'stu1',
  },
  {
    id: 'par2',
    name: 'Vikas Verma',
    username: 'verma.parent',
    password: 'demo123',
    role: 'parent',
    childId: 'stu2',
  },
]

export function getUserByCredentials(
  username: string,
  password: string,
): User | null {
  return (
    MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    ) ?? null
  )
}

export function getUserById(id: string): User | null {
  return MOCK_USERS.find((u) => u.id === id) ?? null
}

export function getStudentById(id: string): StudentUser | null {
  const u = MOCK_USERS.find((u) => u.id === id && u.role === 'student')
  return u ? (u as StudentUser) : null
}

export function getParentById(id: string): ParentUser | null {
  const u = MOCK_USERS.find((u) => u.id === id && u.role === 'parent')
  return u ? (u as ParentUser) : null
}
