export type NEvent<T extends string,R extends Record<string,any>> ={
    type: T,
    detail: R
}
  
export type ScrollEType = NEvent<'scroll',{
    direction: string
    scrollTop: number
}>
  