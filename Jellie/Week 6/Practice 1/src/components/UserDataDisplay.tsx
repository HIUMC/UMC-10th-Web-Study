import { useCustomFetch } from '../hooks/useCustomFetch';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDataDisplayProps {
  userId: number;
}

export const UserDataDisplay = ({ userId }: UserDataDisplayProps) => {
  const { data, isPending, isError } = useCustomFetch<User>(
    'https://jsonplaceholder.typicode.com/users/' + userId
  );

  if (isPending) {
    return <div>Loading... User ID: {userId}</div>;
  }

  if (isError) {
    return <div>요청 실패</div>;
  }

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <p>User ID: {data?.id}</p>
    </div>
  );
};