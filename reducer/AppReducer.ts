
 export type State ={
  displayNavigation: boolean,
  themeMode: "dark" | "light",
  currentModel: string
 }

 export enum ActionType {
  UPDATE = "UPDATE"
 }

 type UpdateAction<K extends keyof State = keyof State> = {
  type: ActionType.UPDATE
  field: K
  value: State[K]
 }

 export type Action = UpdateAction

 export const initState: State = {
  displayNavigation: true,
  themeMode: "light",
  currentModel: "gpt-3.5"
 }

 export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.UPDATE:
      return { ...state, [action.field]: action.value}
    default: throw new Error()
  }
 }