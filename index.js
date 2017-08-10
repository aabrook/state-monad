// s -> (a, s)
const State = (st) => ({
  runState: (x) => st(x),
  map: (f) => State(x => {
    const [a, ss] = st(x)
    return [f(a), ss]
  }),
  chain: (f) => State(s => {
    const [l, r] = st(s)
    return f(l).runState(r)
  }),
  ap: (state) => State(s => {
    const [f, r] = st(s)
    const [a, u] = state.runState(r)
    return [f(a), u]
  }),
  get: () => State(s => {
    const [, r] = st(s)
    return [r, r]
  }),
  put: (s) => State(ss => {
    const [l] = st(ss)
    return [l, s]
  }),
  push: () => State(ss => {
    const [l] = st(ss)
    return [l, l]
  }),
  withState: (f) => State(s => [f(...st(s)), s]),
  exec: (x) => st(x)[1],
  eval: (x) => st(x)[0],
  extract: () => (st),
  inspect: () => `State(${st})`
})

State.of = (x) => State((s) => [x, s])
State.get = () => State(s => [s, s])
State.put = (v) => State(_ => [v, v])

module.exports = State
