"""
未来洞察与潜能激发服务 (第三个页面后端核心)

设计目标：
- 提供基线趋势（维持现状）与潜能路径（执行计划）两条未来曲线
- 生成“未来画像”文字与可视主题
- 支持 What-If 行为模拟（冥想、运动、睡眠、饮食、认知训练）

注意：
- 这里实现的是一个轻量级、可解释的启发式模型，便于前后端快速联调。
- 后续可替换为深度学习/集成学习的真实预测服务，接口保持不变。
"""
from __future__ import annotations

from typing import Dict, List, Optional, Tuple
from .data_service import get_latest_metrics, calculate_pension_score, predict_future_pension, pension_risk_assessment


def _clamp(v: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, v))


def _pension_risk_index(metrics: Dict) -> float:
    """估算养老金规划的风险指数 0~1，越高代表基线越易下降。
    基于财务指标进行启发式组合。
    """
    age = float(metrics.get("年龄", 40) or 40)
    debt_ratio = float(metrics.get("负债率", 0.2) or 0.2)
    savings_rate = float(metrics.get("储蓄率", 0.2) or 0.2)
    total_assets = float(metrics.get("总资产", 100000) or 100000)
    pension_balance = float(metrics.get("养老金账户余额", 0) or 0)
    risk_preference = metrics.get("风险偏好", "平衡")

    risk = 0.25  # 基础风险
    if age >= 55:
        risk += 0.15
    if age >= 65:
        risk += 0.10
    if debt_ratio > 0.5:
        risk += 0.20
    if debt_ratio > 0.7:
        risk += 0.10
    if savings_rate < 0.1:
        risk += 0.12
    if total_assets < 50000:
        risk += 0.10
    if pension_balance < 10000:
        risk += 0.10
    if risk_preference == "激进":
        risk += 0.05
    elif risk_preference == "保守":
        risk -= 0.05

    return float(_clamp(risk, 0.0, 1.0))


def _baseline_curve(current_score: float, risk: float, months: int = 12) -> List[int]:
    """生成基线（维持现状）曲线。
    低风险人群可能略有自发改善（正微斜率），高风险则逐月小幅下降。
    """
    slope = -1.2 * risk + 0.05  # ~[-1.15, +0.05] 分/每月
    vals: List[int] = []
    v = float(current_score)
    for _ in range(months):
        v = _clamp(v + slope)
        vals.append(int(round(v)))
    return vals


def _intervention_effects(params: Dict, metrics: Dict) -> Tuple[float, Dict[str, float]]:
    """根据行为干预参数计算长期累计效应（总分增量）与维度分解。
    返回 (total_delta, by_dim)

    可调参数（均为可选）：
    - savings_increase: 每月增加储蓄金额
    - investment_increase: 每月增加投资金额
    - debt_reduction: 每月减少债务金额
    - retirement_age_adjust: 调整退休年龄
    - risk_adjust: 调整风险偏好 (保守/稳健/平衡/积极/激进)
    """
    savings_inc = float(params.get("savings_increase", 1000) or 1000)
    investment_inc = float(params.get("investment_increase", 500) or 500)
    debt_red = float(params.get("debt_reduction", 200) or 200)
    retirement_adjust = float(params.get("retirement_age_adjust", 0) or 0)
    risk_adjust = params.get("risk_adjust") or metrics.get("风险偏好", "平衡")

    by_dim = {"财务基础": 0.0, "负债管理": 0.0, "投资配置": 0.0, "风险规划": 0.0, "行为参与": 0.0}

    # 增加储蓄 -> 财务基础
    financial_delta = min(10.0, (savings_inc / 1000.0) * 2.0)  # 每增加1000元约+2，封顶+10
    by_dim["财务基础"] += financial_delta

    # 增加投资 -> 投资配置
    investment_delta = min(8.0, (investment_inc / 500.0) * 1.5)  # 每增加500元约+1.5，封顶+8
    by_dim["投资配置"] += investment_delta

    # 减少债务 -> 负债管理
    debt_delta = min(6.0, (debt_red / 200.0) * 1.2)  # 每减少200元约+1.2，封顶+6
    by_dim["负债管理"] += debt_delta

    # 调整退休年龄 -> 风险规划 (早退休可能增加风险)
    retirement_delta = max(-2.0, min(2.0, retirement_adjust * 0.1))  # 每调整1年±0.1
    by_dim["风险规划"] += retirement_delta

    # 调整风险偏好 -> 风险规划
    risk_map = {"保守": -1.0, "稳健": 0.0, "平衡": 1.0, "积极": 2.0, "激进": 3.0}
    current_risk = risk_map.get(metrics.get("风险偏好", "平衡"), 1.0)
    new_risk = risk_map.get(risk_adjust, 1.0)
    risk_delta = (new_risk - current_risk) * 0.5
    by_dim["风险规划"] += risk_delta

    total_delta = sum(by_dim.values())
    return total_delta, by_dim


