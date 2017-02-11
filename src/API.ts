import axios from 'axios';

export interface Problem {
  uid: number
  revision: string
  name: string
  timelimit: number
  memlimit: number
  lang: string
  checker: string
  scoring: string
  subtask: number[]
}

export interface ProItem {
  uid: number
  hidden: boolean
  problem: Problem
}

export interface ProSet {
  uid: number
  name: string
  hidden: boolean
}

export async function emit<T>(path: string, data = {}): Promise<T> {
  let result = await axios.post('/api' + path, data);
  return result.data as T
}

export async function listProSet(): Promise<'Error' | ProSet[]> {
  return await emit<'Error' | ProSet[]>('/proset/list', {})
}

export async function createProSet(name: string): Promise<'Error' | number> {
  return await emit<'Error' | number>('/proset/create', {
    name: name,
  })
}

export async function getProSet(proset_uid: number): Promise<'Error' | ProSet> {
  return await emit<'Error' | ProSet>(`/proset/${proset_uid}/get`, {})
}

export async function setProSet(proset: ProSet): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/proset/${proset.uid}/set`, {
    name: proset.name,
    hidden: proset.hidden,
  })
}

export async function addProItem(proset: ProSet, problem: Problem): Promise<'Error' | number> {
  return await emit<'Error' | number>(`/proset/${proset.uid}/add`, {
    problem_uid: problem.uid,
  })
}

export async function getProItem(proset_uid: number, proitem_uid: number): Promise<'Error' | ProItem> {
  return await emit<'Error' | ProItem>(`/proset/${proset_uid}/${proitem_uid}/get`, {})
}

export async function listProItem(proset_uid: number): Promise<'Error' | ProItem[]> {
  return await emit<'Error' | ProItem[]>(`/proset/${proset_uid}/list`, {})
}

export async function updateProblem(): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/problem/update`, {})
}

export async function listProblem(): Promise<'Error' | Problem[]> {
  return await emit<'Error' | Problem[]>(`/problem/list`, {})
}
