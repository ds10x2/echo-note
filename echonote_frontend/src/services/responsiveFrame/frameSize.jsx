export function FrameSize(standardWidth, standardHeight) {
  const body = document.querySelector("body");
  const root = document.querySelector("#App"); // root 대신 App을 조정해야 합니다.

  // 현재 화면 너비 및 높이
  let width = body.clientWidth;
  let height = body.clientHeight;

  // 화면 비율에 따라 zoom 값을 계산
  let zoomWidth = width / standardWidth;
  let zoomHeight = height / standardHeight;

  // 화면 비율에 맞는 zoom 값을 사용 (너비와 높이 중 더 작은 비율 사용)
  const zoom = Math.min(zoomWidth, zoomHeight);

  // root에 zoom 적용
  root.style.zoom = zoom;
}