def _potential_curve(
    current_score: float,
    baseline_slope: float,
    total_delta: float,
    months: int = 12,
) -> List[int]:
    """生成潜能路径曲线。
    设定：
    - 首月有一半的即时增益（行为启动效应）
    - 随时间按月均匀积累增益，并叠加小幅自我强化项
    """
    v = float(current_score) + min(6.0, total_delta * 0.5)
    monthly_gain = (total_delta / months) + 0.3  # 0.3 自我强化项
    slope = baseline_slope + monthly_gain
    vals: List[int] = []
    for _ in range(months):
        v = _clamp(v + slope)
        vals.append(int(round(v)))
    return vals


def _persona_theme(score: float, risk: float) -> Dict:
    """根据分数与风险给出视觉主题（供前端映射为颜色/光晕等）。"""
    if score >= 85:
        return {"color": "#27ae60", "glow": 0.9, "tone": "vivid"}
    if score >= 75:
        return {"color": "#2ecc71", "glow": 0.7, "tone": "bright"}
    if risk >= 0.7 or score < 60:
        return {"color": "#e74c3c", "glow": 0.3, "tone": "alert"}
    return {"color": "#f1c40f", "glow": 0.5, "tone": "warm"}


def _persona_text(title: str, dims: Dict[str, float]) -> str:
    highlights: List[str] = []
    if dims.get("财务基础", 0) > 0.1:
        highlights.append("财务稳健")
    if dims.get("负债管理", 0) > 0.1:
        highlights.append("债务优化")
    if dims.get("投资配置", 0) > 0.1:
        highlights.append("投资增长")
    if dims.get("风险规划", 0) > 0.1:
        highlights.append("规划前瞻")
    if dims.get("行为参与", 0) > 0.1:
        highlights.append("积极参与")
    if not highlights:
        highlights.append("均衡发展")
    return f"{title}：突出特质为{ '、'.join(highlights) }，坚持当下节律，未来更佳。"


def _what_if_config(default_risk: str = "平衡") -> Dict:
    return {
        "savings_increase": {"min": 0, "max": 10000, "step": 500, "default": 1000, "unit": "元/月"},
        "investment_increase": {"min": 0, "max": 5000, "step": 250, "default": 500, "unit": "元/月"},
        "debt_reduction": {"min": 0, "max": 2000, "step": 100, "default": 200, "unit": "元/月"},
        "retirement_age_adjust": {"min": -5, "max": 5, "step": 1, "default": 0, "unit": "年"},
        "risk_adjust": {"options": ["保守", "稳健", "平衡", "积极", "激进"], "default": default_risk},
    }


def get_future_insights(user_id: int, params: Optional[Dict] = None) -> Optional[Dict]:
    """对外主函数：获取未来洞察数据包。
    params 可传入模拟参数（同 _intervention_effects）。
    """
    metrics = get_latest_metrics(user_id)
    if not metrics:
        return None

    score_data = calculate_pension_score(metrics)
    current_score = float(score_data.get("total_score", 70))
    risk = _pension_risk_index(metrics)
    months = 12

    baseline_vals = _baseline_curve(current_score, risk, months)
    baseline_slope = (baseline_vals[-1] - current_score) / months

    # 行为参数：默认采用“适中”强度
    params = params or {}
    total_delta, by_dim = _intervention_effects(params, metrics)
    potential_vals = _potential_curve(current_score, baseline_slope, total_delta, months)

    # 画像
    baseline_title = "潜能待唤醒者" if (risk > 0.45 and current_score < 80) else "稳健自我调节者"
    potential_peek = max(potential_vals) if potential_vals else current_score
    potential_title = (
        "专注的创新者" if potential_peek >= 85 else ("高韧性的进步者" if potential_peek >= 75 else "均衡前行者")
    )

    persona = {
        "baseline": {
            "title": baseline_title,
            "description": _persona_text(baseline_title, {k: 0 for k in by_dim}),
            "theme": _persona_theme(current_score, risk),
        },
        "potential": {
            "title": potential_title,
            "description": _persona_text(potential_title, by_dim),
            "theme": _persona_theme(potential_peek, max(0.0, risk - 0.15)),
        },
    }

    # 效应拆解
    effect_breakdown = [
        {"name": "增加储蓄", "delta": round(by_dim.get("财务基础", 0), 1)},
        {"name": "增加投资", "delta": round(by_dim.get("投资配置", 0), 1)},
        {"name": "减少债务", "delta": round(by_dim.get("负债管理", 0), 1)},
        {"name": "调整退休年龄", "delta": round(by_dim.get("风险规划", 0), 1)},
        {"name": "调整风险偏好", "delta": round(by_dim.get("风险规划", 0), 1)},
    ]

    return {
        "userId": int(user_id),
        "currentScore": int(round(current_score)),
        "horizonMonths": months,
        "baselineCurve": baseline_vals,
        "potentialCurve": potential_vals,
        "persona": persona,
        "effectBreakdown": effect_breakdown,
        "whatIfConfig": _what_if_config(str(metrics.get("风险偏好", "平衡"))),
    }


