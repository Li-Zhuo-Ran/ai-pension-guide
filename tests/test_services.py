"""
测试套件
"""
import unittest
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.data_service import get_latest_metrics, calculate_pension_score
from app.services.analysis_service import get_user_profile
from app.services.nlp_service import analyze_intent, analyze_sentiment
from app.services.knowledge_graph_service import search_knowledge

class TestDataService(unittest.TestCase):
    """测试数据服务"""

    def test_get_latest_metrics(self):
        """测试获取用户最新指标"""
        metrics = get_latest_metrics(1)
        self.assertIsInstance(metrics, dict)
        self.assertIn('月工资收入', metrics)

    def test_calculate_pension_score(self):
        """测试养老金评分计算"""
        test_metrics = {
            'monthly_income': 15000,
            'monthly_expenses': 8000,
            'savings_rate': 0.3,
            'current_savings': 200000,
            'investment_amount': 50000,
            'debt_amount': 100000,
            'age': 35,
            'retirement_age': 60,
            'risk_tolerance': 0.7
        }

        score_data = calculate_pension_score(test_metrics)
        self.assertIsInstance(score_data, dict)
        self.assertIn('total_score', score_data)
        self.assertIn('radar_data', score_data)
        self.assertGreater(score_data['total_score'], 0)
        self.assertLessEqual(score_data['total_score'], 100)

class TestAnalysisService(unittest.TestCase):
    """测试分析服务"""

    def test_get_user_profile(self):
        """测试用户画像分析"""
        test_metrics = {
            '年龄': 35,
            '月工资收入': 15000,
            '储蓄率': 0.3,
            '总资产': 300000,
            '净资产': 200000,
            '负债率': 0.2,
            '养老金账户余额': 50000
        }

        profile = get_user_profile(test_metrics)
        self.assertIsInstance(profile, str)
        self.assertIn(profile, [
            "高收入保守型", "中产平衡型", "年轻进取型",
            "高负债风险型", "退休保障型"
        ])

class TestNLPService(unittest.TestCase):
    """测试NLP服务"""

    def test_analyze_intent(self):
        """测试意图识别"""
        test_message = "我最近感觉记忆力下降了，有点担心"
        result = analyze_intent(test_message)

        self.assertIsInstance(result, dict)
        self.assertIn('intent', result)
        self.assertIn('confidence', result)
        self.assertGreaterEqual(result['confidence'], 0)
        self.assertLessEqual(result['confidence'], 1)

    def test_analyze_sentiment(self):
        """测试情感分析"""
        test_message = "我今天感觉很好，工作很顺利"
        result = analyze_sentiment(test_message)

        self.assertIsInstance(result, dict)
        self.assertIn('sentiment', result)
        self.assertIn('score', result)
        self.assertIn(result['sentiment'], ['positive', 'negative', 'neutral'])

class TestKnowledgeGraph(unittest.TestCase):
    """测试知识图谱"""

    def test_search_knowledge(self):
        """测试知识搜索"""
        results = search_knowledge("前额叶")
        self.assertIsInstance(results, dict)
        self.assertIn('entities', results)

    def test_brain_region_info(self):
        """测试脑区信息获取"""
        from app.services.knowledge_graph_service import get_brain_region_info
        info = get_brain_region_info("前额叶")
        if info:  # 如果知识图谱中有数据
            self.assertIsInstance(info, dict)
            self.assertIn('basic_info', info)

class TestIntegration(unittest.TestCase):
    """集成测试"""

    def test_full_analysis_pipeline(self):
        """测试完整分析流程"""
        # 获取用户数据
        metrics = get_latest_metrics(1)
        self.assertIsNotNone(metrics)

        # 用户画像分析
        profile = get_user_profile(metrics)
        self.assertIsInstance(profile, str)

        # 养老金评分
        score_data = calculate_pension_score(metrics)
        self.assertIsInstance(score_data, dict)

        # NLP分析
        test_message = "我感觉不错，但有点累"
        intent = analyze_intent(test_message)
        sentiment = analyze_sentiment(test_message)

        self.assertIsInstance(intent, dict)
        self.assertIsInstance(sentiment, dict)

if __name__ == '__main__':
    # 运行所有测试
    unittest.main(verbosity=2)