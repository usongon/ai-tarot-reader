import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { TarotCard } from '../components/ui/TarotCard';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { BufferedMarkdown } from '../components/ui/BufferedMarkdown';
import { MobileNavBar } from '../components/ui/MobileNavBar';
import { StepIndicator } from '../components/ui/StepIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import { ShareCard } from '../components/ui/ShareCard';
import { useRef, useState } from 'react';
import { api } from '../services/api';

export function DrawingPage({ spread, direction, cards, flippedCards, onCardClick, onReshuffle, onInterpret, onBack }) {
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [token, setToken] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [interpretationModalOpen, setInterpretationModalOpen] = useState(false);
  const [shareImage, setShareImage] = useState(null);
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
    setInterpretation('');

    const selectedCards = Array.from(flippedCards)
      .slice(0, maxCards)
      .map(index => cards[index]);

    api.interpretStream(
      token,
      direction?.name,
      spread?.chineseName,
      selectedCards,
      {
        onChunk: (text) => {
          setInterpretation(prev => prev + text);
        },
        onComplete: () => {
          setIsInterpreting(false);
          setInterpretationModalOpen(true);
        },
        onError: (error) => {
          setIsInterpreting(false);
          alert(error || '解读失败，请重试');
        }
      }
    );
  };

  const handleShare = async () => {
    setShareModalOpen(true);
    setShareImage(null);

    setTimeout(async () => {
      if (shareCardRef.current) {
        try {
          const canvas = await html2canvas(shareCardRef.current);
          const imageUrl = canvas.toDataURL('image/png');
          setShareImage(imageUrl);
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

  const getCardsForInterpretation = () => {
    return Array.from(flippedCards)
      .slice(0, maxCards)
      .map(index => cards[index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 桌面端头部 */}
      <div className="hidden md:block p-4 bg-black/20 backdrop-blur-sm">
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

      {/* 移动端导航栏 */}
      <MobileNavBar
        title="抽取塔罗牌"
        onBack={onBack}
        rightAction={
          <button onClick={onReshuffle} className="text-yellow-400 text-xs">重选</button>
        }
      />
      <StepIndicator current={3} total={3} />

      {/* 移动端选牌提示 */}
      <div className="md:hidden text-center px-4 py-2">
        <div className="text-sm text-purple-100">
          请选择 <span className="text-yellow-400 font-bold">{maxCards}</span> 张牌
        </div>
        <div className="text-xs text-gray-500">已选 {selectedCount}/{maxCards}</div>
      </div>

      {/* 桌面端提示 */}
      {hasSelectedEnough && (
        <div className="hidden md:block text-center text-purple-300 py-2">
          ✓ 已选择足够数量，可以进行解读
        </div>
      )}

      {/* 主要内容 */}
      <div className="flex-1 p-2 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {cards.length > 0 ? (
            <>
              {/* 移动端：4列网格 */}
              <div className="grid grid-cols-4 gap-1.5 px-1 md:hidden">
                {cards.map((card, index) => {
                  const isSelected = flippedCards.has(index);
                  const canSelect = !isSelected && flippedCards.size < maxCards;
                  const isDisabled = isSelected || !canSelect;

                  return (
                    <div key={index} className={`relative ${isDisabled && !isSelected ? 'opacity-30' : ''}`}>
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
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10">
                          {Array.from(flippedCards).indexOf(index) + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 桌面端：flex-wrap */}
              <div className="hidden md:flex flex-wrap justify-center gap-4">
                {cards.map((card, index) => {
                  const isSelected = flippedCards.has(index);
                  const canSelect = !isSelected && flippedCards.size < maxCards;
                  const isDisabled = isSelected || !canSelect;

                  return (
                    <div key={`desktop-${index}`} className={`${isDisabled && !isSelected ? 'opacity-30' : ''}`}>
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
            </>
          ) : (
            <div className="text-center text-white text-lg md:text-xl py-12">
              点击"重选"开始
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮区 */}
      {hasSelectedEnough && !interpretation && (
        <div className="sticky bottom-0 p-3 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:static md:p-4">
          <div className="md:hidden">
            <button
              onClick={handleInterpret}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg active:scale-[0.98] transition-transform"
            >
              🔮 AI大师解读
            </button>
          </div>
          <div className="hidden md:flex justify-center">
            <Button size="large" onClick={handleInterpret}>
              🔮 AI大师解读
            </Button>
          </div>
        </div>
      )}

      {interpretation && !interpretationModalOpen && (
        <div className="sticky bottom-0 p-3 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:static md:p-4">
          <div className="md:hidden">
            <button
              onClick={() => setInterpretationModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg active:scale-[0.98] transition-transform"
            >
              👁️ 查看解读结果
            </button>
          </div>
          <div className="hidden md:flex justify-center">
            <Button size="large" onClick={() => setInterpretationModalOpen(true)}>
              👁️ 查看解读结果
            </Button>
          </div>
        </div>
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
        size="xlarge"
      >
        <div className="space-y-4">
          {interpretation ? (
            <div className="prose prose-sm md:prose-lg max-w-none text-gray-800 max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-3 md:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <BufferedMarkdown content={interpretation} />
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">正在为您解读牌意，请稍候...</p>
            </div>
          )}
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
          <div className="prose prose-sm md:prose-lg max-w-none text-gray-800 max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-3 md:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
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
              <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto rounded-lg">
                <img
                  src={shareImage}
                  alt="分享卡片"
                  className="w-full h-auto rounded-lg"
                />
              </div>
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
