import React from 'react';
import { motion } from 'framer-motion';
import { useTarot } from '../../contexts/TarotContext';
import { ArrowLeftIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const HistoryPage = ({ onBack }) => {
  const { state } = useTarot();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 mx-auto flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>返回首页</span>
        </Button>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
          历史记录
        </h1>
        <p className="text-gray-300">
          查看您的占卜历史和解读记录
        </p>
      </div>

      {state.history.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DocumentTextIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">暂无历史记录</h3>
          <p className="text-gray-500">开始您的第一次占卜之旅吧</p>
        </motion.div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {state.history.map((record, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{record.spread}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-purple-400">{record.topic}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{record.date}</p>
                  <div className="flex flex-wrap gap-2">
                    {record.cards.slice(0, 3).map((card, cardIndex) => (
                      <span 
                        key={cardIndex}
                        className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        {card}
                      </span>
                    ))}
                    {record.cards.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{record.cards.length - 3} 更多
                      </span>
                    )}
                  </div>
                </div>
                <ClockIcon className="h-5 w-5 text-gray-500" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;