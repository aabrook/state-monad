# state-monad

This is an implementation of the state monad, following a similar interface to Haskell's but following fantasy-lands naming conventions.

# Examples

## .of to initialise pipeline
The `.of` function will assign the default value in the left side of the tuple.

## .runState
`.runState` will run the state pipeline using the initial state provided. Virtually `.of` assigns the value side of the tuple, `.runState` loads the state side. `[value, state]`.

## .map to update evaluation
The `.map` function works with the left side of the State tuple. This allows you to work across functions without changing the final state you're working with.

```javascript
const triple = (a) => a * 3

State.of(4)
  .map(triple)
  .runState({ init: 4 })
// [ 12, { init: 4 } ]
```

## .chain to update state
`.chain` is when you want to update the State that you are working with. To follow the `.chain` convention you need to return a State,
the State provided will receive the current state through the execution pipeline.

```javascript
const State = require('state-monad')

const triple = (a) => a * 3

State.of(4)
  .map(triple)
  .chain(n => State(s => [n, Object.assign({}, { tripled: n }, s)])) // n is the result of map, s is the state
  .runState({ init: 4 })
// [ 12, { tripled: 12, init: 4 } ]
```

## Helpers

### .withState
.withState is a higher order function with the signature `(a, b) -> a` where the state tuple is `[a, b]`. The result will update the value in the tuple.

```javascript
const add = (a, b) => a + b

State
  .of(4)
  .withState(add)
  .runState(5)
// [ 9, 5 ]
```

### .exec
`.exec` is similar to `.runState` but it only returns the right side of the tuple. The current "state"

```javascript
const add = (a, b) => a + b

State
  .of(4)
  .withState(add)
  .exec(5)
// 5
```

### .eval
`.eval` is similar to `.runState` but it only returns the left side of the tuple. The current "value"

```javascript
const add = (a, b) => a + b

State
  .of(4)
  .withState(add)
  .eval(5)
// 9
```

### State.get
This is useful when working within a chain block. It loads the state into the left side of the tuple, which you can then map over and leave the current state.

You can also use `State.of('value').get()` if you want to create a pipelined chain. This loads the state into the value.

```javascript
const State = require('state-monad')

const triple = (a) => a * 3

State.of(4)
  .map(triple)
  .chain(n => State.get().map(s => Object.assign({}, { tripled: n }, s))) // n is the result of map, s is the state
  .runState({ init: 4 })
// [ { tripled: 12, init: 4 }, { init: 4 } ]
```

### State.put
The inverse of `State.get`. This will update/override the current state and value to whatever is provided.

You can use `State.of('value').put('some_value')` if you need to update the state with a constant within the pipeline.

```javascript
State.of(4)
  .map(triple)
  .chain(n => State.put({ tripled: n }))
  .runState({ init: 4 })
// [ { tripled: 12 }, { tripled: 12 } ]
```

