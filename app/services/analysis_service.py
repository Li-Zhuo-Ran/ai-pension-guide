from .data_service import get_latest_metrics, calculate_pension_score, predict_future_pension, pension_risk_assessment
from .nlp_service import generate_tags
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
import os

def analyze_consumption_behavior(metrics):
    """
    分析用户的消费行为模式
    """
    consumption_categories = [
        '餐饮消费', '衣物消费', '住房消费', '交通消费', '娱乐消费', '教育培训消费',
        '医疗保健消费', '健身运动消费', '旅行度假消费', '数字产品消费', '宠物消费',
        '图书影音消费', '美容护肤消费', '线上购物消费', '线下购物消费', '奢侈品消费',
        '家庭日用品消费', '母婴消费', '绿色环保消费', '慈善捐赠消费'
    ]

    total_consumption = sum([metrics.get(cat, 0) for cat in consumption_categories])
    monthly_income = metrics.get('月总流入', 1)  # 避免除零

    # 计算各消费类别的占比
    consumption_breakdown = []
    for category in consumption_categories:
        amount = metrics.get(category, 0)
        percentage = (amount / total_consumption * 100) if total_consumption > 0 else 0
        consumption_breakdown.append({
            'category': category,
            'amount': amount,
            'percentage': round(percentage, 1)
        })

    # 消费行为洞察
    insights = []
    consumption_rate = total_consumption / monthly_income

    if consumption_rate > 0.9:
        insights.append("消费支出过高，建议控制预算")
    elif consumption_rate < 0.6:
        insights.append("储蓄率良好，消费控制得当")

    # 分析奢侈品消费占比
    luxury_spending = metrics.get('奢侈品消费', 0) + metrics.get('美容护肤消费', 0)
    if luxury_spending / total_consumption > 0.2:
        insights.append("奢侈品消费偏高，建议优化支出结构")

    # 分析投资相关消费
    investment_education = metrics.get('教育培训消费', 0)
    if investment_education < total_consumption * 0.05:
        insights.append("建议增加金融知识学习投入")

    return {
        'totalConsumption': total_consumption,
        'consumptionRate': round(consumption_rate, 2),
        'breakdown': consumption_breakdown,
        'insights': insights
    }

def generate_asset_allocation(metrics):
    """
    基于用户数据生成资产配置建议
    """
    age = metrics.get('年龄', 40)
    risk_preference = metrics.get('风险偏好', '平衡')
    monthly_income = metrics.get('月总流入', 10000)
    total_assets = metrics.get('总资产', 100000)

    # 基础配置建议
    base_allocation = {
        '保守型': {
            '现金及等价物': 0.4,
            '债券': 0.4,
            '股票': 0.15,
            '另类投资': 0.05
        },
        '平衡型': {
            '现金及等价物': 0.25,
            '债券': 0.35,
            '股票': 0.35,
            '另类投资': 0.05
        },
        '进取型': {
            '现金及等价物': 0.15,
            '债券': 0.25,
            '股票': 0.55,
            '另类投资': 0.05
        }
    }

    # 根据年龄调整
    if age < 30:
        risk_level = '进取型'
    elif age < 50:
        risk_level = '平衡型'
    else:
        risk_level = '保守型'

    # 根据用户风险偏好微调
    if risk_preference == '激进':
        risk_level = '进取型'
    elif risk_preference == '保守':
        risk_level = '保守型'

    allocation = base_allocation[risk_level]

    # 转换为具体金额
    detailed_allocation = []
    for asset_type, percentage in allocation.items():
        amount = total_assets * percentage
        detailed_allocation.append({
            'assetType': asset_type,
            'percentage': round(percentage * 100, 1),
            'amount': round(amount, 0),
            'recommendation': f"建议配置{round(percentage * 100, 1)}%的{asset_type}"
        })

    return {
        'riskLevel': risk_level,
        'totalAssets': total_assets,
        'allocation': detailed_allocation,
        'monthlyInvestment': round(monthly_income * 0.2, 0)  # 建议每月投资20%的收入
    }

