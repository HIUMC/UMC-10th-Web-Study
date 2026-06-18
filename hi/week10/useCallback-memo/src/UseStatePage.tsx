import {useState, useMemo} from 'react';

function heavyComputation():number {
    let result =0;
    for(let i=0; i<1_000_000000;i++) {
        result+=i;
    }
    return result;
}

function UseState() {
    const initialCount = useMemo(heavyComputation, []);
    const [count, setCount] = useState(initialCount);

    const handleIncrease = () : void => {
        setCount((prev) : number => prev+1);
    };

    return (
        <>
          <h3>{count}</h3>
          <button onClick={handleIncrease}>증가</button>
        </>
    );
}

export default UseState;