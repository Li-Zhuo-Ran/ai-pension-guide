import pandas as pd
import numpy as np
import os
from typing import Dict, Any
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# --- 文件路径和数据加载 ---
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, '..', '..','data', 'pension_500.csv')
    df = pd.read_csv(DATA_PATH)
    if '用户ID' in df.columns and pd.api.types.is_string_dtype(df['用户ID']):
        df['用户ID'] = df['用户ID'].str.replace('U', '').astype(int)
except FileNotFoundError:
    print(f"错误：在路径 {DATA_PATH} 未找到数据文件。")
    df = pd.DataFrame()
except Exception as e:
    print(f"加载数据时出错: {e}")
    df = pd.DataFrame()


# 机器学习与预测函数
def predict_future_pension(metrics: Dict[str, Any]) -> float:
    if df.empty:
        current = metrics.get('养老金账户余额', 0)
        age = metrics.get('年龄', 40)
        growth = current * (1 + 0.05) ** (max(0, 60 - age))
        return max(0, growth)
    try:
        features = [
            '年龄', '月工资收入', '经营性收入', '被动收入', '月总流入', '月总流出', 
            '储蓄率', '活期存款', '定期/理财产品', '股票基金市值', '房产估值', '总资产', 
            '净资产', '信用卡欠款', '房贷余额', '其他贷款', '总负债', '负债率',
            '养老金账户余额', '缴纳年限', '住房公积金余额', '商业保险年缴', '保险保额',
            '计划退休年龄', '目标养老金', '期望退休后的月开销'
        ]
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0
        target = '养老金账户余额'
        X = df[features].fillna(df[features].mean())
        y = df[target]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        model = XGBRegressor(n_estimators=100, random_state=42, objective='reg:squarederror')
        model.fit(X_train_scaled, y_train)
        user_data = pd.DataFrame([metrics])
        user_data = user_data.reindex(columns=features).fillna(df[features].mean())
        user_scaled = scaler.transform(user_data)
        prediction = model.predict(user_scaled)[0]
        return float(prediction)
    except Exception as e:
        print(f"养老金预测出错: {e}")
        current = metrics.get('养老金账户余额', 0)
        age = metrics.get('年龄', 40)
        growth = current * (1 + 0.05) ** (max(0, 60 - age))
        return max(0, growth)

def pension_risk_assessment(metrics: Dict[str, Any]) -> Dict[str, Any]:
    if df.empty:
        return {"risk_level": "未知", "risk_score": 0.0, "confidence": 0.0}
    try:
        features = ['年龄', '月工资收入', '月总流入', '储蓄率', '总资产', '净资产', '负债率', '养老金账户余额']
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0
        X = df[features].fillna(df[features].mean())
        y = ((df['负债率'] > 0.5) | (df['储蓄率'] < 0.15)).astype(int)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        risk_model = XGBRegressor(n_estimators=100, random_state=42, objective='binary:logistic')
        risk_model.fit(X_train_scaled, y_train)
        user_data = pd.DataFrame([metrics])
        user_data = user_data.reindex(columns=features).fillna(df[features].mean())
        user_scaled = scaler.transform(user_data)
        risk_score = risk_model.predict(user_scaled)[0]
        if risk_score > 0.7:
            risk_level = "高"
        elif risk_score > 0.3:
            risk_level = "中"
        else:
            risk_level = "低"
        return {"risk_level": risk_level, "risk_score": float(risk_score), "confidence": 0.85}
    except Exception as e:
        print(f"风险评估出错: {e}")
        return {"risk_level": "未知", "risk_score": 0.0, "confidence": 0.0}

# --- 数据提取与辅助函数 (与之前版本相同) ---
def get_latest_metrics(user_id: int) -> Dict[str, Any]:
    if df.empty: return None
    try:
        user_data = df[df['用户ID'] == int(user_id)]
        if user_data.empty: return None
        metrics = user_data.iloc[0].to_dict()
        for key, value in metrics.items():
            if isinstance(value, np.generic):
                metrics[key] = value.item()
        return metrics
    except Exception as e:
        print(f"获取用户 {user_id} 数据时出错: {e}")
        return None

