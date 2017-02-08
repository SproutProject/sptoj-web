import axios from 'axios';

export async function emit<T>(path: string, data = {}): Promise<T> {
  let result = await axios.post('/api' + path, data);
  return result.data as T
}