def simulate_future(user_id: int, sim_params: Dict) -> Optional[Dict]:
    """What-If 模拟：根据前端传入参数返回新的曲线与画像，并添加每日进展和评分反馈。"""
    metrics = get_latest_metrics(user_id)
    if not metrics:
        return None

    score_data = calculate_pension_score(metrics)
    current_score = float(score_data.get("total_score", 70))
    risk = _pension_risk_index(metrics)
    months = 12
    days = int(sim_params.get("days", 30))  # 新增：模拟天数

    baseline_vals = _baseline_curve(current_score, risk, months)
    baseline_slope = (baseline_vals[-1] - current_score) / months

    total_delta, by_dim = _intervention_effects(sim_params or {}, metrics)
    potential_vals = _potential_curve(current_score, baseline_slope, total_delta, months)

    potential_peek = max(potential_vals) if potential_vals else current_score
    potential_title = (
        "专注的创新者" if potential_peek >= 85 else ("高韧性的进步者" if potential_peek >= 75 else "均衡前行者")
    )

    # 新增：计算每日进展和评分反馈
    score_increase = round(total_delta * (days / 365.0), 1)  # 按天数比例计算提升
    feedback = _generate_feedback(score_increase, by_dim, days)
    daily_breakdown = _generate_daily_breakdown(current_score, score_increase, days)
    daily_plan = _generate_daily_plan(sim_params, by_dim)

    return {
        "userId": int(user_id),
        "baselineCurve": baseline_vals,
        "potentialCurve": potential_vals,
        "effectBreakdown": [
            {"name": "增加储蓄", "delta": round(by_dim.get("财务基础", 0), 1)},
            {"name": "增加投资", "delta": round(by_dim.get("投资配置", 0), 1)},
            {"name": "减少债务", "delta": round(by_dim.get("负债管理", 0), 1)},
            {"name": "调整退休年龄", "delta": round(by_dim.get("风险规划", 0), 1)},
            {"name": "调整风险偏好", "delta": round(by_dim.get("风险规划", 0), 1)},
        ],
        "persona": {
            "potential": {
                "title": potential_title,
                "theme": _persona_theme(potential_peek, max(0.0, risk - 0.15)),
            }
        },
        "scoreIncrease": score_increase,
        "feedback": feedback,
        "dailyBreakdown": daily_breakdown,
        "dailyPlan": daily_plan,
    }


def _generate_feedback(score_increase: float, by_dim: Dict[str, float], days: int) -> str:
    """生成正反馈消息。"""
    if score_increase >= 10:
        level = "优秀"
        msg = f"太棒了！坚持{ days }天，您将显著提升养老金规划{ score_increase }分，未来更安心！"
    elif score_increase >= 5:
        level = "良好"
        msg = f"很好！{ days }天的努力将带来{ score_increase }分的提升，继续加油！"
    else:
        level = "基础"
        msg = f"不错的选择！{ days }天后您将感受到{ score_increase }分的改善，每一步都很重要。"
    
    # 添加维度反馈
    top_dim = max(by_dim, key=by_dim.get)
    msg += f" 重点改善：{ top_dim }。"
    return msg


def _generate_daily_breakdown(current_score: float, score_increase: float, days: int) -> List[Dict]:
    """生成每日进展列表。"""
    daily_increase = score_increase / days
    breakdown = []
    score = current_score
    for day in range(1, days + 1):
        score += daily_increase
        score = _clamp(score)
        feedback = "保持良好" if score > current_score + (score_increase * day / days) * 0.8 else "稳步提升"
        breakdown.append({
            "day": day,
            "score": round(score, 1),
            "feedback": feedback
        })
    return breakdown