def normalize_score(value, min_val, max_val):
    if max_val == min_val: return 50.0
    score = ((value - min_val) / (max_val - min_val)) * 100
    return max(0, min(100, score))

def normalize_inverted_score(value, min_val, max_val):
    if max_val == min_val: return 50.0
    score = (1 - (value - min_val) / (max_val - min_val)) * 100
    return max(0, min(100, score))


# 蒙特卡洛模拟函数
def run_monte_carlo_simulation(
    current_investments: float,
    target_goal: float,
    years_to_retire: int,
    expected_return: float,
    risk_preference: str,
    num_simulations: int = 10000
) -> float:
    """
    执行蒙特卡洛模拟，预测达成养老金目标的成功概率。

    :param current_investments: 当前用于投资的总额 (例如, 股票+基金+理财产品)
    :param target_goal: 目标养老金
    :param years_to_retire: 距离退休的年限
    :param expected_return: 期望的年化收益率
    :param risk_preference: 风险偏好 ('保守', '稳健', '平衡', '积极', '激进')
    :param num_simulations: 模拟次数
    :return: 达成目标的成功概率 (0.0 to 1.0)
    """
    # 1. 根据风险偏好设定年化波动率 (标准差)
    volatility_map = {'保守': 0.04, '稳健': 0.07, '平衡': 0.11, '积极': 0.16, '激进': 0.22}
    volatility = volatility_map.get(risk_preference, 0.11) # 默认为平衡型

    # 准备模拟
    final_values = []
    
    # 2. 循环进行上万次模拟
    for _ in range(num_simulations):
        yearly_returns = np.random.normal(expected_return, volatility, years_to_retire)
        final_value = current_investments * np.prod(1 + yearly_returns)
        final_values.append(final_value)
    
    # 3. 计算有多少次模拟的最终金额达到了目标
    successful_simulations = [value for value in final_values if value >= target_goal]
    success_probability = len(successful_simulations) / num_simulations
    
    return success_probability

# --- 核心评分模型 ---
def get_weights_by_age(age: int) -> dict:
    if age <= 35:
        return {'financial': 0.40, 'debt': 0.30, 'investment': 0.10, 'planning': 0.15, 'behavior': 0.05}
    elif age <= 55:
        return {'financial': 0.25, 'debt': 0.20, 'investment': 0.30, 'planning': 0.20, 'behavior': 0.05}
    else:
        return {'financial': 0.20, 'debt': 0.15, 'investment': 0.35, 'planning': 0.25, 'behavior': 0.05}


