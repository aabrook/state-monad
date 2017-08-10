const assert = require('assert')

const id = a => a

module.exports = (M, run = id) => {
  it(`should abide by functor id law`, () => (
    assert.deepEqual(
      run(M.of('abc')
      .map(id)),
      run(M.of('abc'))
    )
  ))

  it(`should abide by composition law`, () => {
    const double = a => a * 2
    const add2 = a => a + 2

    assert.deepEqual(
      run(M.of(5)
        .map(double)
        .map(add2)),
      run(M.of(5)
        .map(x => add2(double(x))))
    )
  })

  it('should work with monad id', () => (
    assert.deepEqual(
      run(M.of(5)
        .chain(a => M.of(a))),
      run(M.of(5))
    )
  ))

  it('should return a >>= k  =  k a', () => (
    assert.deepEqual(
      run(M.of(5)
        .chain(s => M.of(s * 4))),
      run(M.of(5 * 4))
    )
  ))

  it('should abide by applicative id law', () => (
    assert.deepEqual(
      run(M.of(id).ap(M.of(4))),
      run(M.of(4))
    )
  ))

  it('should abide by applicative homomorphism law', () => {
    const double = a => a * 2
    assert.deepEqual(
      run(M.of(double)
        .ap(M.of(5))),
      run(M.of(double(5)))
    )
  })

  it('should abide by applicative composition law', () => {
    const double = a => a * 2
    const add2 = a => a + 2
    assert.deepEqual(
      run(M.of(a => b => x => a(b(x)))
        .ap(M.of(double))
        .ap(M.of(add2))
        .ap(M.of(5))),
      run(M.of(double(add2(5))))
    )
  })
}
