import { memo } from 'react';

type CountButtonProps = {
  onClick: (number: number) => void;
};

function CountButton({ onClick }: CountButtonProps) {
  console.log('CountButton rendering');

  return <button onClick={() => onClick(10)}>카운트 증가</button>;
}

export default memo(CountButton);
