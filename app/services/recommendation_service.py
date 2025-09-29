"""
推荐引擎服务
基于用户画像和财务指标生成个性化投资计划和消费建议
"""

import random
from typing import List, Dict, Any

def generate_consumption_recommendations(metrics):
    """
    基于消费行为数据生成个性化消费建议
    """
    recommendations = []

    # 消费行为分析
    total_consumption = sum([
        metrics.get('餐饮消费', 0), metrics.get('衣物消费', 0), metrics.get('住房消费', 0),
        metrics.get('交通消费', 0), metrics.get('娱乐消费', 0), metrics.get('教育培训消费', 0),
        metrics.get('医疗保健消费', 0), metrics.get('健身运动消费', 0), metrics.get('旅行度假消费', 0),
        metrics.get('数字产品消费', 0), metrics.get('宠物消费', 0), metrics.get('图书影音消费', 0),
        metrics.get('美容护肤消费', 0), metrics.get('线上购物消费', 0), metrics.get('线下购物消费', 0),
        metrics.get('奢侈品消费', 0), metrics.get('家庭日用品消费', 0), metrics.get('母婴消费', 0),
        metrics.get('绿色环保消费', 0), metrics.get('慈善捐赠消费', 0)
    ])

    monthly_income = metrics.get('月总流入', 1)
    consumption_rate = total_consumption / monthly_income

    # 消费控制建议
    if consumption_rate > 0.9:
        recommendations.append({
            "category": "消费控制",
            "priority": "high",
            "content": "月消费支出过高，已超过收入的90%，建议立即制定严格的消费预算",
            "action": "制定月度消费预算，控制非必要支出"
        })

    # 奢侈品消费分析
    luxury_spending = metrics.get('奢侈品消费', 0) + metrics.get('美容护肤消费', 0)
    if luxury_spending > total_consumption * 0.15:
        recommendations.append({
            "category": "消费优化",
            "priority": "medium",
            "content": "奢侈品消费占比过高，建议优化支出结构，将更多资金用于投资",
            "action": "减少奢侈品消费，将节省的资金投入理财产品"
        })

    # 教育投资分析
    education_spending = metrics.get('教育培训消费', 0)
    if education_spending < total_consumption * 0.05:
        recommendations.append({
            "category": "教育投资",
            "priority": "medium",
            "content": "金融知识学习投入不足，建议增加教育培训消费以提升投资技能",
            "action": "每月安排一定预算用于金融课程学习"
        })

    # 健康消费分析
    health_spending = metrics.get('医疗保健消费', 0) + metrics.get('健身运动消费', 0)
    if health_spending < total_consumption * 0.08:
        recommendations.append({
            "category": "健康投资",
            "priority": "low",
            "content": "健康消费偏低，建议增加健身和医疗保健支出",
            "action": "制定健康消费计划，定期体检和健身"
        })

    # 慈善捐赠分析
    charity_spending = metrics.get('慈善捐赠消费', 0)
    if charity_spending < total_consumption * 0.02:
        recommendations.append({
            "category": "社会责任",
            "priority": "low",
            "content": "慈善捐赠偏低，建议适当增加公益支出",
            "action": "制定年度慈善捐赠计划，支持社会公益事业"
        })

    return recommendations

# 预定义的推荐模板，根据用户画像定制
RECOMMENDATION_TEMPLATES = {
    "高收入保守型": {
        "daily_actions": [
            "检查投资组合表现",
            "记录每日支出",
            "学习理财知识",
            "规划退休目标",
            "联系财务顾问"
        ],
        "weekly_goals": [
            "每周调整投资策略",
            "每周进行财务规划会议",
            "每周学习新投资产品",
            "每周评估风险偏好"
        ],
        "long_term": [
            "制定10年财务规划",
            "建立多元投资组合",
            "培养持续储蓄习惯",
            "发展被动收入来源"
        ]
    },
    "中产平衡型": {
        "daily_actions": [
            "跟踪储蓄进度",
            "比较消费与预算",
            "学习基础投资知识",
            "规划家庭财务",
            "记录财务目标"
        ],
        "weekly_goals": [
            "每周制定消费预算",
            "每周检查账户余额",
            "每周学习财务管理技巧",
            "每周评估财务健康"
        ],
        "long_term": [
            "建立应急基金",
            "制定退休规划",
            "优化税务策略",
            "培养财务自律"
        ]
    },
    "年轻进取型": {
        "daily_actions": [
            "学习投资技能",
            "跟踪市场动态",
            "增加储蓄金额",
            "探索创业机会",
            "网络人脉拓展"
        ],
        "weekly_goals": [
            "每周尝试新投资",
            "每周学习金融课程",
            "每周制定职业规划",
            "每周评估风险承受"
        ],
        "long_term": [
            "建立财富积累体系",
            "发展多元收入来源",
            "培养投资思维",
            "规划长期财务自由"
        ]
    },
    "高负债风险型": {
        "daily_actions": [
            "制定债务偿还计划",
            "记录每日支出",
            "寻找额外收入来源",
            "咨询债务管理专家",
            "建立预算控制"
        ],
        "weekly_goals": [
            "每周偿还部分债务",
            "每周调整消费习惯",
            "每周学习债务管理",
            "每周评估财务状况"
        ],
        "long_term": [
            "制定债务清偿计划",
            "建立健康财务习惯",
            "培养储蓄意识",
            "寻求专业财务帮助"
        ]
    },
    "退休保障型": {
        "daily_actions": [
            "检查养老金账户",
            "规划退休生活",
            "学习退休理财",
            "联系社保机构",
            "评估医疗保险"
        ],
        "weekly_goals": [
            "每周制定退休预算",
            "每周学习养老知识",
            "每周评估退休准备",
            "每周规划退休活动"
        ],
        "long_term": [
            "完善退休保障体系",
            "优化养老投资组合",
            "建立退休生活规划",
            "培养健康生活习惯"
        ]
    }
}

