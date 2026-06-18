import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleIncreaseCount = useCallback(
    (number: number): void => {
      setCount(count + number);
    },
    [count],
  );

  const handleText = useCallback((text: string): void => {
    setText(text);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          같이 배우는 리액트 useCallback편
        </h1>

        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-600">
            Count : <span className="text-blue-500 text-xl">{count}</span>
          </h2>
          <CountButton onClick={handleIncreaseCount} />
        </div>

        <hr className="border-gray-200" />

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-600 text-center">
            Text
          </h2>
          <div className="flex flex-col gap-2">
            <span className="min-h-[1.5rem] text-center text-gray-700 font-medium">
              {text}
            </span>
            <TextInput onChange={handleText} />
          </div>
        </div>
      </div>
    </div>
  );
}
