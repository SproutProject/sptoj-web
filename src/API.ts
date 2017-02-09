import axios from 'axios';

export interface ProSet {
  uid: number,
  name: string,
  hidden: boolean,
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