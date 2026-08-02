/**
 * 비발디(Vivaldi) / 크롬 개발자 도구(Console)용 추출 스크립트
 * 
 * [사용 방법]
 * 1. 비발디 브라우저에서 https://www.tokyomotion.net/search?search_query=kaori_xoxo&search_type=videos 접속
 * 2. F12 (개발자 도구) -> Console 탭 클릭
 * 3. 아래 전체 코드를 복사하여 붙여넣고 엔터(Enter) 실행
 * 4. 자동으로 각 비디오 페이지를 조회하여 추출 후 [JSON 데이터]를 콘솔에 출력하고 클립보드로 복사합니다!
 */

(async function collectTokyomotionVideos() {
  console.log("🚀 Tokyomotion 동영상 수집을 시작합니다...");

  // 현재 페이지의 비디오 링크 검색
  const links = Array.from(document.querySelectorAll('a[href*="/video/"]'))
    .map(a => a.getAttribute('href'))
    .filter((href, index, self) => href && self.indexOf(href) === index && href.match(/\/video\/\d+/));

  console.log(`📌 발견된 비디오 링크: ${links.length}개`);

  const results = [];

  for (let i = 0; i < links.length; i++) {
    const relativeUrl = links[i];
    const fullUrl = `https://www.tokyomotion.net${relativeUrl}`;
    const vidMatch = relativeUrl.match(/\/video\/(\d+)/);
    const vid = vidMatch ? vidMatch[1] : i;

    try {
      console.log(`[${i + 1}/${links.length}] Fetching ${fullUrl}...`);
      const resp = await fetch(fullUrl);
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // 제목 추출
      const title = doc.querySelector('title')?.textContent?.replace('- TOKYO Motion', '').trim() || `Tokyomotion ${vid}`;
      
      // 썸네일 추출
      const poster = doc.querySelector('video')?.getAttribute('poster') || 
                     doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || "";
                     
      // MP4 URL 추출
      let mp4Url = doc.querySelector('video source')?.getAttribute('src') || "";
      if (!mp4Url) {
        const mp4Match = text.match(/https:\/\/[^"'\s]+\.mp4[^"'\s]*/);
        if (mp4Match) mp4Url = mp4Match[0];
      }

      if (mp4Url) {
        results.push({
          id: `tm_${vid}`,
          title: `[Tokyomotion] ${title}`,
          videoUrl: mp4Url,
          thumbnailUrl: poster
        });
        console.log(`✅ 성공: ${title}`);
      } else {
        console.warn(`⚠️ MP4 URL을 찾을 수 없음: ${fullUrl}`);
      }
    } catch (e) {
      console.error(`❌ 에러 발생: ${fullUrl}`, e);
    }
  }

  console.log("🎉 수집 완료! 총 " + results.length + "개 수집됨.");
  console.log(JSON.stringify(results, null, 2));

  // 클립보드로 복사
  copy(JSON.stringify(results, null, 2));
  alert(`총 ${results.length}개의 Tokyomotion 비디오 데이터가 클립보드에 복사되었습니다!\n대화창에 붙여넣어 주시면 플레이어에 바로 통합해 드립니다.`);
})();
