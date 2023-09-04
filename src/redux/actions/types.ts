export type LoginResponseType = {
  access: string
  refresh: string
  user: UserType
}

export type UserType = {
  id: number | string
  role: string
  fullName: string
  phone: string
  email: string
  login: string
  password: string
  employee: EmployeeType
  isBlocked: boolean
}

export type GetAdminsResponseType = {
  users: AdminType[]
  totalCount: number
}

export type AdminType = {
  id: number
  role: string | undefined
  fullName: string
  phone: string
  email: string
  login: string
}

export type GetCurrentAdminResponseType = {
  id: number
  role: string
  fullName: string
  phone: string
  email: string
  login: string
  password: string
  isBlocked: boolean
}

export type GetCompaniesResponseType = {
  companies: CompaniesType[]
  totalCount: number
}

export type CompaniesType = {
  id: number
  name: string
  role: string
  city: string
  address: string
  contactFullName: string
  contactPhone: string
  email: string
  inn: string
  description: string
  isBlocked: boolean
  createdAt: string
  comments: CommentsType[]
  employees: EmployeeType[]
  images: string[]
  logo?: any
}

export type EmployeeType = {
  id: number | string
  createdAt: string
  company?: CompaniesType
}

export type CreateStaffResponseType = {
  employees: StaffType[]
  totalCount: number
}

export type StaffType = {
  id: number
  createdAt: string
  user: UserType
  company: CompaniesType
}

export type GetPlatformsResponseType = {
  places: PlaceType[]
  totalCount: number
}

export type PlaceType = {
  id: number
  name: string
  city: string
  address: string
  size: number
  description: string
  color: string
  images: string[]
  files: string[]
  createdAt: string
  company: CompaniesType
  isBlocked: boolean
}

export interface ClaimResponseType {
  peopleCount: string
  startDate: string
  endDate: string
  user: UserType
  place: PlaceType
  id: number
  status: string
  createdAt: string
  description: string | null
  comments: CommentsType[]
}

export interface ClaimForTableType {
  peopleCount: string
  startDate: number[]
  endDate: number[]
  startTime: string
  endTime: string
  user: UserType
  place: PlaceType
  id: number
  status: string
  createdAt: string
}

export type GetCompanyCommentsResponseType = CommentsType[]

export interface CommentsType {
  id: number
  text: string
  file: any
  createdAt: string
  company: CompaniesType
  user: UserType
}

export type GetRegistrationRequestType = {
  requests: RegistrationRequestType[]
  totalCount: number
}

export type RegistrationRequestType = {
  id: number
  companyName: string
  inn: string
  city: string
  address: string
  contactFullName: string
  contactPhone: string
  email: string
  login: string
  password: string
  role: string
  status: string
  createdAt: string
}

export type CategoryType = {
  id: number
  title: string
}

export type ClaimsFromPlacesResponseType = ClaimsFromPlacesType[]

export type ClaimsFromPlacesType = {
  id: number
  name: string
  city: string
  address: string
  size: number
  description: string
  color: string
  images: string[]
  files: string[]
  isBlocked: boolean
  createdAt: string
  requests: RequestType[]
}

export type RequestType = {
  id: number
  status: string
  peopleCount: number
  startDate: string
  endDate: string
  description: any
  files: any[]
  createdAt: string
}

export type getMeResponseData = {
  id: number
  createdAt: string
  user: UserType
  company: CompaniesType
}
