from sklearn.feature_extraction.text import TfidfVectorizer
import re
from typing import Dict, List, Any

# 模拟一个简单的停用词表
STOP_WORDS = ['的', '了', '很', '我', '有点', '今天', '感觉', '觉得', '想', '要', '会', '能', '可以']

# 意图识别关键词映射
INTENT_KEYWORDS = {
    'health_check': ['检查', '体检', '健康', '评估', '诊断', '测试'],
    'symptom_report': ['头痛', '头晕', '记忆', '睡眠', '焦虑', '压力', '疲劳', '疼痛'],
    'lifestyle_advice': ['饮食', '运动', '锻炼', '睡眠', '作息', '习惯', '生活方式'],
    'emotional_support': ['焦虑', '压力', '情绪', '心情', '放松', '冥想', '帮助'],
    'progress_tracking': ['进度', '完成', '目标', '计划', '成就', '记录'],
    'general_chat': ['你好', '谢谢', '再见', '帮助', '聊天']
}

# 情感分析关键词
POSITIVE_WORDS = ['开心', '快乐', '好', '棒', '优秀', '进步', '改善', '自信', '放松', '满意']
NEGATIVE_WORDS = ['难过', '焦虑', '担心', '压力', '疲劳', '痛苦', '困难', '糟糕', '沮丧', '紧张']

