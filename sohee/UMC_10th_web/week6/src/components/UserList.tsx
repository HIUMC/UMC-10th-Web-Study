import React, { useState } from 'react';
import { useQuery, queryClient } from '../hooks/useQuery';

/**
 * 예제: JSONPlaceholder API를 사용한 사용자 데이터 조회
 */
export function UserList(): React.ReactElement {
  const [userId, setUserId] = useState(1);
  const [staleTime, setStaleTime] = useState(5000);
  const [retry, setRetry] = useState(3);
  const [enabled, setEnabled] = useState(true);

  // useQuery 사용 - 기본 옵션
  const { data: user, loading, error, isStale, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log(`📡 Fetching user ${userId}...`);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    staleTime: staleTime,
    retry: retry,
    retryDelay: 500,
    enabled: enabled,
    select: (data: any) => {
      return {
        ...data,
        displayName: `${data.name} (${data.email})`,
      };
    },
  });

  // useQuery 사용 - posts 조회
  const { data: posts, loading: postsLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      console.log(`📡 Fetching posts for user ${userId}...`);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}&_limit=3`
      );
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 10000,
    enabled: !!user,
  });

  const handleRefetch = () => {
    console.log('🔄 Refetching user data...');
    refetch();
  };

  const handleInvalidate = () => {
    console.log('❌ Invalidating cache...');
    queryClient.invalidateQueries(['user', userId]);
  };

  const handleClearAll = () => {
    console.log('🗑️ Clearing all cache...');
    queryClient.invalidateAllQueries();
  };

  const handleViewCache = () => {
    console.log('📦 Current cache state:', queryClient.getAllCache());
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎯 useQuery 핵심 옵션 실습</h1>

      {/* 옵션 제어 패널 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h2>⚙️ 옵션 제어</h2>

        <div style={{ marginBottom: '10px' }}>
          <label>
            User ID:
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              min="1"
              max="10"
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            staleTime (ms):
            <input
              type="number"
              value={staleTime}
              onChange={(e) => setStaleTime(Number(e.target.value))}
              step="1000"
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
          <small> - 데이터가 신선한 상태로 유지되는 시간</small>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            retry:
            <input
              type="number"
              value={retry}
              onChange={(e) => setRetry(Number(e.target.value))}
              min="0"
              max="5"
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
          <small> - 실패 시 재시도 횟수</small>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            enabled - 쿼리 자동 실행
          </label>
        </div>
      </div>

      {/* 상태 표시 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h2>📊 상태</h2>

        <div>
          <strong>Loading:</strong> {loading ? '⏳ true' : '✅ false'}
        </div>
        <div>
          <strong>Error:</strong> {error ? `❌ ${error}` : '✅ null'}
        </div>
        <div>
          <strong>isStale:</strong> {isStale ? '🔄 true' : '✨ false'}
        </div>
      </div>

      {/* 데이터 표시 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h2>👤 User Data</h2>

        {loading && <p>⏳ Loading user data...</p>}
        {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}

        {user && !loading && (
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.displayName}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Website:</strong> {user.website}
            </p>
          </div>
        )}
      </div>

      {/* Posts 표시 */}
      {user && (
        <div
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          <h2>📝 Recent Posts</h2>

          {postsLoading && <p>⏳ Loading posts...</p>}

          {posts && !postsLoading && (
            <div>
              {posts.map((post: any) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <strong>{post.title}</strong>
                  <p>{post.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 캐시 제어 버튼 */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleRefetch}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🔄 Refetch
        </button>
        <button
          onClick={handleInvalidate}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          ❌ Invalidate User Cache
        </button>
        <button
          onClick={handleClearAll}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🗑️ Clear All Cache
        </button>
        <button
          onClick={handleViewCache}
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          📦 View Cache (Console)
        </button>
      </div>

      {/* 설명 */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '5px',
          borderLeft: '4px solid #007bff',
        }}
      >
        <h3>💡 핵심 개념</h3>
        <ul>
          <li>
            <strong>queryKey:</strong> 캐시를 식별하는 키. 값이 바뀌면 새로
            fetch됨
          </li>
          <li>
            <strong>staleTime:</strong> 데이터가 신선한 상태로 유지되는 시간.
            이 시간 내에는 캐시를 사용
          </li>
          <li>
            <strong>retry:</strong> API 호출 실패 시 자동으로 재시도하는 횟수
          </li>
          <li>
            <strong>enabled:</strong> false일 때 쿼리가 자동으로 실행되지 않음
            (수동으로 refetch 필요)
          </li>
          <li>
            <strong>select:</strong> fetch한 데이터를 변환하는 함수
          </li>
          <li>
            <strong>isStale:</strong> 현재 데이터가 staleTime을 넘었는지 여부
          </li>
        </ul>
      </div>
    </div>
  );
}
