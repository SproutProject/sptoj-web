import axios from 'axios'
import * as _ from 'lodash'
import * as moment from 'moment-timezone'
import { User, UserCategory } from './user-service'

export interface PartialList<T> {
  data: T[]
  count: number
}

export interface Profile {
  uid: number
  name: string
  category: UserCategory
  rate?: number
}

interface TriedProblem {
  [key: string]: { result: number }
}

export interface UserStatistic {
  tried_problems: TriedProblem
}

export interface Problem {
  uid: number
  revision: string
  name: string
  timelimit: number
  memlimit: number
  lang: string
  checker: string
  subtask: number[]
}

export interface ProblemRate {
  index: number
  count: number
  score: number
}

export interface ProItem {
  uid: number
  hidden: boolean
  deadline: string | null
  metadata: { section?: string }
  problem: Problem
}

export interface ProSet {
  uid: number
  name: string
  hidden: boolean
  metadata: { category: number }
}

export enum JudgeState {
  pending = 0,
  judging = 1,
  done = 2,
}

export interface Subtask {
  uid: number
  index: number
  state: JudgeState
  metadata: void
}

export interface Ranker {
  profile: Profile
  rate: number
  results: { [key: number]: number }
}

export interface Challenge {
  uid: number
  state: JudgeState
  timestamp: string
  metadata: void
  submitter: User
  problem: Problem
  subtasks?: Subtask[]
  code?: string
}

export class ChallengeFilter {
  user_uid: number | null | '' = null
  problem_uid: number | null | '' = null
  result: number | null = null

  load(data: string) {
    let obj = JSON.parse(data)
    this.user_uid = obj['user_uid']
    this.problem_uid = obj['problem_uid']
    this.result = obj['result']
  }

  serialize(): string {
    if (this.user_uid === '') {
      this.user_uid = null
    }
    if (this.problem_uid === '') {
      this.problem_uid = null
    }
    return JSON.stringify(this)
  }
}

export async function emit<T>(path: string, data = {}): Promise<T> {
  let result = await axios.post('/api' + path, data);
  return result.data as T
}

export async function getProfile(user_uid: number): Promise<'Error' | Profile> {
  return await emit<'Error' | Profile>(`/user/${user_uid}/profile`, {})
}

export async function getUserStatistic(user_uid: number): Promise<'Error' | UserStatistic> {
  return await emit<'Error' | UserStatistic>(`/user/${user_uid}/statistic`, {})
}

export async function listUser(): Promise<'Error' | User[]> {
  return await emit<'Error' | User[]>('/user/list', {})
}

export async function setUser(data: { uid: number, name: string, password?: string, category?: UserCategory }): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/user/${data.uid}/set`, data)
}

export async function removeUser(user_uid: number): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/user/${user_uid}/remove`, {})
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
  return await emit<'Error' | 'Success'>(`/proset/${proset.uid}/set`, proset)
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

export async function updateProblem(problem_uid: number, git_url: string): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/problem/${problem_uid}/update`, { git_url })
}

export async function removeProblem(problem_uid: number): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/problem/${problem_uid}/remove`, {})
}

export async function listProblem(): Promise<'Error' | { problem: Problem, git: string }[]> {
  return await emit<'Error' | { problem: Problem, git: string }[]>(`/problem/list`, {})
}

export async function getProblem(problem_uid: number): Promise<'Error' | Problem> {
  return await emit<'Error' | Problem>(`/problem/${problem_uid}/get`, {})
}

export async function getProblemRate(problem_uid: number, category: UserCategory): Promise<'Error' | ProblemRate[]> {
  return await emit<'Error' | ProblemRate[]>(`/problem/${problem_uid}/rate`, { category })
}

export async function submit(problem_uid: number, code: string, lang: string): Promise<'Error' | number> {
  return await emit<'Error' | number>(`/problem/${problem_uid}/submit`, { code, lang })
}

export async function rejudgeChallenge(problem_uid: number): Promise<'Error' | 'Success'> {
  return await emit<'Error' | 'Success'>(`/challenge/rejudge`, { problem_uid })
}

export async function getChallenge(challenge_uid: number): Promise<'Error' | Challenge> {
  let challenge = await emit<'Error' | Challenge>(`/challenge/${challenge_uid}/get`, {})
  if (challenge !== 'Error') {
    let date = moment(challenge.timestamp, moment.ISO_8601).tz(moment.tz.guess())
    challenge.timestamp = date.format('YYYY/MM/DD HH:mm:ss')
  }
  return challenge
}

export async function listChallenge(offset: number, filter: ChallengeFilter | null = null): Promise<'Error' | (PartialList<Challenge | null>)> {
  let partial_list = await emit<'Error' | (PartialList<Challenge | null>)>(`/challenge/list`, { offset, filter })
  if (partial_list !== 'Error') {
    for (let challenge of partial_list.data) {
      if (challenge !== null) {
        let date = moment(challenge.timestamp, moment.ISO_8601).tz(moment.tz.guess())
        challenge.timestamp = date.format('YYYY/MM/DD HH:mm:ss')
      }
    }
  }
  return partial_list
}

export async function getRank(proset_uid: number): Promise<'Error' | Ranker[]> {
  return await emit<'Error' | Ranker[]>(`/rank/${proset_uid}/list`, {})
}

export function getCategory(category: UserCategory): string {
  switch(category) {
    case UserCategory.universe: return 'Universe'
    case UserCategory.algo: return 'Algo'
    case UserCategory.clang: return 'CLang'
    case UserCategory.pylang: return 'PyLang'
  }
}

export function getResult(state: JudgeState, result: number, abbreviation=false): string {
  if (abbreviation) {
    switch (state) {
      case JudgeState.pending: return 'PD'
      case JudgeState.judging: return 'JD'
      case JudgeState.done:
        switch (result) {
          case 1: return 'AC'
          case 2: return 'WA'
          case 3: return 'RE'
          case 4: return 'TLE'
          case 5: return 'MLE'
          case 6: return 'CE'
          default: return 'OTH'
        }
      default: return 'UNK'
    }
  } else {
    switch (state) {
      case JudgeState.pending: return 'Pending'
      case JudgeState.judging: return 'Judging'
      case JudgeState.done:
        switch (result) {
          case 1: return 'Accepted'
          case 2: return 'Wrong Answer'
          case 3: return 'Runtime Error'
          case 4: return 'Time Limit Exceeded'
          case 5: return 'Memory Limit Exceeded'
          case 6: return 'Compile Error'
          default: return 'Other'
        }
      default: return 'Unknown'
    }
  }
}