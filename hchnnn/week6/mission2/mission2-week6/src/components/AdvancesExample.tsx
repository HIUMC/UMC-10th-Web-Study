import React, { useState } from 'react';
import { useQuery, queryClient } from '../hooks/useQuery';

/**
 * 고급 예제: 복잡한 데이터 흐름과 캐시 전략
 */
export function AdvancedExample(): React.ReactElement {
  const [selectedUser, setSelectedUser] = useState(1);
  const [filterTitle, setFilterTitle] = useState('');

  // 1단계: 사용자 정보 조회 (항상 실행)
  const { data: user, loading: userLoading, error: userError } = useQuery({
    queryKey: ['user', selectedUser],
    queryFn: async () => {
      console.log(`📡 [1단계] User ${selectedUser} 조회 중...`);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedUser}`
      );
      if (!response.ok) throw new Error('User 조회 실패');
      return response.json();
    },
    staleTime: 10000,
    retry: 2,
    select: (data: any) => ({
      id: data.id,
      name: data.name,
      email: data.email,
      company: data.company.name,
    }),
  });

  // 2단계: 댓글 조회 (user가 있을 때만 실행 - 종속 쿼리)
  const { data: comments, loading: commentsLoading } = useQuery({
    queryKey: ['userComments', selectedUser],
    queryFn: async () => {
      console.log(`📡 [2단계] User ${selectedUser}의 댓글 조회 중...`);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?name=*&email=${user.email}&_limit=5`
      );
      if (!response.ok) throw new Error('Comments 조회 실패');
      return response.json();
    },
    staleTime: 15000,
    enabled: !!user,
    select: (data: any) => data.slice(0, 3),
  });

  // 3단계: 앨범 조회 (user가 있을 때만 실행 - 종속 쿼리)
  const { data: albums, loading: albumsLoading } = useQuery({
    queryKey: ['userAlbums', selectedUser],
    queryFn: async () => {
      console.log(`📡 [3단계] User ${selectedUser}의 앨범 조회 중...`);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums?userId=${selectedUser}&_limit=5`
      );
      if (!response.ok) throw new Error('Albums 조회 실패');
      return response.json();
    },
    staleTime: 20000,
    enabled: !!user,
    select: (data: any) =>
      data.map((album: any) => ({
        ...album,
        isNew: album.id > 10,
      })),
  });

  // 로컬 필터링 (캐시된 데이터에 apply)
  const filteredAlbums = albums
    ?.filter((album: any) =>
      album.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .slice(0, 5) || [];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 고급: 종속 쿼리와 캐시 전략</h1>

      {/* 사용자 선택 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h2>사용자 선택</h2>
        <div>
          {[1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              onClick={() => setSelectedUser(id)}
              style={{
                padding: '10px 15px',
                marginRight: '5px',
                backgroundColor: selectedUser === id ? '#007bff' : '#e9ecef',
                color: selectedUser === id ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      {/* 사용자 정보 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h2>👤 사용자 정보 {userLoading && '(로딩 중...)'}</h2>

        {userError && <p style={{ color: 'red' }}>❌ 에러: {userError}</p>}

        {user && !userLoading && (
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <p>
              <strong>이름:</strong> {user.name}
            </p>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>
            <p>
              <strong>회사:</strong> {user.company}
            </p>
          </div>
        )}

        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          💾 staleTime: 10s | 캐시 ID: {JSON.stringify(['user', selectedUser])}
        </div>
      </div>

      {/* 댓글 섹션 - user가 로드된 후에만 나타남 */}
      {user && (
        <div
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          <h2>💬 댓글 {commentsLoading && '(로딩 중...)'}</h2>

          <p style={{ fontSize: '12px', color: '#666' }}>
            ℹ️ User 정보가 로드된 후 자동으로 댓글을 가져옵니다
            (enabled: !!user)
          </p>

          {comments && !commentsLoading && (
            <div>
              {comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
              ) : (
                comments.map((comment: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                      borderLeft: '4px solid #ffc107',
                    }}
                  >
                    <strong>{comment.name}</strong>
                    <p>{comment.body}</p>
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            💾 staleTime: 15s | enabled: {user ? 'true' : 'false'}
          </div>
        </div>
      )}

      {/* 앨범 섹션 - user가 로드된 후에만 나타남 */}
      {user && (
        <div
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          <h2>🎵 앨범 {albumsLoading && '(로딩 중...)'}</h2>

          <p style={{ fontSize: '12px', color: '#666' }}>
            ℹ️ User 정보가 로드된 후 자동으로 앨범을 가져옵니다
            (enabled: !!user)
          </p>

          {albums && !albumsLoading && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="앨범 제목으로 필터링..."
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                  }}
                />
                <small>검색 결과: {filteredAlbums.length}개</small>
              </div>

              <div>
                {filteredAlbums.length === 0 ? (
                  <p>일치하는 앨범이 없습니다.</p>
                ) : (
                  filteredAlbums.map((album: any) => (
                    <div
                      key={album.id}
                      style={{
                        backgroundColor: album.isNew ? '#e8f5e9' : '#f5f5f5',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        borderLeft: `4px solid ${
                          album.isNew ? '#4caf50' : '#757575'
                        }`,
                      }}
                    >
                      <strong>
                        {album.title} {album.isNew && '✨ New'}
                      </strong>
                      <p>Album ID: {album.id}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            💾 staleTime: 20s | enabled: {user ? 'true' : 'false'}
          </div>
        </div>
      )}

      {/* 캐시 현황 */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f7ff',
          borderRadius: '5px',
          borderLeft: '4px solid #007bff',
        }}
      >
        <h3>📦 캐시 상태</h3>
        <button
          onClick={() => {
            const cache = queryClient.getAllCache();
            console.table(cache);
            alert('캐시 정보를 콘솔에서 확인하세요!');
          }}
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          📊 캐시 조회 (Console)
        </button>

        <button
          onClick={() => {
            queryClient.invalidateAllQueries();
            alert('모든 캐시가 무효화되었습니다!');
          }}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🗑️ 모든 캐시 삭제
        </button>
      </div>

      {/* 종속 쿼리 설명 */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '5px',
          borderLeft: '4px solid #ffc107',
        }}
      >
        <h3>💡 종속 쿼리 (Dependent Queries)</h3>
        <ul>
          <li>
            <strong>문제:</strong> 댓글과 앨범 조회는 User 정보가 먼저 필요함
          </li>
          <li>
            <strong>해결:</strong> enabled 옵션으로 조건부 실행
          </li>
          <li>
            <strong>장점:</strong> 불필요한 API 호출 방지, 에러 방지
          </li>
          <li>
            <strong>순서:</strong> User 로드 → 댓글/앨범 자동 로드
          </li>
        </ul>
      </div>
    </div>
  );
}