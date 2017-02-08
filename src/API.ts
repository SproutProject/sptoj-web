import axios from 'axios';

export interface ProSet {
  uid: number,
  name: string,
}

export async function emit<T>(path: string, data = {}): Promise<T> {
  let result = await axios.post('/api' + path, data);
  return result.data as T
}
