import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MobileNavBar } from '../components/ui/MobileNavBar';
import { BufferedMarkdown } from '../components/ui/BufferedMarkdown';
import { ChartDisplay } from '../components/bazi/ChartDisplay';
import { BaziShareCard } from '../components/bazi/BaziShareCard';
import { baziApi } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { normalizeMarkdown } from '../components/ui/BufferedMarkdown';
import html2canvas from 'html2canvas';

export function BaziChartPage({ chart, token, onBack }) {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const shareCardRef = useRef(null);

  const handleInterpret = () => {
    setIsInterpreting(true);
    setInterpretation('');
    setShowInterpretation(true);
    baziApi.interpretStream(token, chart, {
      onChunk: (text) => setInterpretation((prev) => prev + text),
      onComplete: () => setIsInterpreting(false),
      onError: (error) => { setIsInterpreting(false); alert(error || '解读失败，请重试'); },
    });
  };

  const handleShare = () => {
    setShareModalOpen(true);
    setShareImage(null);
    setTimeout(async () => {
      if (shareCardRef.current) {
        try {
          const canvas = await html2canvas(shareCardRef.current);
          setShareImage(canvas.toDataURL('image/png'));
        } catch {
          alert('生成图片失败，请重试');
          setShareModalOpen(false);
        }
      }
    }, 100);
  };

  const handleDownload = () => {
    if (shareImage) {
      const link = document.createElement('a');
      link.download = `八字命盘-${chart.solarDate}.png`;
      link.href = shareImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 桌面端头部 */}
      <div className="hidden md:block p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">八字命盘</div>
            <div className="text-sm text-purple-200">{chart.solarDate} · {chart.genderText}命</div>
          </div>
          <Button variant="secondary" onClick={onBack} size="small">← 返回</Button>
        </div>
      </div>

      {/* 移动端导航栏 */}
      <MobileNavBar title="八字命盘" onBack={onBack} />

      {/* 命盘内容 */}
      <div className="flex-1 p-3 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          <ChartDisplay chart={chart} />

          {/* 大运时间线 */}
          {chart.daYunList && chart.daYunList.length > 0 && (
            <div className="bg-white/[0.06] md:bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/[0.06] md:border-transparent">
              <h3 className="text-white font-bold mb-2 md:mb-3 text-xs md:text-base">大运走势</h3>
              <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2">
                {chart.daYunList.map((dy, i) => (
                  <div key={i} className={`flex-shrink-0 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-center min-w-[52px] md:min-w-[70px] ${
                    dy.current
                      ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 md:from-purple-600 md:to-indigo-600 text-white border border-purple-400/30 md:border-transparent shadow-lg'
                      : 'bg-white/[0.04] md:bg-white/5 text-purple-300 border border-white/[0.04] md:border-transparent'
                  }`}>
                    <div className="font-bold text-[11px] md:text-sm">{dy.displayText}</div>
                    <div className="text-[9px] md:text-xs opacity-60">{dy.startAge}-{dy.endAge}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      {!interpretation && (
        <div className="sticky bottom-0 p-3 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:static md:p-4">
          <div className="md:hidden">
            <button
              onClick={handleInterpret}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg active:scale-[0.98] transition-transform"
            >
              🔮 AI命理解读
            </button>
          </div>
          <div className="hidden md:flex justify-center">
            <Button size="large" onClick={handleInterpret}>🔮 AI 命理解读</Button>
          </div>
        </div>
      )}
      {interpretation && !showInterpretation && !shareModalOpen && (
        <div className="sticky bottom-0 p-3 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:static md:p-4">
          <div className="md:hidden flex gap-2">
            <button onClick={() => setShowInterpretation(true)}
              className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-medium active:scale-[0.98] transition-transform border border-white/10">
              👁️ 查看解读
            </button>
            <button onClick={handleShare}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium active:scale-[0.98] transition-transform">
              📸 分享命盘
            </button>
          </div>
          <div className="hidden md:flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setShowInterpretation(true)}>👁️ 查看解读</Button>
            <Button onClick={handleShare}>📸 分享命盘</Button>
          </div>
        </div>
      )}

      {/* AI 解读中浮窗 */}
      <Modal isOpen={isInterpreting} onClose={() => {}} title="🔮 AI 命理解读中" size="xlarge">
        <div className="space-y-4">
          {interpretation ? (
            <div className="prose prose-sm md:prose-lg max-w-none text-gray-800 max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-3 md:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <BufferedMarkdown content={interpretation} />
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">正在为您解读命盘，请稍候...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* AI 解读结果浮窗 */}
      <Modal isOpen={showInterpretation && !isInterpreting} onClose={() => setShowInterpretation(false)}
        title="🔮 AI 命理解读" size="xlarge">
        <div className="space-y-4">
          <div className="prose prose-sm md:prose-lg max-w-none text-gray-800 max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-3 md:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{normalizeMarkdown(interpretation)}</ReactMarkdown>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleShare}>📸 分享命盘</Button>
            <Button variant="secondary" onClick={() => setShowInterpretation(false)}>关闭</Button>
          </div>
        </div>
      </Modal>

      {/* 分享预览浮窗 */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="📸 分享命盘" size="xlarge">
        <div className="space-y-4">
          {shareImage ? (
            <>
              <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto rounded-lg">
                <img src={shareImage} alt="分享命盘" className="w-full h-auto rounded-lg" />
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleDownload}>💾 下载图片</Button>
                <Button variant="secondary" onClick={() => setShareModalOpen(false)}>关闭</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">正在生成分享图片...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* 隐藏的分享卡片 */}
      {shareModalOpen && (
        <div className="fixed -left-[9999px] top-0">
          <BaziShareCard
            ref={shareCardRef}
            chart={chart}
            interpretation={interpretation}
          />
        </div>
      )}
    </div>
  );
}
