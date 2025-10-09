import pandas as pd
import numpy as np
import os
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from .nlp_service import generate_tags
from .data_service import get_latest_metrics, calculate_pension_score, predict_future_pension, pension_risk_assessment

def analyze_consumption_behavior(metrics):
    consumption_categories = [
        "住房固定支出", "家庭公共事业", "家居家装", "日用杂货", "家庭服务",
        "餐饮食品", "日常通勤", "私家车消费", "长途差旅", "服饰鞋履",
        "美妆护肤", "文娱", "运动健身", "兴趣爱好", "教育培训",
        "书籍文具", "求医问药", "保健养生", "电子设备与通信", "礼品礼金",
        "公益慈善", "意外杂项", "保险", "投资理财", "贷款利息"
    ]

    total_consumption = metrics.get('月总流出', 0)
    monthly_income = metrics.get('月总流入', 1)

    consumption_breakdown = []
    for category in consumption_categories:
        # 新数据中消费字段名为 f"{category}消费"
        amount = metrics.get(f"{category}消费", 0)
        percentage = (amount / total_consumption * 100) if total_consumption > 0 else 0
        consumption_breakdown.append({
            'category': category,
            'amount': amount,
            'percentage': round(percentage, 1)
        })
    
    consumption_breakdown = sorted(consumption_breakdown, key=lambda x: x['amount'], reverse=True)

    insights = []
    savings_rate = metrics.get('储蓄率', 0)
    if savings_rate < 0.1:
        insights.append("储蓄率过低，消费可能超出预算，建议审视支出结构。")
    elif savings_rate > 0.4:
        insights.append("储蓄率非常健康，财务控制能力强。")

    soft_spending = (
        metrics.get('文娱消费', 0) + metrics.get('美妆护肤消费', 0) +
        metrics.get('兴趣爱好消费', 0) + metrics.get('礼品礼金消费', 0)
    )
    if total_consumption > 0 and (soft_spending / total_consumption > 0.3):
        insights.append("生活品质类支出占比较高，请确保不影响核心储蓄目标。")

    self_investment = metrics.get('教育培训消费', 0) + metrics.get('书籍文具消费', 0)
    if total_consumption > 0 and (self_investment / total_consumption < 0.05):
        insights.append("在自我提升方面的投入较少，适度投资于学习和成长有助于未来收入提升。")

    return {
        'totalConsumption': total_consumption,
        'consumptionRate': round(total_consumption / monthly_income, 2) if monthly_income > 0 else 0,
        'breakdown': consumption_breakdown,
        'insights': insights
    }

def generate_asset_allocation(metrics):
    """
    基于用户数据生成资产配置建议
    """
    age = metrics.get('年龄', 40)
    risk_preference = metrics.get('风险偏好', '平衡')
    total_assets = metrics.get('总资产', 100000)

    equity_ratio = (100 - age) / 100
    
    if risk_preference == '保守':
        equity_ratio = max(0.1, equity_ratio - 0.2)
    elif risk_preference == '稳健':
        equity_ratio = max(0.1, equity_ratio - 0.1)
    elif risk_preference == '积极':
        equity_ratio = min(0.9, equity_ratio + 0.1)
    elif risk_preference == '激进':
        equity_ratio = min(0.9, equity_ratio + 0.2)

    fixed_income_ratio = 1 - equity_ratio

    allocation = {
        '风险资产(股票/基金等)': equity_ratio,
        '稳健资产(债券/理财等)': fixed_income_ratio,
    }

    detailed_allocation = []
    for asset_type, percentage in allocation.items():
        amount = total_assets * percentage
        detailed_allocation.append({
            'assetType': asset_type,
            'percentage': round(percentage * 100, 1),
            'amount': round(amount, 0),
            'recommendation': f"建议配置约 {round(percentage * 100, 1)}% 的{asset_type}"
        })

    return {
        'riskPreference': risk_preference,
        'totalAssets': total_assets,
        'allocation': detailed_allocation,
        'monthlyInvestment': round(metrics.get('月总流入', 0) * metrics.get('储蓄率', 0), 0)
    }

