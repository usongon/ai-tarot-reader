import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BufferedMarkdown } from '../components/ui/BufferedMarkdown';
import { ChartDisplay } from '../components/bazi/ChartDisplay';
import { baziApi } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function BaziChartPage({ chart, token, onBack }) {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 头部 */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">八字命盘</div>
            <div className="text-sm text-purple-200">{chart.solarDate} · {chart.genderText}命</div>
          </div>
          <Button variant="secondary" onClick={onBack} size="small">← 返回</Button>
        </div>
      </div>

      {/* 命盘内容 */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <ChartDisplay chart={chart} />

          {/* 大运时间线 */}
          {chart.daYunList && chart.daYunList.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">大运走势</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {chart.daYunList.map((dy, i) => (
                  <div key={i} className={`flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[70px] ${dy.current ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'bg-white/5 text-purple-200'}`}>
                    <div className="font-bold text-sm">{dy.displayText}</div>
                    <div className="text-xs opacity-70">{dy.startAge}-{dy.endAge}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      {!interpretation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center z-30">
          <Button size="large" onClick={handleInterpret}>🔮 AI 命理解读</Button>
        </motion.div>
      )}
      {interpretation && !showInterpretation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center z-30">
          <Button size="large" onClick={() => setShowInterpretation(true)}>👁️ 查看解读结果</Button>
        </motion.div>
      )}

      {/* AI 解读中浮窗 */}
      <Modal isOpen={isInterpreting} onClose={() => {}} title="🔮 AI 命理解读中" size="xlarge">
        <div className="space-y-4">
          {interpretation ? (
            <div className="prose prose-lg max-w-none text-gray-800 max-h-[60vh] overflow-y-auto p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
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
          <div className="prose prose-lg max-w-none text-gray-800 max-h-[60vh] overflow-y-auto p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setShowInterpretation(false)}>关闭</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
