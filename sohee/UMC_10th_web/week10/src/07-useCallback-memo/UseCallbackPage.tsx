import { useCallback, useState } from 'react';
import CountButton from './components/CountButton';
import TextInput from './components/TextInput';

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>('');

  const handleIncreaseCount = useCallback((number: number): void => {
    setCount(count + number);
    // 빈 배열은 이 함수가 처음 한 번만 만들어져야 한다.
    // 함수 내부에서 count 같은 0으로 기억하고 있어요.
    // 두번째 클릭을 해도, 0 + 10이 되어서 count 값이 변하지않아요.
    // 첫번째 클릭도 0 + 10
    // 두번째 클릭도 0 + 10
  }, []);

  const handleText = (text: string): void => {
    setText(text);
  };

  return (
    <div className="use-callback-page">
      <h1>같이 배우는 리액트 useCallback편</h1>
      <h2>Count : {count}</h2>
      <CountButton onClick={handleIncreaseCount} />
      <h2>Text</h2>
      <div className="flex flex-col">
        <span>{text}</span>
        <TextInput text={text} onChange={handleText} />
      </div>
    </div>
  );
}