def get_user_profile(metrics):
    """
    使用K-Means聚类算法，适配新数据维度。
    """
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..','..' 'data', 'pension_500.csv')
        df = pd.read_csv(DATA_PATH, dtype={'用户ID': int})

        cluster_features = [
            '年龄', '月工资收入', '经营性收入', '被动收入', '储蓄率',
            '总资产', '净资产', '负债率', '养老金账户余额', '缴纳年限', 
            '商业保险年缴', '保险保额', '计划退休年龄', '目标养老金'
        ]
        
        categorical_features = {
            '风险偏好': {'保守': 1, '稳健': 2, '平衡': 3, '积极': 4, '激进': 5},
            '访问频率': {'低': 1, '中': 2, '高': 3},
            '策略采纳情况': {'未采纳': 1, '考虑中': 2, '部分采纳': 3, '完全采纳': 4},
            '内容互动情况': {'较少': 1, '偶尔': 2, '经常': 3}
        }
        
        for col, mapping in categorical_features.items():
            if col in df.columns:
                df[col] = df[col].map(mapping)
                cluster_features.append(col)

        cluster_data = df[cluster_features].fillna(df[cluster_features].mean())
        scaler = StandardScaler()
        cluster_data_scaled = scaler.fit_transform(cluster_data)

        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        kmeans.fit(cluster_data_scaled)

        user_data_df = pd.DataFrame([metrics])
        for col, mapping in categorical_features.items():
            if col in user_data_df.columns:
                 user_data_df[col] = user_data_df[col].map(mapping)

        user_data = user_data_df[cluster_features].fillna(df[cluster_features].mean())
        user_scaled = scaler.transform(user_data)
        cluster = kmeans.predict(user_scaled)[0]

        cluster_names = {
            0: "稳健增长的中产家庭",
            1: "高潜力的年轻奋斗者",
            2: "财务承压的月光族",
            3: "资产雄厚的保守规划者",
            4: "临近退休的安稳主义者"
        }
        return cluster_names.get(cluster, "未知画像")
    except Exception as e:
        print(f"Clustering error: {e}")
        if metrics.get('年龄', 40) < 30 and metrics.get('储蓄率', 0) > 0.3:
            return "高潜力的年轻奋斗者"
        elif metrics.get('储蓄率', 0) < 0.1:
            return "财务承压的月光族"
        else:
            return "稳健增长的中产家庭"

def get_dashboard_analysis(user_id):
    """
    重构后的服务协调函数 (已适配新版 data_service 和 nlp_service)
    """
    metrics = get_latest_metrics(user_id)
    if not metrics:
        return None

    # 1. 获取用户画像
    user_profile = get_user_profile(metrics)

    # 2. 调用先进的评分模型
    score_data = calculate_pension_score(metrics)

    # 3. 模拟用户日志文本并调用真实的NLP服务
    simulated_log_text = {
        1: "今天工作很专注，完成了项目，很有成就感。",
        2: "感觉记忆力下降，有点焦虑，晚上没睡好。",
        3: "考试压力很大，注意力不集中，心情烦躁。"
    }.get(int(user_id), "最近财务状况稳定，对未来充满期待。")
    
    # 4. 高级风险评估
    risk_assessment = pension_risk_assessment(metrics)

    # 5. 未来趋势预测
    future_trend = predict_future_pension(metrics, days_ahead=28)  # 4周趋势

    # 6. 生成标签云
    tags_data = generate_tags(user_profile, simulated_log_text)

    # 7. 消费行为分析
    consumption_analysis = analyze_consumption_behavior(metrics)

    # 8. 资产配置建议
    asset_allocation = generate_asset_allocation(metrics)

    # 9. 组装前端数据包
    dashboard_data = {
        "userProfile": user_profile,
        "pensionScore": score_data['total_score'],
        "radarData": score_data['radar_data'],
        "simulationData": score_data.get('simulation_data', {}),
        "futurePrediction": score_data['future_prediction'],
        "riskAssessment": score_data['risk_assessment'],
        "consumptionAnalysis": consumption_analysis,
        "assetAllocation": asset_allocation,
        "keyMetrics": [
            {"name": "月总流入", "value": f"{metrics.get('月总流入', 0):,.0f}", "unit": "元"},
            {"name": "储蓄率", "value": f"{metrics.get('储蓄率', 0):.1%}", "unit": ""},
            {"name": "净资产", "value": f"{metrics.get('净资产', 0):,.0f}", "unit": "元"},
            {"name": "负债率", "value": f"{metrics.get('负债率', 0):.1%}", "unit": ""},
            {"name": "目标达成概率", "value": f"{score_data.get('simulation_data', {}).get('success_probability', 0):.0%}", "unit": ""},
            {"name": "月总支出", "value": f"{metrics.get('月总流出', 0):,.0f}", "unit": "元"},
        ],
        "appliedWeights": score_data.get('applied_weights', {}),
        "tagCloudData": tags_data
    }

    return dashboard_data