def analyze_intent(text: str) -> Dict[str, Any]:
    """
    简单的意图识别
    """
    text_lower = text.lower()

    intent_scores = {}
    for intent, keywords in INTENT_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            intent_scores[intent] = score

    if not intent_scores:
        return {'intent': 'general_chat', 'confidence': 0.5}

    best_intent = max(intent_scores, key=intent_scores.get)
    confidence = min(intent_scores[best_intent] / len(INTENT_KEYWORDS[best_intent]), 1.0)

    return {
        'intent': best_intent,
        'confidence': confidence,
        'all_scores': intent_scores
    }

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    简单的情感分析
    """
    text_lower = text.lower()

    positive_score = sum(1 for word in POSITIVE_WORDS if word in text_lower)
    negative_score = sum(1 for word in NEGATIVE_WORDS if word in text_lower)

    total_words = len(text.split())
    if total_words == 0:
        return {'sentiment': 'neutral', 'score': 0.0}

    # 归一化得分
    normalized_positive = positive_score / total_words
    normalized_negative = negative_score / total_words

    if normalized_positive > normalized_negative:
        sentiment = 'positive'
        score = min(normalized_positive, 1.0)
    elif normalized_negative > normalized_positive:
        sentiment = 'negative'
        score = min(normalized_negative, 1.0)
    else:
        sentiment = 'neutral'
        score = 0.0

    return {
        'sentiment': sentiment,
        'score': score,
        'positive_words': positive_score,
        'negative_words': negative_score
    }

def generate_response(intent: str, sentiment: str, user_profile: str, context: Dict[str, Any] = None, health_info: Dict[str, Any] = None) -> str:
    """
    基于意图、情感、健康信息和用户画像生成智能回复
    """
    base_responses = {
        'health_check': {
            'positive': f"很好，您看起来状态不错！作为{user_profile}类型用户，建议继续保持现有的健康习惯。",
            'negative': f"我注意到您可能有些健康困扰。作为{user_profile}类型用户，建议及时咨询专业医生并调整生活方式。",
            'neutral': f"让我为您提供一个全面的健康检查建议。作为{user_profile}类型用户，这里有一些针对性的建议。"
        },
        'symptom_report': {
            'positive': "虽然您报告了一些症状，但整体情绪还不错。让我们一起关注这些症状并找到改善方法。",
            'negative': "我理解您现在可能不太舒服。记住，适时寻求专业帮助是很重要的，同时我们可以探讨一些自我调节的方法。",
            'neutral': "感谢您分享这些症状信息。这有助于我们更好地了解您的健康状况。"
        },
        'lifestyle_advice': {
            'positive': f"您对生活方式的关注很棒！作为{user_profile}类型用户，继续保持这样的积极态度。",
            'negative': "生活方式的改变有时候会带来压力，但这是值得的。让我们一步步来改善。",
            'neutral': f"关于生活方式的建议，作为{user_profile}类型用户，这里有一些具体的指导。"
        },
        'emotional_support': {
            'positive': "很高兴看到您在积极管理情绪！继续保持这种自我关怀的态度。",
            'negative': "情绪管理确实不容易，但您已经在寻求帮助了，这是很好的第一步。",
            'neutral': "情绪健康很重要，让我们一起探讨一些有效的管理方法。"
        },
        'progress_tracking': {
            'positive': "看到您的进步真是太棒了！继续保持这样的势头。",
            'negative': "有时候进步不是线性的，这是正常的。让我们重新审视目标并调整策略。",
            'neutral': "跟踪进度是保持动力的好方法。让我们看看如何更好地记录和庆祝小成就。"
        },
        'general_chat': {
            'positive': "很高兴和您聊天！有什么我可以帮助您的吗？",
            'negative': "我在这里倾听。如果您想聊聊任何事情，我都很乐意。",
            'neutral': "您好！我是您的AI健康助手，有什么可以帮助您的吗？"
        }
    }

    response = base_responses.get(intent, base_responses['general_chat']).get(sentiment, base_responses['general_chat']['neutral'])

    # 基于健康信息添加个性化建议
    if health_info:
        personalized_tips = []

        if 'fatigue_level' in health_info and health_info['fatigue_level'] > 5:
            personalized_tips.append("建议您多休息，保证充足睡眠，并适量运动来改善精力状况。")

        if 'cognitive_symptoms' in health_info and health_info['cognitive_symptoms'] > 2:
            personalized_tips.append("对于记忆力和注意力问题，建议进行适量的脑力训练和规律作息。")

        if 'alcohol_consumption' in health_info and health_info['alcohol_consumption'] > 3:
            personalized_tips.append("饮酒对健康有影响，建议控制饮酒频率，并多喝水补充水分。")

        if 'exercise_minutes' in health_info and health_info['exercise_minutes'] > 0:
            personalized_tips.append(f"很好，您今天运动了{health_info['exercise_minutes']}分钟！继续保持这样的好习惯。")

        if 'stress_level' in health_info and health_info['stress_level'] > 6:
            personalized_tips.append("压力较大时，可以尝试深呼吸、冥想或与朋友聊天来放松。")

        if personalized_tips:
            response += "\n\n" + " ".join(personalized_tips[:2])  # 最多显示2条建议

    return response

def generate_tags(user_profile, text):
    """
    增强版NLP标签生成。
    以用户画像为主标签，并从文本中提取关键词。
    """
    tag_list = [{"text": user_profile, "value": 1000}]

    if not text:
        return tag_list

    try:
        vectorizer = TfidfVectorizer(stop_words=STOP_WORDS, max_features=10)
        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray()[0]

        keywords = sorted(zip(scores, feature_names), reverse=True)[:4]

        for score, name in keywords:
            if score > 0.1: # 过滤掉权重太低的词
                tag_list.append({"text": name, "value": int(score * 800) + 200})
    except Exception:
        # 如果文本过短或只有停用词，则不添加额外标签
        pass

    return tag_list

def extract_health_info(text: str) -> Dict[str, Any]:
    """
    从用户消息中提取健康相关信息，用于更新用户画像
    """
    text_lower = text.lower()
    health_updates = {}

    # 疲劳和精力水平
    fatigue_keywords = ['累', '疲劳', '疲惫', '没力气', '困', '乏力', '虚弱']
    energy_keywords = ['精神好', '精力充沛', '有活力', '清醒', '兴奋']

    if any(keyword in text_lower for keyword in fatigue_keywords):
        health_updates['fatigue_level'] = min(health_updates.get('fatigue_level', 0) + 2, 10)
    if any(keyword in text_lower for keyword in energy_keywords):
        health_updates['fatigue_level'] = max(health_updates.get('fatigue_level', 5) - 2, 0)

    # 头晕和认知症状
    dizziness_keywords = ['头晕', '眩晕', '头痛', '记忆力差', '注意力不集中', '思维混乱']
    if any(keyword in text_lower for keyword in dizziness_keywords):
        health_updates['cognitive_symptoms'] = min(health_updates.get('cognitive_symptoms', 0) + 1, 5)

    # 饮酒
    alcohol_keywords = ['喝酒', '饮酒', '喝了酒', '喝酒了', '醉', '宿醉']
    if any(keyword in text_lower for keyword in alcohol_keywords):
        health_updates['alcohol_consumption'] = min(health_updates.get('alcohol_consumption', 0) + 1, 7)  # 过去7天饮酒天数

    # 运动
    exercise_keywords = ['运动', '锻炼', '跑步', '健身', '瑜伽', '散步', '骑车', '游泳']
    if any(keyword in text_lower for keyword in exercise_keywords):
        health_updates['exercise_minutes'] = health_updates.get('exercise_minutes', 0) + 30  # 假设每次提到增加30分钟

    # 睡眠质量
    sleep_keywords = ['睡不着', '失眠', '睡眠不好', '睡得浅', '做梦多']
    good_sleep_keywords = ['睡得好', '睡眠质量好', '休息充分']
    if any(keyword in text_lower for keyword in sleep_keywords):
        health_updates['sleep_quality'] = max(health_updates.get('sleep_quality', 3) - 1, 1)
    if any(keyword in text_lower for keyword in good_sleep_keywords):
        health_updates['sleep_quality'] = min(health_updates.get('sleep_quality', 3) + 1, 5)

    # 压力水平
    stress_keywords = ['压力大', '焦虑', '紧张', '担心', '烦躁', '不安']
    relaxed_keywords = ['放松', '平静', '舒适', '安心']
    if any(keyword in text_lower for keyword in stress_keywords):
        health_updates['stress_level'] = min(health_updates.get('stress_level', 3) + 1, 10)
    if any(keyword in text_lower for keyword in relaxed_keywords):
        health_updates['stress_level'] = max(health_updates.get('stress_level', 3) - 1, 0)

    # 情绪状态
    mood_keywords = ['开心', '快乐', '满意', '兴奋']
    bad_mood_keywords = ['难过', '沮丧', '失望', '生气', '郁闷']
    if any(keyword in text_lower for keyword in mood_keywords):
        health_updates['mood_score'] = min(health_updates.get('mood_score', 5) + 1, 10)
    if any(keyword in text_lower for keyword in bad_mood_keywords):
        health_updates['mood_score'] = max(health_updates.get('mood_score', 5) - 1, 0)

    return health_updates if health_updates else None

def process_user_message(message: str, user_profile: str) -> Dict[str, Any]:
    """
    处理用户消息，返回完整的分析结果
    """
    intent_analysis = analyze_intent(message)
    sentiment_analysis = analyze_sentiment(message)
    health_info = extract_health_info(message)

    response = generate_response(
        intent_analysis['intent'],
        sentiment_analysis['sentiment'],
        user_profile,
        health_info=health_info
    )

    return {
        'original_message': message,
        'intent': intent_analysis,
        'sentiment': sentiment_analysis,
        'response': response,
        'tags': generate_tags(user_profile, message),
        'health_info': health_info,
        'timestamp': '2024-01-01T00:00:00Z'  # 实际应用中应使用当前时间
    }