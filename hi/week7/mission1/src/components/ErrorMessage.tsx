interface ErrorMessageProps {
  onRetry: () => void;
}

const ErrorMessage = ({ onRetry }: ErrorMessageProps) => {
  return (
    <div className="error-box">
      <p>데이터를 불러오지 못했습니다.</p>
      <button onClick={onRetry}>다시 시도</button>
    </div>
  );
};

export default ErrorMessage;