// import Map from "./components/Map"
// import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../providers/store"
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from "../../providers/redux-test/redux-toolkit"
import { useCallback } from "react";

function ReduxTest() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch();

  const handleIncrement = useCallback(() => dispatch(increment()), [dispatch])
  const handleDecrement = useCallback(() => dispatch(decrement()), [dispatch])
  // const handleIncrementByAmount = useCallback(() => dispatch(incrementByAmount(5)), [dispatch])
  
  return (
    <>
      <div>
        <button
          onClick={handleIncrement}
          // onClick={() => dispatch({type: "counter/increment"})}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          onClick={handleDecrement}
          // onClick={() => dispatch({type: "counter/decrement"})}
        >
          Decrement
        </button>
      </div>
    </>
  )
}

export default ReduxTest
