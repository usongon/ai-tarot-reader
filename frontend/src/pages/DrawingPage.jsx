import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { TarotCard } from '../components/ui/TarotCard';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import { ShareCard } from '../components/ui/ShareCard';
import { useRef, useState } from 'react';

export function DrawingPage({ spread, direction, cards, flippedCards, onCardClick, onReshuffle, onInterpret, onBack }) {
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [token, setToken] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [interpretationModalOpen, setInterpretationModalOpen] = useState(false);
  const [shareImage, setShareImage] = useState(null); // 存储生成的分享图片
  const shareCardRef = useRef(null);

  const maxCards = spread?.cardCount || 1;
  const selectedCount = Math.min(flippedCards.size, maxCards);
  const hasSelectedEnough = selectedCount >= maxCards;

  const handleInterpret = async () => {
    setTokenModalOpen(true);
  };

  const handleTokenSubmit = async () => {
    if (!token.trim()) return;

    setTokenModalOpen(false);
    setIsInterpreting(true);

    try {
      // 只发送已选中的牌，数量限制为牌阵需要的数量
      const selectedCards = Array.from(flippedCards)
        .slice(0, maxCards)
        .map(index => cards[index]);
      const result = await onInterpret(token, selectedCards);
      setInterpretation(result);
      setInterpretationModalOpen(true); // 显示解读结果浮窗
    } catch (error) {
      alert(error.message || '解读失败，请重试');
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleShare = async () => {
    setShareModalOpen(true);
    setShareImage(null); // 重置图片

    setTimeout(async () => {
      if (shareCardRef.current) {
        try {
          const canvas = await html2canvas(shareCardRef.current);
          const imageUrl = canvas.toDataURL('image/png');
          setShareImage(imageUrl); // 存储图片用于预览
        } catch (error) {
          alert('生成图片失败，请重试');
          setShareModalOpen(false);
        }
      }
    }, 100);
  };

  const handleDownloadShare = () => {
    if (shareImage) {
      const link = document.createElement('a');
      link.download = `塔罗占卜-${direction?.name || '结果'}.png`;
      link.href = shareImage;
      link.click();
    }
  };

  // 获取用于解读的卡片（只取已翻开的牌，限制数量）
  const getCardsForInterpretation = () => {
    return Array.from(flippedCards)
      .slice(0, maxCards)
      .map(index => cards[index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 头部 */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <div className="text-sm text-purple-200">
              {spread?.chineseName} · {direction?.name}
            </div>
            <div className="text-lg font-bold">
              已选 {selectedCount} / {maxCards} 张
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onBack} size="small">
              ← 返回
            </Button>
            <Button variant="outline" onClick={onReshuffle} size="small">
              重新洗牌
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* 卡片区域 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-4">点击卡片选择（最多选择{maxCards}张）</h2>
            {hasSelectedEnough && (
              <p className="text-center text-purple-300 mb-6">✓ 已选择足够数量，可以进行解读</p>
            )}
            {cards.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {cards.map((card, index) => {
                  const isSelected = flippedCards.has(index);
                  const canSelect = !isSelected && flippedCards.size < maxCards;
                  const isDisabled = isSelected || !canSelect;

                  return (
                    <div key={index} className={`${isDisabled && !isSelected ? 'opacity-30' : ''}`}>
                      <TarotCard
                        card={card}
                        isFlipped={isSelected}
                        onClick={() => {
                          if (canSelect) {
                            onCardClick(index);
                          }
                        }}
                        index={index}
                      />
                      {isSelected && (
                        <div className="text-center text-purple-300 text-sm mt-1">
                          第{Array.from(flippedCards).indexOf(index) + 1}张
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-white text-xl py-12">
                点击"重新洗牌"开始
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部悬浮AI解读按钮 */}
      {hasSelectedEnough && !interpretation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center z-30"
        >
          <div className="bg-transparent">
            <Button size="large" onClick={handleInterpret}>
              🔮 AI大师解读
            </Button>
          </div>
        </motion.div>
      )}

      {/* 已有解读结果时显示查看按钮 */}
      {interpretation && !interpretationModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center z-30"
        >
          <div className="bg-transparent">
            <Button size="large" onClick={() => setInterpretationModalOpen(true)}>
              👁️ 查看解读结果
            </Button>
          </div>
        </motion.div>
      )}

      {/* 密钥输入弹窗 */}
      <Modal
        isOpen={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        title="输入密钥"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              请输入访问密钥
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="输入密钥"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleTokenSubmit} className="flex-1">
              确认
            </Button>
            <Button variant="secondary" onClick={() => setTokenModalOpen(false)} className="flex-1">
              取消
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI解读中浮窗 */}
      <Modal
        isOpen={isInterpreting}
        onClose={() => {}}
        title="🔮 AI解读中"
      >
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">正在为您解读牌意，请稍候...</p>
        </div>
      </Modal>

      {/* AI解读结果浮窗 */}
      <Modal
        isOpen={interpretationModalOpen}
        onClose={() => setInterpretationModalOpen(false)}
        title="🔮 AI大师解读"
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="prose prose-lg max-w-none text-gray-800 max-h-[60vh] overflow-y-auto p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => handleShare()}>📸 生成分享卡片</Button>
            <Button variant="secondary" onClick={() => setInterpretationModalOpen(false)}>关闭</Button>
          </div>
        </div>
      </Modal>

      {/* 分享预览弹窗 */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="📸 分享卡片预览"
        size="xlarge"
      >
        <div className="space-y-4">
          {shareImage ? (
            <>
              {/* 图片预览区域 */}
              <div className="max-h-[60vh] overflow-y-auto rounded-lg">
                <img
                  src={shareImage}
                  alt="分享卡片"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              {/* 操作按钮 */}
              <div className="flex gap-3 justify-center">
                <Button onClick={handleDownloadShare}>
                  💾 下载图片
                </Button>
                <Button variant="secondary" onClick={() => setShareModalOpen(false)}>
                  关闭
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">正在生成分享卡片...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* 隐藏的分享卡片 */}
      {shareModalOpen && (
        <div className="fixed -left-[9999px] top-0">
          <ShareCard
            ref={shareCardRef}
            spread={spread}
            direction={direction?.name}
            cards={getCardsForInterpretation()}
            interpretation={interpretation}
          />
        </div>
      )}
    </div>
  );
}