def generate_personalized_recommendations(user_profile: str, metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    基于用户画像和当前指标生成个性化推荐

    Args:
        user_profile: 用户画像类型
        metrics: 用户当前财务指标

    Returns:
        包含每日行动、周目标、长期计划的推荐字典
    """
    if user_profile not in RECOMMENDATION_TEMPLATES:
        user_profile = "中产平衡型"  # 默认类型

    base_recommendations = RECOMMENDATION_TEMPLATES[user_profile]

    # 根据具体指标调整推荐
    adjusted_recommendations = _adjust_recommendations_based_on_metrics(
        base_recommendations.copy(), metrics
    )

    # 生成消费行为推荐
    consumption_recommendations = generate_consumption_recommendations(metrics)

    # 添加优先级和进度跟踪
    recommendations_with_priority = _add_priority_and_tracking(adjusted_recommendations)

    return {
        "user_profile": user_profile,
        "recommendations": recommendations_with_priority,
        "consumption_recommendations": consumption_recommendations,
        "generated_at": "2024-01-01T00:00:00Z",  # 实际应用中应使用当前时间
        "valid_period": "7天"  # 推荐有效期
    }

def _adjust_recommendations_based_on_metrics(recommendations: Dict[str, List[str]],
                                           metrics: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    根据具体财务指标调整推荐内容
    """
    # 基于负债率调整债务相关推荐
    debt_ratio = metrics.get('负债率', 0.2)
    if debt_ratio > 0.5:
        # 添加更多债务管理
        recommendations["daily_actions"].append("制定详细债务偿还计划")
        recommendations["weekly_goals"].append("增加债务偿还频率")

    # 基于储蓄率调整储蓄相关推荐
    savings_rate = metrics.get('储蓄率', 0.2)
    if savings_rate < 0.1:
        recommendations["daily_actions"].insert(0, "立即增加储蓄比例")
        recommendations["weekly_goals"].insert(0, "制定储蓄目标")

    # 基于总资产调整投资相关推荐
    total_assets = metrics.get('总资产', 100000)
    if total_assets < 50000:
        recommendations["daily_actions"].insert(0, "优先积累资产")

    # 基于年龄调整退休相关推荐
    age = metrics.get('年龄', 30)
    if age > 50:
        recommendations["daily_actions"].append("加速退休规划")
        recommendations["weekly_goals"].append("评估退休准备度")

    return recommendations

def _add_priority_and_tracking(recommendations: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    为推荐添加优先级和进度跟踪信息
    """
    result = {}

    for category, actions in recommendations.items():
        result[category] = []
        for i, action in enumerate(actions):
            result[category].append({
                "id": f"{category}_{i}",
                "content": action,
                "priority": "high" if i < 2 else "medium" if i < 4 else "low",
                "completed": False,
                "progress": 0,
                "difficulty": random.choice(["easy", "medium", "hard"]),
                "estimated_time": random.randint(5, 60)  # 分钟
            })

    return result

def get_recommendation_progress(user_id: int) -> Dict[str, Any]:
    """
    获取用户的推荐完成进度
    实际应用中应从数据库获取
    """
    # 模拟数据
    return {
        "total_tasks": 15,
        "completed_tasks": 7,
        "completion_rate": 46.7,
        "current_streak": 3,
        "best_streak": 7,
        "weekly_progress": [30, 40, 35, 50, 45, 60, 47]
    }

def update_recommendation_progress(user_id: int, task_id: str, completed: bool) -> bool:
    """
    更新推荐任务的完成状态
    实际应用中应更新数据库
    """
    # 模拟更新
    return True