/**
 * 특정한 props가 DOM에 전달되지 않도록 필터링하는 유틸리티 함수
 * @param {string[]} blockedProps - DOM으로 전달되지 않게 할 props의 배열
 * @returns {function} - styled-components의 withConfig에서 사용되는 함수
 */

export const shouldNotForwardPropsWithKeys = (blockedProps = []) => {
  return (propName) => !blockedProps.includes(propName);
};
