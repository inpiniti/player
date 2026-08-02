import { useState, useRef } from 'react';
import { KAORI_VIDEOS, type VideoItem } from './data/videos';
import { Play, Film, Loader2, ExternalLink, ThumbsUp, ThumbsDown, Share2, Bookmark, MessageSquare, Sparkles, ArrowLeft, Grid, LayoutList } from 'lucide-react';

export default function App() {
  // viewMode: 'grid' (홈/목록 화면) 또는 'detail' (상세 재생 화면)
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(KAORI_VIDEOS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likeCount, setLikeCount] = useState<number>(358);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // 목록 화면 스크롤 위치 저장용 Ref
  const gridScrollPosRef = useRef<number>(0);
  // 우측 추천 동영상 목록 Container Ref
  const sidebarListRef = useRef<HTMLDivElement>(null);

  const handleSelectVideo = (video: VideoItem) => {
    if (viewMode === 'grid') {
      gridScrollPosRef.current = window.scrollY;
    }
    setSelectedVideo(video);
    setIsLoading(!video.id.startsWith('tm_'));
    setViewMode('detail');
    
    // 화면 전체 및 우측 추천 목록 스크롤 최상단 초기화
    window.scrollTo(0, 0);
    if (sidebarListRef.current) {
      sidebarListRef.current.scrollTop = 0;
    }
  };

  const handleGoToGrid = () => {
    setViewMode('grid');
    // DOM 업데이트 후 저장했던 스크롤 위치로 복원
    setTimeout(() => {
      window.scrollTo(0, gridScrollPosRef.current);
    }, 0);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-slate-100 font-sans flex flex-col">
      {/* GNB 상단 헤더 */}
      <header className="h-14 border-b border-zinc-800/80 px-4 bg-[#0f0f0f] flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          {viewMode === 'detail' && (
            <button
              onClick={handleGoToGrid}
              className="p-2 -ml-1 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="목록으로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
              <span className="hidden sm:inline">목록으로</span>
            </button>
          )}

          <div
            onClick={handleGoToGrid}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-1.5 bg-rose-600 rounded-lg text-white group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              Kaori Player <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-normal border border-rose-500/30">Fansly Collection</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button
              onClick={handleGoToGrid}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-rose-600 text-white font-medium' : 'hover:text-zinc-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>목록</span>
            </button>
            <button
              onClick={() => {
                setViewMode('detail');
                window.scrollTo(0, 0);
              }}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'detail' ? 'bg-rose-600 text-white font-medium' : 'hover:text-zinc-200'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>재생 중</span>
            </button>
          </div>
          <span className="hidden sm:inline">총 {KAORI_VIDEOS.length}개 비디오</span>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      {viewMode === 'grid' ? (
        /* ================= 목록 화면 (Grid View) ================= */
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                전체 동영상 목록 <span className="text-sm font-normal text-zinc-400">({KAORI_VIDEOS.length})</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">시청할 비디오 카드를 클릭하면 상세 재생 화면으로 이동합니다.</p>
            </div>
          </div>

          {/* 유튜브 홈 스타일 반응형 비디오 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {KAORI_VIDEOS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectVideo(item)}
                className="flex flex-col gap-2.5 cursor-pointer group"
              >
                {/* 썸네일 컨테이너 */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md group-hover:border-rose-500/50 transition-all duration-200">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* 재생 오버레이 아이콘 */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-medium">
                    Fansly
                  </span>
                </div>

                {/* 하단 메타 정보 */}
                <div className="flex gap-3 px-0.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm mt-0.5">
                    K
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400">
                      <span>Kaori Xoxo</span>
                      <span className="w-3 h-3 rounded-full bg-zinc-500 text-black text-[8px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5">게시물 #{item.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* ================= 상세 재생 화면 (Detail View) ================= */
        <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 모바일 뒤로가기 상단 바 */}
          <div className="lg:hidden col-span-1 -mb-2">
            <button
              onClick={handleGoToGrid}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 rounded-lg text-xs text-zinc-300 font-medium border border-zinc-700/50"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              <span>목록으로 돌아가기</span>
            </button>
          </div>

          {/* 좌측 영역: 비디오 플레이어 + 제목/채널/버튼 + 영상 상세 설명 + 댓글 영역 (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* 1. 비디오 플레이어 - lg 이상 화면에서 sticky 상단 고정 */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-zinc-800 lg:sticky lg:top-18 z-20">
              {isLoading && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                  <p className="text-xs text-rose-200 font-medium">영상을 로딩 중입니다...</p>
                </div>
              )}
              <video
                key={selectedVideo.videoUrl}
                controls
                autoPlay
                src={selectedVideo.videoUrl}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 2. 비디오 타이틀 */}
            <h1 className="text-lg md:text-xl font-bold text-zinc-100 leading-snug">
              {selectedVideo.title}
            </h1>

            {/* 3. 채널 프로필 & 액션 버튼 바 */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-1">
              {/* 프로필 정보 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-md">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-zinc-100">Kaori Xoxo</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-400 text-black text-[9px] flex items-center justify-center font-bold">✓</span>
                  </div>
                  <span className="text-xs text-zinc-400">Myfans Official</span>
                </div>
                <button className="ml-2 px-4 py-2 bg-zinc-100 hover:bg-white text-black font-semibold text-xs rounded-full transition-colors">
                  구독
                </button>
              </div>

              {/* 버튼 모음 */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center bg-zinc-800/80 rounded-full border border-zinc-700/50 overflow-hidden">
                  <button 
                    onClick={handleLike} 
                    className={`flex items-center gap-1.5 px-3.5 py-2 hover:bg-zinc-700/70 transition-colors ${isLiked ? 'text-rose-400 font-bold' : 'text-zinc-200'}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-700" />
                  <button className="px-3 py-2 hover:bg-zinc-700/70 text-zinc-200 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                <a
                  href={selectedVideo.originalUrl || selectedVideo.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-700/70 text-zinc-200 rounded-full border border-zinc-700/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>원본 링크</span>
                </a>

                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-700/70 text-zinc-200 rounded-full border border-zinc-700/50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>공유</span>
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-700/70 text-zinc-200 rounded-full border border-zinc-700/50 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            </div>

            {/* 4. 비디오 상세 정보 박스 */}
            <div className="bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors p-4 rounded-xl text-xs text-zinc-300 space-y-2 border border-zinc-800">
              <div className="flex items-center gap-3 font-semibold text-zinc-200">
                <span>게시물 번호 #{selectedVideo.id}</span>
                <span>•</span>
                <span className="text-rose-400">Fansly Exclusive</span>
              </div>
              <p className="leading-relaxed text-zinc-400">
                Kissjav `[Myfans] Kaori Xoxo 모음` 비디오 콘텐츠입니다. 선택한 콘텐츠의 임시 미디어 URL 스트리밍으로 직접 재생됩니다.
              </p>
            </div>

            {/* 5. 댓글 영역 시뮬레이션 */}
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold text-zinc-100">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  댓글 140개
                </span>
              </div>

              {/* 댓글 입력창 mock */}
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                  ME
                </div>
                <input
                  type="text"
                  placeholder="댓글 추가..."
                  className="flex-1 bg-transparent border-b border-zinc-700 focus:border-zinc-300 text-xs py-1.5 outline-none transition-colors"
                />
              </div>
            </div>

          </div>

          {/* 우측 영역: 관련 비디오 추천 목록 (col-span-4) - sticky로 상단 고정 */}
          <div className="lg:col-span-4 flex flex-col gap-3 lg:sticky lg:top-18 self-start">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                다음 추천 동영상 ({KAORI_VIDEOS.length})
              </h2>
              <button
                onClick={handleGoToGrid}
                className="text-xs text-rose-400 hover:underline font-medium"
              >
                전체보기
              </button>
            </div>

            {/* 비디오 리스트 */}
            <div ref={sidebarListRef} className="flex flex-col gap-3 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
              {KAORI_VIDEOS.map((item) => {
                const isSelected = selectedVideo.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectVideo(item)}
                    className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                      isSelected
                        ? 'bg-rose-500/10 border border-rose-500/40 text-white'
                        : 'hover:bg-zinc-800/60 border border-transparent'
                    }`}
                  >
                    {/* 썸네일 */}
                    <div className="relative w-36 sm:w-40 aspect-video rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center backdrop-blur-[1px]">
                          <Play className="w-6 h-6 text-white fill-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* 상세 정보 */}
                    <div className="flex flex-col justify-start min-w-0 flex-1 py-0.5">
                      <h3 className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${isSelected ? 'text-rose-400 font-bold' : 'text-zinc-200 group-hover:text-white'}`}>
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-zinc-400 mt-1">Kaori Xoxo</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">ID: #{item.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