def calculate_pension_score(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    最终版评分模型：结合了动态权重与前瞻性的蒙特卡洛模拟。
    """
    # === 维度1, 2, 4, 5 
    # 维度1: 财务基础
    income_score = normalize_score(metrics.get('月总流入', 0), 5000, 50000)
    savings_rate_score = normalize_score(metrics.get('储蓄率', 0), 0.1, 0.5)
    total_assets_score = normalize_score(metrics.get('总资产', 0), 100000, 5000000)
    net_assets_score = normalize_score(metrics.get('净资产', 0), 50000, 4000000)
    financial_score = (income_score * 0.3) + (savings_rate_score * 0.3) + (total_assets_score * 0.2) + (net_assets_score * 0.2)
    # 维度2: 负债管理
    debt_ratio_score = normalize_inverted_score(metrics.get('负债率', 1), 0, 0.5)
    credit_debt_score = normalize_inverted_score(metrics.get('信用卡欠款', 0), 0, 50000)
    mortgage_score = normalize_inverted_score(metrics.get('房贷余额', 0), 0, 2000000)
    other_loans_score = normalize_inverted_score(metrics.get('其他贷款', 0), 0, 500000)
    debt_score = (debt_ratio_score * 0.4) + (credit_debt_score * 0.2) + (mortgage_score * 0.2) + (other_loans_score * 0.2)
    # 维度4: 风险与规划
    risk_preference_map = {'保守': 20, '稳健': 50, '平衡': 70, '积极': 85, '激进': 95}
    risk_score = risk_preference_map.get(metrics.get('风险偏好', '平衡'), 70)
    retirement_age_score = normalize_inverted_score(metrics.get('计划退休年龄', 60), 55, 65)
    target_pension_score = normalize_score(metrics.get('目标养老金', 0), 1000000, 5000000)
    exp_return_avg = (metrics.get('期望收益率下限', 0.03) + metrics.get('期望收益率上限', 0.08)) / 2
    expected_return_score = normalize_score(exp_return_avg, 0.02, 0.15)
    planning_score = (risk_score * 0.3) + (retirement_age_score * 0.2) + (target_pension_score * 0.3) + (expected_return_score * 0.2)
    # 维度5: 行为与参与度
    visit_freq_map = {'低': 20, '中': 60, '高': 90}
    strategy_adopt_map = {'未采纳': 10, '考虑中': 40, '部分采纳': 70, '完全采纳': 100}
    content_interact_map = {'较少': 20, '偶尔': 50, '经常': 85}
    visit_score = visit_freq_map.get(metrics.get('访问频率', '中'), 60)
    adoption_score = strategy_adopt_map.get(metrics.get('策略采纳情况', '考虑中'), 40)
    interaction_score = content_interact_map.get(metrics.get('内容互动情况', '偶尔'), 50)
    behavior_score = (visit_score * 0.3) + (adoption_score * 0.4) + (interaction_score * 0.3)
    
    # ==================== 维度3: 投资配置 (集成蒙特卡洛模拟) ====================
    # 1. 准备模拟所需参数
    current_investments = (
        metrics.get('定期/理财产品', 0) + 
        metrics.get('股票基金市值', 0) + 
        metrics.get('养老金账户余额', 0)
    )
    target_goal = metrics.get('目标养老金', 1000000)
    years_to_retire = max(1, metrics.get('计划退休年龄', 60) - metrics.get('年龄', 40))
    expected_return = (metrics.get('期望收益率下限', 0.03) + metrics.get('期望收益率上限', 0.08)) / 2
    risk_preference = metrics.get('风险偏好', '平衡')

    # 2. 执行蒙特卡洛模拟，得到成功概率
    success_probability = run_monte_carlo_simulation(
        current_investments, target_goal, years_to_retire, expected_return, risk_preference
    )
    # 将成功概率转换为0-100的分数
    monte_carlo_score = success_probability * 100

    # 3. 计算投资组合的静态得分 (与之前类似)
    wealth_management_score = normalize_score(metrics.get('定期/理财产品', 0), 10000, 500000)
    stock_fund_score = normalize_score(metrics.get('股票基金市值', 0), 10000, 500000)
    
    # 4. 结合静态得分和前瞻性的蒙特卡洛得分
    # 给予蒙特卡洛得分极高的权重 (例如60%)，因为它更能反映未来的可能性
    investment_score = (
        monte_carlo_score * 0.6 + 
        wealth_management_score * 0.2 + 
        stock_fund_score * 0.2
    )
    
    # ==================== 总分计算 (使用动态权重) ====================
    user_age = metrics.get('年龄', 40)
    weights = get_weights_by_age(user_age)
    
    total_score = (
        financial_score * weights['financial'] +
        debt_score * weights['debt'] +
        investment_score * weights['investment'] +
        planning_score * weights['planning'] +
        behavior_score * weights['behavior']
    )

    return {
        "total_score": int(total_score),
        "radar_data": {
            "categories": ["财务基础", "负债管理", "投资配置", "风险规划", "行为参与"],
            "values": [int(financial_score), int(debt_score), int(investment_score), int(planning_score), int(behavior_score)]
        },
        "simulation_data": {
            "success_probability": round(success_probability, 2), # 达成目标的成功概率
            "monte_carlo_score": int(monte_carlo_score)
        },
        "applied_weights": weights,
        "future_prediction": predict_future_pension(metrics),
        "risk_assessment": pension_risk_assessment(metrics)
    }

from sklearn.neural_network import MLPRegressor
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
