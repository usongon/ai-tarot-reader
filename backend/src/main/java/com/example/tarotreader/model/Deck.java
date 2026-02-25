package com.example.tarotreader.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 代表一副78张的塔罗牌。
 * 这个类初始化完整的牌堆，包括大阿卡纳和小阿卡纳，
 * 并提供洗牌和抽牌的方法。
 * @author dehua
 */
public class Deck {

    private final List<TarotCard> cards = new ArrayList<>();

    /**
     * 构造一副新牌，并用所有78张标准的塔罗牌填充它。
     */
    public Deck() {
        // Major Arcana
        cards.add(new TarotCard("The Fool", "愚人", "Beginnings, innocence, spontaneity, a free spirit", "开始、纯真、顺其自然、自由的精神", "Naivety, foolishness, recklessness, risk-taking", "天真、愚蠢、鲁莽、冒险", "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg"));
        cards.add(new TarotCard("The Magician", "魔术师", "Manifestation, resourcefulness, power, inspired action", "显现、足智多谋、力量、受启发的行动", "Manipulation, poor planning, untapped talents", "操控、计划不周、未开发的才能", "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg"));
        cards.add(new TarotCard("The High Priestess", "女祭司", "Intuition, sacred knowledge, divine feminine, the subconscious mind", "直觉、神圣知识、神圣女性、潜意识", "Secrets, disconnected from intuition, withdrawal and silence", "秘密、与直觉脱节、退缩和沉默", "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg"));
        cards.add(new TarotCard("The Empress", "女皇", "Femininity, beauty, nature, nurturing, abundance", "女性气质、美丽、自然、养育、富足", "Creative block, dependence on others", "创意受阻、依赖他人", "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg"));
        cards.add(new TarotCard("The Emperor", "皇帝", "Authority, establishment, structure, a father figure", "权威、建立、结构、父亲形象", "Domination, excessive control, lack of discipline, inflexibility", "统治、过度控制、缺乏纪律、僵化", "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg"));
        cards.add(new TarotCard("The Hierophant", "教皇", "Spiritual wisdom, religious beliefs, conformity, tradition, institutions", "精神智慧、宗教信仰、整合、传统、制度", "Personal beliefs, freedom, challenging the status quo", "个人信仰、自由、挑战现状", "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg"));
        cards.add(new TarotCard("The Lovers", "恋人", "Love, harmony, relationships, values alignment, choices", "爱、和谐、关系、价值观一致、选择", "Self-love, disharmony, imbalance, misalignment of values", "自爱、不和谐、失衡、价值观错位", "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg"));
        cards.add(new TarotCard("The Chariot", "战车", "Control, willpower, victory, assertion, determination", "控制、意志力、胜利、主张、决心", "Self-discipline, opposition, lack of direction", "自律、对立、缺乏方向", "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg"));
        cards.add(new TarotCard("Strength", "力量", "Strength, courage, persuasion, influence, compassion", "力量、勇气、说服、影响、同情", "Inner strength, self-doubt, low energy, raw emotion", "内在力量、自我怀疑、精力不足、原始情感", "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg"));
        cards.add(new TarotCard("The Hermit", "隐士", "Soul-searching, introspection, being alone, inner guidance", "灵魂探索、反省、独处、内在指引", "Isolation, loneliness, withdrawal", "孤立、孤独、退缩", "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg"));
        cards.add(new TarotCard("Wheel of Fortune", "命运之轮", "Good luck, karma, life cycles, destiny, a turning point", "好运、业力、生命周期、命运、转折点", "Bad luck, resistance to change, breaking cycles", "坏运气、抗拒改变、打破循环", "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg"));
        cards.add(new TarotCard("Justice", "正义", "Justice, fairness, truth, cause and effect, law", "正义、公平、真理、因果、法律", "Unfairness, lack of accountability, dishonesty", "不公、缺乏责任、不诚实", "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg"));
        cards.add(new TarotCard("The Hanged Man", "倒吊人", "Pause, surrender, letting go, new perspectives", "暂停、投降、放手、新视角", "Delays, resistance, stalling, indecision", "延迟、抵抗、停滞、优柔寡断", "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg"));
        cards.add(new TarotCard("Death", "死神", "Endings, change, transformation, transition", "结束、改变、转变、过渡", "Resistance to change, personal transformation, inner purging", "抗拒改变、个人转变、内在清洗", "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg"));
        cards.add(new TarotCard("Temperance", "节制", "Balance, moderation, patience, purpose", "平衡、适度、耐心、目的", "Imbalance, excess, self-healing, re-alignment", "失衡、过度、自我疗愈、重新调整", "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg"));
        cards.add(new TarotCard("The Devil", "恶魔", "Shadow self, attachment, addiction, restriction, sexuality", "阴暗面、依恋、成瘾、限制、性", "Releasing limiting beliefs, exploring dark thoughts, detachment", "释放限制性信念、探索黑暗思想、超脱", "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg"));
        cards.add(new TarotCard("The Tower", "塔", "Sudden change, upheaval, chaos, revelation, awakening", "突然的变化、剧变、混乱、启示、觉醒", "Personal transformation, fear of change, averting disaster", "个人转变、害怕改变、避免灾难", "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg"));
        cards.add(new TarotCard("The Star", "星星", "Hope, faith, purpose, renewal, spirituality", "希望、信念、目的、更新、灵性", "Lack of faith, despair, self-trust, disconnection", "缺乏信念、绝望、自我信任、脱节", "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg"));
        cards.add(new TarotCard("The Moon", "月亮", "Illusion, fear, anxiety, subconscious, intuition", "幻觉、恐惧、焦虑、潜意识、直觉", "Release of fear, repressed emotion, inner confusion", "释放恐惧、压抑的情感、内心混乱", "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg"));
        cards.add(new TarotCard("The Sun", "太阳", "Positivity, fun, warmth, success, vitality", "积极、乐趣、温暖、成功、活力", "Inner child, feeling down, overly optimistic", "内在小孩、情绪低落、过于乐观", "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg"));
        cards.add(new TarotCard("Judgement", "审判", "Judgement, rebirth, inner calling, absolution", "审判、重生、内在召唤、赦免", "Self-doubt, inner critic, ignoring the call", "自我怀疑、内心批判、忽视召唤", "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg"));
        cards.add(new TarotCard("The World", "世界", "Completion, integration, accomplishment, travel", "完成、整合、成就、旅行", "Seeking personal closure, short-cuts, delays", "寻求个人了结、走捷径、延迟", "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg"));

        // Minor Arcana - Wands
        cards.add(new TarotCard("Ace of Wands", "权杖首牌", "Inspiration, new opportunities, growth, potential", "灵感、新机会、成长、潜力", "An emerging idea, lack of direction, distractions, delays", "新出现的想法、缺乏方向、分心、延迟", "https://www.sacred-texts.com/tarot/pkt/img/waac.jpg"));
        cards.add(new TarotCard("Two of Wands", "权杖二", "Future planning, progress, decisions, discovery", "未来规划、进步、决策、发现", "Fear of unknown, lack of planning", "对未知的恐惧、缺乏计划", "https://www.sacred-texts.com/tarot/pkt/img/wa02.jpg"));
        cards.add(new TarotCard("Three of Wands", "权杖三", "Progress, expansion, foresight, overseas opportunities", "进步、扩张、远见、海外机会", "Playing small, lack of foresight, unexpected delays", "格局小、缺乏远见、意外延迟", "https://www.sacred-texts.com/tarot/pkt/img/wa03.jpg"));
        cards.add(new TarotCard("Four of Wands", "权杖四", "Celebration, joy, harmony, relaxation, homecoming", "庆祝、喜悦、和谐、放松、回家", "Personal celebration, inner harmony, conflict with others", "个人庆祝、内心和谐、与他人冲突", "https://www.sacred-texts.com/tarot/pkt/img/wa04.jpg"));
        cards.add(new TarotCard("Five of Wands", "权杖五", "Conflict, disagreements, competition, tension, diversity", "冲突、分歧、竞争、紧张、多样性", "Inner conflict, conflict avoidance, tension release", "内心冲突、避免冲突、紧张释放", "https://www.sacred-texts.com/tarot/pkt/img/wa05.jpg"));
        cards.add(new TarotCard("Six of Wands", "权杖六", "Public recognition, victory, progress, self-confidence", "公众认可、胜利、进步、自信", "Private achievement, personal definition of success, fall from grace, egotism", "个人成就、个人对成功的定义、失宠、自负", "https://www.sacred-texts.com/tarot/pkt/img/wa06.jpg"));
        cards.add(new TarotCard("Seven of Wands", "权杖七", "Challenge, competition, perseverance", "挑战、竞争、毅力", "Giving up, overwhelmed, overly protective", "放弃、不知所措、过度保护", "https://www.sacred-texts.com/tarot/pkt/img/wa07.jpg"));
        cards.add(new TarotCard("Eight of Wands", "权杖八", "Movement, fast paced change, action, alignment", "运动、快节奏的变化、行动、结盟", "Delays, frustration, resisting change", "延迟、沮丧、抗拒改变", "https://www.sacred-texts.com/tarot/pkt/img/wa08.jpg"));
        cards.add(new TarotCard("Nine of Wands", "权杖九", "Resilience, courage, persistence, test of faith, boundaries", "韧性、勇气、坚持、信念的考验、界限", "Inner resources, struggle, overwhelm, defensive, paranoia", "内部资源、挣扎、不知所措、防御、偏执", "https://www.sacred-texts.com/tarot/pkt/img/wa09.jpg"));
        cards.add(new TarotCard("Ten of Wands", "权杖十", "Burden, extra responsibility, hard work, completion", "负担、额外责任、辛勤工作、完成", "Doing it all, carrying the burden, delegation, release", "独自承担、背负重担、授权、释放", "https://www.sacred-texts.com/tarot/pkt/img/wa10.jpg"));
        cards.add(new TarotCard("Page of Wands", "权杖侍从", "Enthusiasm, exploration, discovery, free spirit", "热情、探索、发现、自由精神", "Newly-formed ideas, redirecting energy, self-limiting beliefs, a spiritual path", "新形成的想法、重新引导能量、自我限制的信念、精神道路", "https://www.sacred-texts.com/tarot/pkt/img/wapa.jpg"));
        cards.add(new TarotCard("Knight of Wands", "权杖骑士", "Energy, passion, inspired action, adventure, impulsiveness", "能量、激情、受启发的行动、冒险、冲动", "Passion project, haste, scattered energy, delays, frustration", "充满激情的项目、仓促、精力分散、延迟、沮丧", "https://www.sacred-texts.com/tarot/pkt/img/wakn.jpg"));
        cards.add(new TarotCard("Queen of Wands", "权杖女王", "Courage, confidence, independence, social butterfly, determination", "勇气、自信、独立、交际花、决心", "Self-respect, self-confidence, introverted, a blocked creative spark", "自重、自信、内向、创造性火花受阻", "https://www.sacred-texts.com/tarot/pkt/img/waqu.jpg"));
        cards.add(new TarotCard("King of Wands", "权杖国王", "Natural-born leader, vision, entrepreneur, honour", "天生的领导者、远见、企业家、荣誉", "Impulsiveness, haste, ruthless, high expectations", "冲动、仓促、无情、高期望", "https://www.sacred-texts.com/tarot/pkt/img/waki.jpg"));

        // Minor Arcana - Cups
        cards.add(new TarotCard("Ace of Cups", "圣杯首牌", "Love, new relationships, compassion, creativity", "爱、新关系、同情、创造力", "Self-love, intuition, repressed emotions", "自爱、直觉、压抑的情感", "https://www.sacred-texts.com/tarot/pkt/img/cuac.jpg"));
        cards.add(new TarotCard("Two of Cups", "圣杯二", "Unified love, partnership, mutual attraction", "统一的爱、伙伴关系、相互吸引", "Self-love, break-ups, disharmony, distrust", "自爱、分手、不和谐、不信任", "https://www.sacred-texts.com/tarot/pkt/img/cu02.jpg"));
        cards.add(new TarotCard("Three of Cups", "圣杯三", "Celebration, friendship, creativity, collaborations", "庆祝、友谊、创造力、合作", "Independence, alone time, hardcore partying, ‘three’s a crowd’", "独立、独处时间、疯狂聚会、‘三人行必有我师’", "https://www.sacred-texts.com/tarot/pkt/img/cu03.jpg"));
        cards.add(new TarotCard("Four of Cups", "圣杯四", "Meditation, contemplation, apathy, reevaluation", "冥想、沉思、冷漠、重新评估", "Retreat, withdrawal, checking in for alignment", "撤退、退缩、检查是否一致", "https://www.sacred-texts.com/tarot/pkt/img/cu04.jpg"));
        cards.add(new TarotCard("Five of Cups", "圣杯五", "Regret, failure, disappointment, pessimism", "后悔、失败、失望、悲观", "Personal setbacks, self-forgiveness, moving on", "个人挫折、自我宽恕、继续前进", "https://www.sacred-texts.com/tarot/pkt/img/cu05.jpg"));
        cards.add(new TarotCard("Six of Cups", "圣杯六", "Revisiting the past, childhood memories, innocence, joy", "重温过去、童年记忆、纯真、喜悦", "Living in the past, forgiveness, lacking playfulness", "活在过去、宽恕、缺乏童心", "https://www.sacred-texts.com/tarot/pkt/img/cu06.jpg"));
        cards.add(new TarotCard("Seven of Cups", "圣杯七", "Opportunities, choices, wishful thinking, illusion", "机会、选择、一厢情愿、幻觉", "Alignment, personal values, overwhelmed by choices", "结盟、个人价值观、被选择淹没", "https://www.sacred-texts.com/tarot/pkt/img/cu07.jpg"));
        cards.add(new TarotCard("Eight of Cups", "圣杯八", "Disappointment, abandonment, withdrawal, escapism", "失望、抛弃、退缩、逃避现实", "Trying one more time, indecision, aimless drifting, walking away", "再试一次、优柔寡断、漫无目的地漂泊、走开", "https://www.sacred-texts.com/tarot/pkt/img/cu08.jpg"));
        cards.add(new TarotCard("Nine of Cups", "圣杯九", "Contentment, satisfaction, gratitude, wish come true", "满足、满意、感激、愿望成真", "Inner happiness, materialism, dissatisfaction, indulgence", "内心的幸福、唯物主义、不满、放纵", "https://www.sacred-texts.com/tarot/pkt/img/cu09.jpg"));
        cards.add(new TarotCard("Ten of Cups", "圣杯十", "Divine love, blissful relationships, harmony, alignment", "神圣的爱、幸福的关系、和谐、结盟", "Disconnection, misaligned values, struggling relationships", "脱节、价值观错位、挣扎的关系", "https://www.sacred-texts.com/tarot/pkt/img/cu10.jpg"));
        cards.add(new TarotCard("Page of Cups", "圣杯侍从", "Creative opportunities, intuitive messages, curiosity, possibility", "创意机会、直觉信息、好奇心、可能性", "New ideas, doubting intuition, creative blocks, emotional immaturity", "新想法、怀疑直觉、创意受阻、情感不成熟", "https://www.sacred-texts.com/tarot/pkt/img/cupa.jpg"));
        cards.add(new TarotCard("Knight of Cups", "圣杯骑士", "Creativity, romance, charm, imagination, beauty", "创造力、浪漫、魅力、想象力、美丽", "Overactive imagination, unrealistic, jealous, moody", "想象力过于活跃、不切实际、嫉妒、喜怒无常", "https://www.sacred-texts.com/tarot/pkt/img/cukn.jpg"));
        cards.add(new TarotCard("Queen of Cups", "圣杯女王", "Compassionate, caring, emotionally stable, intuitive, in flow", "富有同情心、有爱心、情绪稳定、直觉、顺其自然", "Inner feelings, self-care, self-love, co-dependency", "内心的感受、自我照顾、自爱、相互依赖", "https://www.sacred-texts.com/tarot/pkt/img/cuqu.jpg"));
        cards.add(new TarotCard("King of Cups", "圣杯国王", "Emotionally balanced, compassionate, diplomatic", "情绪平衡、富有同情心、外交手腕", "Self-compassion, inner feelings, moodiness, emotionally manipulative", "自我同情、内心感受、喜怒无常、情感操控", "https://www.sacred-texts.com/tarot/pkt/img/cuki.jpg"));

        // Minor Arcana - Swords
        cards.add(new TarotCard("Ace of Swords", "宝剑首牌", "Breakthroughs, new ideas, mental clarity, success", "突破、新想法、思路清晰、成功", "Inner clarity, re-thinking an idea, clouded judgement", "内心清晰、重新思考一个想法、判断力模糊", "https://www.sacred-texts.com/tarot/pkt/img/swac.jpg"));
        cards.add(new TarotCard("Two of Swords", "宝剑二", "Difficult decisions, weighing up options, an impasse, avoidance", "艰难的决定、权衡选择、僵局、回避", "Indecision, confusion, information overload, stalemate", "优柔寡断、困惑、信息过载、僵局", "https://www.sacred-texts.com/tarot/pkt/img/sw02.jpg"));
        cards.add(new TarotCard("Three of Swords", "宝剑三", "Heartbreak, emotional pain, sorrow, grief, hurt", "心碎、情感痛苦、悲伤、悲痛、伤害", "Negative self-talk, releasing pain, optimism, forgiveness", "消极的自我对话、释放痛苦、乐观、宽恕", "https://www.sacred-texts.com/tarot/pkt/img/sw03.jpg"));
        cards.add(new TarotCard("Four of Swords", "宝剑四", "Rest, relaxation, meditation, contemplation, recuperation", "休息、放松、冥想、沉思、休养", "Exhaustion, burn-out, deep contemplation, stagnation", "精疲力竭、倦怠、深度沉思、停滞", "https://www.sacred-texts.com/tarot/pkt/img/sw04.jpg"));
        cards.add(new TarotCard("Five of Swords", "宝剑五", "Conflict, disagreements, competition, defeat, winning at all costs", "冲突、分歧、竞争、失败、不惜一切代价取胜", "Reconciliation, making amends, past resentment", "和解、弥补、过去的怨恨", "https://www.sacred-texts.com/tarot/pkt/img/sw05.jpg"));
        cards.add(new TarotCard("Six of Swords", "宝剑六", "Transition, change, rite of passage, releasing baggage", "过渡、改变、成年礼、释放包袱", "Personal transition, resistance to change, unfinished business", "个人转变、抗拒改变、未完成的事情", "https://www.sacred-texts.com/tarot/pkt/img/sw06.jpg"));
        cards.add(new TarotCard("Seven of Swords", "宝剑七", "Betrayal, deception, getting away with something, acting strategically", "背叛、欺骗、侥幸成功、战略性行动", "Imposter syndrome, self-deceit, keeping secrets", "冒名顶替综合症、自欺欺人、保守秘密", "https://www.sacred-texts.com/tarot/pkt/img/sw07.jpg"));
        cards.add(new TarotCard("Eight of Swords", "宝剑八", "Negative thoughts, self-imposed restriction, imprisonment, victim mentality", "消极思想、自我限制、监禁、受害者心态", "Self-limiting beliefs, inner critic, releasing negative thoughts, open to new perspectives", "自我限制的信念、内心的批判、释放消极思想、接受新视角", "https://www.sacred-texts.com/tarot/pkt/img/sw08.jpg"));
        cards.add(new TarotCard("Nine of Swords", "宝剑九", "Anxiety, worry, fear, depression, nightmares", "焦虑、担忧、恐惧、抑郁、噩梦", "Inner turmoil, deep-seated fears, secrets, releasing worry", "内心动荡、根深蒂固的恐惧、秘密、释放忧虑", "https://www.sacred-texts.com/tarot/pkt/img/sw09.jpg"));
        cards.add(new TarotCard("Ten of Swords", "宝剑十", "Painful endings, deep wounds, betrayal, loss, crisis", "痛苦的结局、深深的创伤、背叛、失落、危机", "Recovery, regeneration, resisting an inevitable end", "恢复、再生、抗拒不可避免的结局", "https://www.sacred-texts.com/tarot/pkt/img/sw10.jpg"));
        cards.add(new TarotCard("Page of Swords", "宝剑侍从", "New ideas, curiosity, thirst for knowledge, new ways of communicating", "新想法、好奇心、求知欲、新的沟通方式", "Self-expression, all talk and no action, haphazard action, haste", "自我表达、光说不做、随意的行动、仓促", "https://www.sacred-texts.com/tarot/pkt/img/swpa.jpg"));
        cards.add(new TarotCard("Knight of Swords", "宝剑骑士", "Ambitious, action-oriented, driven to succeed, fast-thinking", "雄心勃勃、以行动为导向、渴望成功、思维敏捷", "Restless, unfocused, impulsive, burn-out", "焦躁不安、注意力不集中、冲动、倦怠", "https://www.sacred-texts.com/tarot/pkt/img/swkn.jpg"));
        cards.add(new TarotCard("Queen of Swords", "宝剑女王", "Independent, unbiased judgement, clear boundaries, direct communication", "独立、公正的判断、明确的界限、直接的沟通", "Overly-emotional, easily influenced, bitchy, cold-hearted", "情绪过于激动、容易受影响、刻薄、冷酷", "https://www.sacred-texts.com/tarot/pkt/img/swqu.jpg"));
        cards.add(new TarotCard("King of Swords", "宝剑国王", "Mental clarity, intellectual power, authority, truth", "思路清晰、智力、权威、真理", "Quiet power, inner truth, misuse of power, manipulation", "安静的力量、内心的真理、滥用权力、操控", "https://www.sacred-texts.com/tarot/pkt/img/swki.jpg"));

        // Minor Arcana - Pentacles
        cards.add(new TarotCard("Ace of Pentacles", "星币首牌", "A new opportunity, manifestation, prosperity", "新机会、显现、繁荣", "Lack of planning, poor financial control", "缺乏计划、财务控制不善", "https://www.sacred-texts.com/tarot/pkt/img/peac.jpg"));
        cards.add(new TarotCard("Two of Pentacles", "星币二", "Multiple priorities, time management, prioritisation, adaptability", "多重优先事项、时间管理、优先排序、适应性", "Over-committed, disorganisation, re-prioritisation", "过度承诺、杂乱无章、重新确定优先次序", "https://www.sacred-texts.com/tarot/pkt/img/pe02.jpg"));
        cards.add(new TarotCard("Three of Pentacles", "星币三", "Teamwork, collaboration, learning, implementation", "团队合作、协作、学习、实施", "Disharmony, misalignment, working alone", "不和谐、错位、独自工作", "https://www.sacred-texts.com/tarot/pkt/img/pe03.jpg"));
        cards.add(new TarotCard("Four of Pentacles", "星币四", "Saving money, security, conservatism, scarcity, control", "存钱、安全、保守、稀缺、控制", "Over-spending, greed, self-protection", "过度消费、贪婪、自我保护", "https://www.sacred-texts.com/tarot/pkt/img/pe04.jpg"));
        cards.add(new TarotCard("Five of Pentacles", "星币五", "Financial loss, poverty, lack mindset, isolation, worry", "经济损失、贫困、缺乏心态、孤立、担忧", "Recovery from financial loss, spiritual poverty", "从经济损失中恢复、精神贫困", "https://www.sacred-texts.com/tarot/pkt/img/pe05.jpg"));
        cards.add(new TarotCard("Six of Pentacles", "星币六", "Giving, receiving, sharing wealth, generosity, charity", "给予、接受、分享财富、慷慨、慈善", "Self-care, unpaid debts, one-sided charity", "自我照顾、未偿还的债务、单方面的慈善", "https://www.sacred-texts.com/tarot/pkt/img/pe06.jpg"));
        cards.add(new TarotCard("Seven of Pentacles", "星币七", "Long-term view, sustainable results, perseverance, investment", "长远眼光、可持续的结果、毅力、投资", "Lack of long-term vision, limited success or reward", "缺乏长远眼光、成功或回报有限", "https://www.sacred-texts.com/tarot/pkt/img/pe07.jpg"));
        cards.add(new TarotCard("Eight of Pentacles", "星币八", "Apprenticeship, repetitive tasks, mastery, skill development", "学徒、重复性任务、掌握、技能发展", "Self-development, perfectionism, misdirected activity", "自我发展、完美主义、错误的活动", "https://www.sacred-texts.com/tarot/pkt/img/pe08.jpg"));
        cards.add(new TarotCard("Nine of Pentacles", "星币九", "Abundance, luxury, self-sufficiency, financial independence", "富足、奢侈、自给自足、经济独立", "Self-worth, over-investment in work, hustling", "自我价值、对工作过度投资、拼命", "https://www.sacred-texts.com/tarot/pkt/img/pe09.jpg"));
        cards.add(new TarotCard("Ten of Pentacles", "星币十", "Wealth, financial security, family, long-term success, contribution", "财富、财务安全、家庭、长期成功、贡献", "The dark side of wealth, financial failure or loss", "财富的阴暗面、财务失败或损失", "https://www.sacred-texts.com/tarot/pkt/img/pe10.jpg"));
        cards.add(new TarotCard("Page of Pentacles", "星币侍从", "Manifestation, financial opportunity, skill development", "显现、财务机会、技能发展", "Lack of progress, procrastination, learn from failure", "缺乏进展、拖延、从失败中学习", "https://www.sacred-texts.com/tarot/pkt/img/pepa.jpg"));
        cards.add(new TarotCard("Knight of Pentacles", "星币骑士", "Hard work, productivity, routine, conservatism", "努力工作、生产力、常规、保守", "Self-discipline, boredom, feeling ‘stuck’, perfectionism", "自律、无聊、感觉‘卡住’、完美主义", "https://www.sacred-texts.com/tarot/pkt/img/pekn.jpg"));
        cards.add(new TarotCard("Queen of Pentacles", "星币女王", "Nurturing, practical, providing financially, a working parent", "养育、务实、提供经济支持、在职父母", "Financial independence, self-care, work-home conflict", "经济独立、自我照顾、工作与家庭的冲突", "https://www.sacred-texts.com/tarot/pkt/img/pequ.jpg"));
        cards.add(new TarotCard("King of Pentacles", "星币国王", "Wealth, business, leadership, security, discipline, abundance", "财富、商业、领导力、安全、纪律、富足", "Financially inept, obsessed with wealth and status, stubborn", "理财能力差、沉迷于财富和地位、固执", "https://www.sacred-texts.com/tarot/pkt/img/peki.jpg"));
    }

    /**
     * 随机洗牌。
     */
    public void shuffle() {
        Collections.shuffle(cards);
    }

    /**
     * 返回牌堆中当前的卡牌列表。
     * @return TarotCard对象的列表。
     */
    public List<TarotCard> getCards() {
        return cards;
    }

    /**
     * 从牌堆顶部抽取指定数量的牌。
     * 抽出的牌将从牌堆中移除。
     * 每张抽出的牌都会被随机赋予正位或逆位状态。
     * @param numberOfCards 要抽取的牌的数量。
     * @return 抽取的TarotCard对象的列表。
     */
    public List<TarotCard> draw(int numberOfCards) {
        List<TarotCard> drawnCards = new ArrayList<>();
        for (int i = 0; i < numberOfCards; i++) {
            if (!cards.isEmpty()) {
                TarotCard card = cards.remove(0);
                card.setReversed(Math.random() > 0.5);
                drawnCards.add(card);
            }
        }
        return drawnCards;
    }
}
