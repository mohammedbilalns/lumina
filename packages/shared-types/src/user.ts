export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

export interface UserProfile extends User {
  dateOfBirth: string | null
}
