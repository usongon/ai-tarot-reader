import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { MobileNavBar } from '../components/ui/MobileNavBar';
import { ShiChenSelector } from '../components/bazi/ShiChenSelector';
import { LunarDatePicker } from '../components/bazi/LunarDatePicker';
import { SolarDatePicker } from '../components/bazi/SolarDatePicker';
import { baziApi } from '../services/api';

export function BaziInfoPage({ onSubmit, onBack }) {
  const [isLunar, setIsLunar] = useState(false);
  const [birthDate, setBirthDate] = useState('1990-06-15');
  const [gender, setGender] = useState('male');
  const [shiChen, setShiChen] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!birthDate) { setError('请选择出生日期'); return; }
    if (!shiChen) { setError('请选择出生时辰'); return; }
    if (!token.trim()) { setError('请输入访问口令'); return; }
    setLoading(true);
    setError('');
    try {
      const chart = await baziApi.calculateChart(birthDate, isLunar, gender, shiChen);
      onSubmit({ chart, token, request: { birthDate, isLunar, gender, shiChen } });
    } catch (err) {
      setError('排盘失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 移动端导航栏 */}
      <MobileNavBar title="八字命盘" onBack={onBack} />

      {/* 移动端内容 */}
      <div className="flex-1 p-3 md:hidden overflow-auto">
        <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-4 space-y-5 border border-white/[0.08]">
          {/* 日期类型切换 - 分段控件 */}
          <div>
            <label className="block text-purple-200 text-xs mb-2">📅 日期类型</label>
            <div className="bg-white/[0.05] rounded-xl p-0.5 flex">
              <button onClick={() => setIsLunar(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLunar ? 'bg-purple-600/30 text-purple-100' : 'text-gray-500'}`}>
                公历
              </button>
              <button onClick={() => setIsLunar(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLunar ? 'bg-purple-600/30 text-purple-100' : 'text-gray-500'}`}>
                农历
              </button>
            </div>
          </div>

          {/* 出生日期 */}
          <div>
            <label className="block text-purple-200 text-xs mb-2">📆 出生日期</label>
            {isLunar ? (
              <LunarDatePicker value={birthDate} onChange={setBirthDate} />
            ) : (
              <SolarDatePicker value={birthDate} onChange={setBirthDate} />
            )}
          </div>

          {/* 出生时辰 */}
          <div>
            <label className="block text-purple-200 text-xs mb-2">⏰ 出生时辰</label>
            <ShiChenSelector value={shiChen} onChange={setShiChen} />
          </div>

          {/* 性别 */}
          <div>
            <label className="block text-purple-200 text-xs mb-2">👤 性别</label>
            <div className="flex gap-2">
              <button onClick={() => setGender('male')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === 'male' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' : 'bg-white/[0.06] text-gray-400 border border-white/10'}`}>
                男
              </button>
              <button onClick={() => setGender('female')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === 'female' ? 'bg-pink-400/10 text-pink-400 border border-pink-400/30' : 'bg-white/[0.06] text-gray-400 border border-white/10'}`}>
                女
              </button>
            </div>
          </div>

          {/* 访问口令 */}
          <div>
            <label className="block text-purple-200 text-xs mb-2">🔑 访问口令</label>
            <input type="password" value={token} onChange={(e) => setToken(e.target.value)}
              placeholder="输入访问口令"
              className="w-full bg-white/[0.06] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>

          {error && <div className="text-red-400 text-center text-xs">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? '排盘中...' : '🔮 生成命盘'}
          </button>
        </div>
        <p className="mt-4 text-gray-600 text-[10px] text-center">* 命理解读仅供娱乐参考，不构成任何人生决策建议</p>
      </div>

      {/* 桌面端内容 - 保持原样 */}
      <div className="hidden md:flex flex-1 items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">八字命理排盘</h1>
            <p className="text-purple-200">输入您的出生信息，获取专业命理分析</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">📅 日期类型</label>
              <div className="flex gap-3">
                <button onClick={() => setIsLunar(false)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isLunar ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}>
                  公历
                </button>
                <button onClick={() => setIsLunar(true)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${isLunar ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}>
                  农历
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">📆 出生日期</label>
              {isLunar ? (
                <LunarDatePicker value={birthDate} onChange={setBirthDate} />
              ) : (
                <SolarDatePicker value={birthDate} onChange={setBirthDate} />
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">⏰ 出生时辰</label>
              <ShiChenSelector value={shiChen} onChange={setShiChen} />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">👤 性别</label>
              <div className="flex gap-3">
                <button onClick={() => setGender('male')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}>
                  男
                </button>
                <button onClick={() => setGender('female')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}>
                  女
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">🔑 访问口令</label>
              <input type="password" value={token} onChange={(e) => setToken(e.target.value)}
                placeholder="输入访问口令"
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-purple-300 focus:ring-2 focus:ring-purple-500" />
            </div>

            {error && <div className="text-red-300 text-center text-sm">{error}</div>}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onBack} className="flex-1">← 返回</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? '排盘中...' : '🔮 开始排盘'}
              </Button>
            </div>
          </div>
          <p className="mt-6 text-purple-300 text-sm text-center">* 命理解读仅供娱乐参考，不构成任何人生决策建议</p>
        </motion.div>
      </div>
    </div>
  );
}