def _generate_daily_plan(params: Dict, by_dim: Dict[str, float]) -> List[Dict]:
    """生成全天个性化计划。"""
    plan = []
    
    # 晨间财务规划 (财务)
    morning_score = min(10, 5 + (params.get("savings_increase", 1000) / 1000) + (by_dim.get("财务基础", 0) / 10))
    plan.append({
        "time": "07:00",
        "category": "财务",
        "activity": f"晨间规划 - 增加储蓄 {params.get('savings_increase', 1000)} 元，检查账户",
        "score": round(morning_score, 1),
        "feedback": "良好的财务规划是养老的基础",
        "icon": "💰"
    })
    
    # 投资学习 (投资)
    investment_score = min(10, 6 + (params.get("investment_increase", 500) / 500) + (by_dim.get("投资配置", 0) / 20))
    plan.append({
        "time": "08:00",
        "category": "投资",
        "activity": f"投资学习 - 增加投资 {params.get('investment_increase', 500)} 元，了解市场",
        "score": round(investment_score, 1),
        "feedback": "持续投资是财富增长的关键",
        "icon": "📈"
    })
    
    # 债务管理 (债务)
    debt_score = min(10, 4 + (params.get("debt_reduction", 200) / 200) + (by_dim.get("负债管理", 0) / 10))
    plan.append({
        "time": "09:00",
        "category": "债务",
        "activity": f"债务管理 - 减少债务 {params.get('debt_reduction', 200)} 元",
        "score": round(debt_score, 1),
        "feedback": "控制债务，提升财务健康",
        "icon": "📉"
    })
    
    # 风险评估 (规划)
    risk_score = min(10, 5 + (by_dim.get("风险规划", 0) / 15))
    plan.append({
        "time": "10:00",
        "category": "规划",
        "activity": f"风险评估 - 调整风险偏好为 {params.get('risk_adjust', '平衡')}",
        "score": round(risk_score, 1),
        "feedback": "合理风险规划，保障退休生活",
        "icon": "⚖️"
    })
    
    # 午餐休息 (休息)
    lunch_score = min(10, 7 + (by_dim.get("行为参与", 0) / 20))
    plan.append({
        "time": "12:00",
        "category": "休息",
        "activity": f"午餐休息 - 规划退休目标",
        "score": round(lunch_score, 1),
        "feedback": "休息调整，下午更高效",
        "icon": "🍽️"
    })
    
    # 退休规划 (规划)
    retirement_score = min(10, 6 + (params.get("retirement_age_adjust", 0) / 5) + (by_dim.get("风险规划", 0) / 10))
    plan.append({
        "time": "14:00",
        "category": "规划",
        "activity": f"退休规划 - 调整退休年龄 {params.get('retirement_age_adjust', 0)} 年",
        "score": round(retirement_score, 1),
        "feedback": "提前规划，安心退休",
        "icon": "🏖️"
    })
    
    # 平台互动 (参与)
    interaction_score = min(10, 5 + (by_dim.get("行为参与", 0) / 20))
    plan.append({
        "time": "16:00",
        "category": "参与",
        "activity": f"平台互动 - 查看策略，参与问答",
        "score": round(interaction_score, 1),
        "feedback": "积极参与，提升规划效果",
        "icon": "💬"
    })
    
    # 晚餐休息 (休息)
    dinner_score = min(10, 6 + (by_dim.get("行为参与", 0) / 20))
    plan.append({
        "time": "18:00",
        "category": "休息",
        "activity": f"晚餐休息 - 回顾今日财务",
        "score": round(dinner_score, 1),
        "feedback": "休息调整，晚上更放松",
        "icon": "🍲"
    })
    
    # 家庭讨论 (参与)
    family_score = min(10, 5 + (by_dim.get("行为参与", 0) / 15))
    plan.append({
        "time": "19:00",
        "category": "参与",
        "activity": f"家庭讨论 - 与家人分享养老规划",
        "score": round(family_score, 1),
        "feedback": "家庭共识，共同规划未来",
        "icon": "👨‍👩‍👧‍�"
    })
    
    # 睡前规划 (规划)
    planning_score = min(10, 7 + (by_dim.get("风险规划", 0) / 10))
    plan.append({
        "time": "21:00",
        "category": "规划",
        "activity": f"睡前规划 - 制定明日目标",
        "score": round(planning_score, 1),
        "feedback": "良好的规划有助于安心入睡",
        "icon": "�"
    })
    
    # 睡眠 (休息)
    sleep_score = min(10, 8 + (by_dim.get("行为参与", 0) / 15))
    plan.append({
        "time": "22:00",
        "category": "休息",
        "activity": f"优质睡眠 - 为明日规划蓄力",
        "score": round(sleep_score, 1),
        "feedback": "睡眠是规划的基础",
        "icon": "🌙"
    })
    
    return plan
