// 로컬 스토리지(브라우저 저장소)를 쉽게 다루기 위해 만든 커스텀 유틸리티 함수S
// 사용 시 key(저장소 이름)를 넣어 호출
export const useLocalStorage = (key: string) => {
  // 1. 데이터 저장
  const setItem = (value: unknown) => {
    try {
      // 로컬 스토리지는 '문자열'만 저장 가능
      // 객체나 배열 데이터의 깨짐 방지를 위해 JSON.stringify()로 변환하여 저장.
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  // 2. 데이터 불러오기
  const getItem = () => {
    try {
      // 저장소에서 해당 key의 데이터 조회.
      const item: string | null = window.localStorage.getItem(key);

      // 데이터 존재 시 JSON.parse()로 자바스크립트 객체로 변환, 없을 시 null 반환.
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
    }
  };

  // 3. 데이터 삭제
  const removeItem = () => {
    try {
      // 해당 key로 저장된 데이터 완전 삭제.
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};
