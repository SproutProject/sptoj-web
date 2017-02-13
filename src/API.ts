import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

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
  deadline: string | null
  metadata: Object
  problem: Problem
}

export interface ProSet {
  uid: number
  name: string
  hidden: boolean
}

class ProItemObject implements ProItem {
  uid: number
  hidden: boolean
  deadline: string | null
  metadata: Object
  problem: Problem

  constructor(proitem: ProItem) {
    this.uid = proitem.uid
    this.hidden = proitem.hidden
    if (proitem.deadline === null) {
      this.deadline = null
    } else {
    }
    this.metadata = proitem.metadata
    this.problem = proitem.problem
  }
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

export async function removeProSet(proset_uid: number): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/proset/${proset_uid}/remove`, {})
}

export async function addProItem(proset_uid: number, problem: Problem): Promise<'Error' | number> {
  return await emit<'Error' | number>(`/proset/${proset_uid}/add`, {
    problem_uid: problem.uid,
  })
}

export async function getProItem(proset_uid: number, proitem_uid: number): Promise<'Error' | ProItem> {
  let proitem = await emit<'Error' | ProItem>(`/proset/${proset_uid}/${proitem_uid}/get`, {})
  if (proitem !== 'Error') {
    if (proitem.deadline !== null) {
      let date = moment(proitem.deadline, moment.ISO_8601).tz(moment.tz.guess())
      proitem.deadline = date.format('YYYY/MM/DD')
    }
  }
  return proitem
}

export async function setProItem(proset_uid: number, proitem: ProItem): Promise<'Error' | 'Success'> {
  let modified_proitem = _.cloneDeep(proitem)
  if (proitem.deadline === '') {
    modified_proitem.deadline = null
  } else if (proitem.deadline !== null) {
    modified_proitem.deadline = proitem.deadline + '+0800'
  }
  return await emit<'Error' | 'Success'>(`/proset/${proset_uid}/${proitem.uid}/set`, modified_proitem)
}

export async function removeProItem(proset_uid: number, proitem_uid: number): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/proset/${proset_uid}/${proitem_uid}/remove`, {})
}

export async function listProItem(proset_uid: number): Promise<'Error' | ProItem[]> {
  let proitems = await emit<'Error' | ProItem[]>(`/proset/${proset_uid}/list`, {})
  if (proitems !== 'Error') {
    for (let proitem of proitems) {
      if (proitem.deadline !== null) {
        let date = moment(proitem.deadline, moment.ISO_8601).tz(moment.tz.guess())
        proitem.deadline = date.format('YYYY/MM/DD')
      }
    }
  }
  return proitems
}

export async function submit(proset_uid: number, proitem_uid: number, code: string, lang: string): Promise<'Error' | number> {
  return await emit<'Error' | number>(`/proset/${proset_uid}/${proitem_uid}/submit`, {
    code,
    lang,
  })
}

export async function updateProblem(): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/problem/update`, {})
}

export async function listProblem(): Promise<'Error' | Problem[]> {
  return await emit<'Error' | Problem[]>(`/problem/list`, {})
}
