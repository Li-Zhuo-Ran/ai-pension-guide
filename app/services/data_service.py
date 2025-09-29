import pandas as pd
import numpy as np
import os
from typing import Dict, Any
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'pension_mock_500.csv')

try:
    # 用户ID列包含字母前缀，需要特殊处理
    df = pd.read_csv(DATA_PATH)
    # 将用户ID转换为纯数字（去掉U前缀）
    df['用户ID'] = df['用户ID'].str.replace('U', '').astype(int)
except FileNotFoundError:
    print(f"Error: Data file not found at {DATA_PATH}")
    df = pd.DataFrame()

import pandas as pd
import numpy as np
import os
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error

def predict_future_pension(metrics):
    """
    使用XGBoost预测未来养老金积累。
    """
    try:
        # 加载数据用于训练模型
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'pension_mock_500.csv')
        df = pd.read_csv(DATA_PATH)
        # 将用户ID转换为纯数字（去掉U前缀）
        df['用户ID'] = df['用户ID'].str.replace('U', '').astype(int)

        if df.empty:
            return metrics.get('养老金账户余额', 0)

        features = [
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
        target = '养老金账户余额'  # 预测未来养老金积累
        X = df[features].fillna(df[features].mean())
        y = df[target]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler_pred = StandardScaler()
        X_train_scaled = scaler_pred.fit_transform(X_train)
        X_test_scaled = scaler_pred.transform(X_test)
        model = XGBRegressor(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)

        user_data = pd.DataFrame([metrics])[features].fillna(df[features].mean())
        user_scaled = scaler_pred.transform(user_data)
        prediction = model.predict(user_scaled)[0]
        return float(prediction)
    except Exception as e:
        print(f"Prediction error: {e}")
        # 回退到简单逻辑
        current = metrics.get('养老金账户余额', 0)
        age = metrics.get('年龄', 40)
        growth = current * (1 + 0.05) ** (65 - age) if age < 65 else current
        return max(0, growth)

def predict_future_trend_nn(metrics, days_ahead=30):
    """
    使用神经网络预测未来趋势
    """
    try:
        # 加载数据用于训练模型
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'mock_data.csv')
        df = pd.read_csv(DATA_PATH, dtype={'user_id': int})

        if df.empty:
            return [metrics.get('MMSE', 25)] * (days_ahead // 7)

        # 准备时间序列数据
        features = ['age', 'MMSE', 'PHQ9', 'stress_level', 'sleep_hours', 'daily_steps', 'exercise_minutes']
        X = df[features].fillna(df[features].mean())
        y = df['MMSE']

        # 创建时间序列特征
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # 使用神经网络
        nn_model = MLPRegressor(
            hidden_layer_sizes=(100, 50),
            activation='relu',
            solver='adam',
            alpha=0.0001,
            batch_size='auto',
            learning_rate='constant',
            learning_rate_init=0.001,
            max_iter=500,
            random_state=42
        )

        nn_model.fit(X_train_scaled, y_train)

        # 预测未来趋势
        user_data = pd.DataFrame([metrics])[features].fillna(df[features].mean())
        user_scaled = scaler.transform(user_data)

        predictions = []
        current_metrics = metrics.copy()

        for i in range(days_ahead // 7):
            pred = nn_model.predict(user_scaled)[0]
            predictions.append(float(pred))

            # 模拟指标随时间的变化
            current_metrics['年龄'] += 7/365  # 每周增加的年龄
            current_metrics['养老金账户余额'] = max(0, pred * 1.005)  # 轻微增长
            user_data = pd.DataFrame([current_metrics])[features].fillna(df[features].mean())
            user_scaled = scaler.transform(user_data)

        return predictions

    except Exception as e:
        print(f"Neural network prediction error: {e}")
        # 回退到简单趋势
        current = metrics.get('养老金账户余额', 0)
        return [max(0, current * (1 + i * 0.005)) for i in range(days_ahead // 7)]

def pension_risk_assessment(metrics):
    """
    养老金风险评估，基于财务状况
    """
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'pension_mock_500.csv')
        df = pd.read_csv(DATA_PATH, dtype={'用户ID': int})

        if df.empty:
            return {"risk_level": "unknown", "confidence": 0.0}

        # 使用XGBoost进行风险分类
        features = ['年龄', '月工资收入', '月总流入', '储蓄率', '总资产', '净资产', '负债率', '养老金账户余额']
        X = df[features].fillna(df[features].mean())

        # 创建风险标签（基于负债率和储蓄率的简单规则）
        y = ((df['负债率'] > 0.4) | (df['储蓄率'] < 0.1)).astype(int)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        risk_model = XGBRegressor(n_estimators=100, random_state=42)
        risk_model.fit(X_train_scaled, y_train)

        # 预测用户风险
        user_data = pd.DataFrame([metrics])[features].fillna(df[features].mean())
        user_scaled = scaler.transform(user_data)
        risk_score = risk_model.predict(user_scaled)[0]

        # 确定风险等级
        if risk_score > 0.7:
            risk_level = "high"
        elif risk_score > 0.3:
            risk_level = "medium"
        else:
            risk_level = "low"

        return {
            "risk_level": risk_level,
            "risk_score": float(risk_score),
            "confidence": 0.85  # 模型置信度
        }

    except Exception as e:
        print(f"Risk assessment error: {e}")
        return {"risk_level": "unknown", "confidence": 0.0}

def get_latest_metrics(user_id):
    """从CSV中提取指定用户的最新指标。"""
    if df.empty: return None
    user_data = df[df['用户ID'] == int(user_id)]
    if user_data.empty: return None
    # 转换为Python类型，避免numpy类型
    metrics = user_data.iloc[0].to_dict()
    for key, value in metrics.items():
        if hasattr(value, 'item'):  # numpy类型
            metrics[key] = value.item()
        elif isinstance(value, (int, float)):
            metrics[key] = float(value) if isinstance(value, float) else int(value)
    return metrics

# --- 算法辅助函数 ---
def normalize_score(value, min_val, max_val):
    """归一化函数，值越大分数越高"""
    return max(0, min(100, ((value - min_val) / (max_val - min_val)) * 100))

def normalize_inverted_score(value, min_val, max_val):
    """反向归一化，值越小分数越高"""
    return max(0, min(100, (1 - (value - min_val) / (max_val - min_val)) * 100))

# --- 精细化养老金规划评分模型 ---
def calculate_pension_score(metrics):
    """
    根据养老金规划的五大维度，综合多个数据字段计算养老金健康分。
    每个维度都归一化到0-100分。
    """
    # 维度1: 财务基础 (Financial Foundation)
    # 使用 月总流入, 储蓄率, 总资产, 净资产
    income_score = normalize_score(metrics.get('月总流入', 0), 5000, 50000)
    savings_rate_score = normalize_score(metrics.get('储蓄率', 0), 0.1, 0.5)
    total_assets_score = normalize_score(metrics.get('总资产', 0), 100000, 5000000)
    net_assets_score = normalize_score(metrics.get('净资产', 0), 50000, 4000000)
    financial_final_score = (income_score * 0.3) + (savings_rate_score * 0.3) + (total_assets_score * 0.2) + (net_assets_score * 0.2)

    # 维度2: 负债管理 (Debt Management)
    # 使用 负债率, 信用卡欠款, 房贷余额, 其他贷款
    debt_ratio_score = normalize_inverted_score(metrics.get('负债率', 1), 0, 0.5)
    credit_debt_score = normalize_inverted_score(metrics.get('信用卡欠款', 0), 0, 50000)
    mortgage_score = normalize_inverted_score(metrics.get('房贷余额', 0), 0, 2000000)
    other_loans_score = normalize_inverted_score(metrics.get('其他贷款', 0), 0, 500000)
    debt_final_score = (debt_ratio_score * 0.4) + (credit_debt_score * 0.2) + (mortgage_score * 0.2) + (other_loans_score * 0.2)

    # 维度3: 投资配置 (Investment Allocation)
    # 使用 理财产品, 股票基金, 养老金账户余额, 商业保险年缴
    wealth_management_score = normalize_score(metrics.get('理财产品', 0), 0, 2000000)
    stock_fund_score = normalize_score(metrics.get('股票基金', 0), 0, 1000000)
    pension_balance_score = normalize_score(metrics.get('养老金账户余额', 0), 0, 500000)
    insurance_score = normalize_score(metrics.get('商业保险年缴', 0), 0, 50000)
    investment_final_score = (wealth_management_score * 0.3) + (stock_fund_score * 0.3) + (pension_balance_score * 0.2) + (insurance_score * 0.2)

    # 维度4: 风险偏好与规划 (Risk Preference & Planning)
    # 使用 风险偏好, 计划退休年龄, 目标养老金, 期望收益率
    risk_preference_map = {'保守': 20, '稳健': 50, '平衡': 70, '积极': 85, '激进': 95}
    risk_score = risk_preference_map.get(metrics.get('风险偏好', '平衡'), 70)
    retirement_age_score = normalize_inverted_score(metrics.get('计划退休年龄', 65), 55, 70)  # 越早退休越好？
    target_pension_score = normalize_score(metrics.get('目标养老金', 0), 1000000, 5000000)
    expected_return_score = normalize_score((metrics.get('期望收益率下限', 0) + metrics.get('期望收益率上限', 0)) / 2, 0.02, 0.15)
    planning_final_score = (risk_score * 0.3) + (retirement_age_score * 0.2) + (target_pension_score * 0.3) + (expected_return_score * 0.2)

    # 维度5: 行为与参与度 (Behavior & Engagement)
    # 使用 平台月访问次数, 策略采纳率, 交互问答次数, 反馈积极度, 信任评分
    visit_score = normalize_score(metrics.get('平台月访问次数', 0), 5, 30)
    adoption_score = normalize_score(metrics.get('策略采纳率', 0), 0.3, 1.0)
    interaction_score = normalize_score(metrics.get('交互问答次数', 0), 5, 40)
    feedback_score = normalize_score(metrics.get('反馈积极度', 0), 0.3, 1.0)
    trust_score = normalize_score(metrics.get('信任评分', 0), 30, 100)
    behavior_final_score = (visit_score * 0.2) + (adoption_score * 0.25) + (interaction_score * 0.2) + (feedback_score * 0.15) + (trust_score * 0.2)

    # 总分加权
    weights = {'financial': 0.3, 'debt': 0.25, 'investment': 0.2, 'planning': 0.15, 'behavior': 0.1}
    total_score = (financial_final_score * weights['financial'] +
                   debt_final_score * weights['debt'] +
                   investment_final_score * weights['investment'] +
                   planning_final_score * weights['planning'] +
                   behavior_final_score * weights['behavior'])

    return {
        "total_score": int(total_score),
        "radar_data": {
            "categories": ["财务基础", "负债管理", "投资配置", "风险规划", "行为参与"],
            "values": [int(financial_final_score), int(debt_final_score), int(investment_final_score), int(planning_final_score), int(behavior_final_score)]
        },
        "future_prediction": predict_future_pension(metrics)
    }



def update_user_metrics(user_id: int, updates: Dict[str, Any]) -> bool:
    """
    更新用户的健康指标
    """
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'mock_data.csv')
        df = pd.read_csv(DATA_PATH, dtype={'user_id': int})

        # 查找用户数据
        user_mask = df['user_id'] == user_id
        if not user_mask.any():
            # 如果用户不存在，创建新记录
            new_row = {
                'user_id': user_id,
                'age': 40,
                'MMSE': 25,
                'PHQ9': 5,
                'stress_level': 3,
                'sleep_hours': 7,
                'daily_steps': 5000,
                'exercise_minutes': 30,
                'mood_score': 5,
                'fatigue_level': 3,
                'cognitive_symptoms': 0,
                'alcohol_consumption': 0,
                'sleep_quality': 3
            }
            # 更新新记录
            for key, value in updates.items():
                if key in new_row:
                    new_row[key] = value
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        else:
            # 更新现有记录
            for key, value in updates.items():
                if key in df.columns:
                    df.loc[user_mask, key] = value

        # 保存更新后的数据
        df.to_csv(DATA_PATH, index=False)
        return True
    except Exception as e:
        print(f"Error updating user metrics: {e}")
        return False