def get_user_profile(metrics):
    """
    使用K-Means聚类算法的结果。
    根据用户的核心指标，将其归类到不同的养老金规划亚型中。
    """
    try:
        # 加载数据用于训练模型
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'pension_mock_500.csv')
        df = pd.read_csv(DATA_PATH, dtype={'用户ID': int})

        # 准备聚类数据 - 使用更多维度进行更准确的聚类
        cluster_features = [
            '年龄', '月工资收入', '经营性收入', '被动收入', '月总流入', '月总流出', '储蓄率',
            '活期存款', '理财产品', '股票基金', '房产估值', '总资产', '净资产',
            '信用卡欠款', '房贷余额', '其他贷款', '总负债', '负债率',
            '养老金账户余额', '缴纳年限', '住房公积金余额', '商业保险年缴', '保险保额',
            '计划退休年龄', '目标养老金', '期望收益率下限', '期望收益率上限',
            '平台月访问次数', '策略采纳率', '交互问答次数', '个性化设置次数', '反馈积极度', '信任评分',
            # 消费行为维度
            '餐饮消费', '衣物消费', '住房消费', '交通消费', '娱乐消费', '教育培训消费',
            '医疗保健消费', '健身运动消费', '旅行度假消费', '数字产品消费', '宠物消费',
            '图书影音消费', '美容护肤消费', '线上购物消费', '线下购物消费', '奢侈品消费',
            '家庭日用品消费', '母婴消费', '绿色环保消费', '慈善捐赠消费'
        ]
        cluster_data = df[cluster_features].fillna(df[cluster_features].mean())
        scaler = StandardScaler()
        cluster_data_scaled = scaler.fit_transform(cluster_data)

        # 训练K-Means模型
        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        kmeans.fit(cluster_data_scaled)

        user_data = pd.DataFrame([metrics])[cluster_features].fillna(df[cluster_features].mean())
        user_scaled = scaler.transform(user_data)
        cluster = kmeans.predict(user_scaled)[0]

        cluster_names = {
            0: "高收入保守型",
            1: "中产平衡型",
            2: "年轻进取型",
            3: "高负债风险型",
            4: "退休保障型"
        }
        return cluster_names.get(cluster, "中产平衡型")
    except Exception as e:
        print(f"Clustering error: {e}")
        # 回退到简单逻辑
        age = metrics.get('年龄', 40)
        income = metrics.get('月工资收入', 10000)
        savings_rate = metrics.get('储蓄率', 0.2)

        if age < 30 and income > 20000:
            return "年轻进取型"
        elif age > 55:
            return "退休保障型"
        elif savings_rate < 0.1:
            return "高负债风险型"
        elif income > 30000:
            return "高收入保守型"
        else:
            return "中产平衡型"

def get_dashboard_analysis(user_id):
    """
    重构后的服务协调函数
    """
    metrics = get_latest_metrics(user_id)
    if not metrics:
        return None

    # 1. 模拟分类聚合，获取用户画像
    user_profile = get_user_profile(metrics)

    # 2. 调用精细化的评分模型
    score_data = calculate_pension_score(metrics)

    # 3. 模拟从情绪日志中提取关键词 (实际应从数据库中获取)
    # 这里我们硬编码一些文本来模拟
    simulated_log_text = {
        1: "今天工作很专注，完成了项目，很有成就感。",
        2: "感觉记忆力下降，有点焦虑，晚上没睡好。",
        3: "考试压力很大，注意力不集中，心情烦躁。"
    }.get(int(user_id), "")

    # 4. 高级风险评估
    risk_assessment = pension_risk_assessment(metrics)

    # 5. 未来趋势预测
    future_trend = predict_future_pension(metrics, days_ahead=28)  # 4周趋势

    # 6. 调用NLP服务生成标签云
    tags_data = generate_tags(user_profile, simulated_log_text)

    # 7. 消费行为分析
    consumption_analysis = analyze_consumption_behavior(metrics)

    # 8. 资产配置建议
    asset_allocation = generate_asset_allocation(metrics)

    # 9. 组装更丰富的前端数据包
    dashboard_data = {
        "userProfile": user_profile,
        "investmentScore": score_data['total_score'],
        "radarData": score_data['radar_data'],
        "futurePrediction": score_data['future_prediction'],
        "riskAssessment": risk_assessment,
        "futureTrend": future_trend,
        "consumptionAnalysis": consumption_analysis,
        "assetAllocation": asset_allocation,
        "keyMetrics": [
            {"name": "月总收入", "value": f"{metrics.get('月总流入', 0):,.0f}", "status": "good" if metrics.get('月总流入', 0) > 10000 else "warning", "unit": "元"},
            {"name": "储蓄率", "value": f"{metrics.get('储蓄率', 0):.1%}", "status": "good" if metrics.get('储蓄率', 0) > 0.2 else "danger", "unit": ""},
            {"name": "总资产", "value": f"{metrics.get('总资产', 0):,.0f}", "status": "good" if metrics.get('总资产', 0) > 1000000 else "warning", "unit": "元"},
            {"name": "净资产", "value": f"{metrics.get('净资产', 0):,.0f}", "status": "good" if metrics.get('净资产', 0) > 500000 else "warning", "unit": "元"},
            {"name": "负债率", "value": f"{metrics.get('负债率', 0):.1%}", "status": "warning" if metrics.get('负债率', 0) > 0.5 else "good", "unit": ""},
            {"name": "月消费总计", "value": f"{sum([metrics.get(cat, 0) for cat in ['餐饮消费', '衣物消费', '住房消费', '交通消费', '娱乐消费', '教育培训消费', '医疗保健消费', '健身运动消费', '旅行度假消费', '数字产品消费', '宠物消费', '图书影音消费', '美容护肤消费', '线上购物消费', '线下购物消费', '奢侈品消费', '家庭日用品消费', '母婴消费', '绿色环保消费', '慈善捐赠消费']]):,.0f}", "status": "warning" if sum([metrics.get(cat, 0) for cat in ['餐饮消费', '衣物消费', '住房消费', '交通消费', '娱乐消费', '教育培训消费', '医疗保健消费', '健身运动消费', '旅行度假消费', '数字产品消费', '宠物消费', '图书影音消费', '美容护肤消费', '线上购物消费', '线下购物消费', '奢侈品消费', '家庭日用品消费', '母婴消费', '绿色环保消费', '慈善捐赠消费']]) > metrics.get('月总流入', 0) * 0.8 else "good", "unit": "元"},
        ],
        "planSnapshot": {
            "completed": metrics.get('task_completed', 0),
            "total": 5 # 假设每天总任务数为5
        },
        "tagCloudData": tags_data
    }

    return dashboard_data