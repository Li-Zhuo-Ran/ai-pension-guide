"""
智能投资顾问知识图谱服务
包含金融维度相关的实体、关系和推理算法
"""

from typing import Dict, List, Any, Optional
import json
import os

class FinancialKnowledgeGraph:
    def __init__(self):
        self.entities = {}  # 实体存储
        self.relations = []  # 关系存储
        self.rules = []     # 推理规则
        self._initialize_knowledge_base()

    def _initialize_knowledge_base(self):
        """初始化金融知识库"""

        # 核心金融维度
        financial_dimensions = {
            "财务基础": {
                "type": "financial_dimension",
                "functions": ["资产管理", "现金流控制", "财务记录"],
                "related_risks": ["现金流不足", "财务记录混乱", "资产配置不当"],
                "risk_factors": ["收入不稳定", "支出无规划", "缺乏财务知识"]
            },
            "债务管理": {
                "type": "financial_dimension",
                "functions": ["债务优化", "利息控制", "偿还规划"],
                "related_risks": ["高息债务", "债务雪球", "信用受损"],
                "risk_factors": ["过度消费", "紧急借贷", "利率上升"]
            },
            "投资配置": {
                "type": "financial_dimension",
                "functions": ["资产分配", "多元化投资", "风险平衡"],
                "related_risks": ["过度集中", "市场波动", "投资时机不当"],
                "risk_factors": ["投资知识不足", "市场情绪影响", "缺乏长期规划"]
            },
            "风险规划": {
                "type": "financial_dimension",
                "functions": ["保险保障", "应急基金", "风险对冲"],
                "related_risks": ["保障不足", "意外损失", "市场风险暴露"],
                "risk_factors": ["忽视保险", "应急准备不足", "风险评估不当"]
            },
            "消费行为": {
                "type": "financial_dimension",
                "functions": ["消费分析", "预算控制", "价值优化"],
                "related_risks": ["冲动消费", "生活成本过高", "储蓄不足"],
                "risk_factors": ["消费习惯不良", "生活方式升级", "社会压力影响"]
            },
            "收入结构": {
                "type": "financial_dimension",
                "functions": ["收入来源多样化", "被动收入建设", "收入增长规划"],
                "related_risks": ["收入单一", "增长停滞", "通胀侵蚀"],
                "risk_factors": ["技能单一", "就业不稳定", "缺乏副业"]
            }
        }

        # 投资策略
        investment_strategies = {
            "定期定额投资": {
                "type": "investment_strategy",
                "category": "长期投资",
                "target_dimensions": ["投资配置", "财务基础"],
                "expected_outcomes": ["降低市场风险", "培养投资习惯", "实现复利增长"],
                "evidence_level": "高",
                "recommended_duration": "长期持有"
            },
            "资产配置优化": {
                "type": "investment_strategy",
                "category": "资产管理",
                "target_dimensions": ["投资配置", "风险规划"],
                "expected_outcomes": ["风险分散", "收益稳定", "适应市场变化"],
                "evidence_level": "高",
                "recommended_duration": "每年调整"
            },
            "债务重组策略": {
                "type": "investment_strategy",
                "category": "债务管理",
                "target_dimensions": ["债务管理", "财务基础"],
                "expected_outcomes": ["降低利息支出", "改善现金流", "提升信用评分"],
                "evidence_level": "中等",
                "recommended_duration": "3-6个月"
            },
            "消费习惯优化": {
                "type": "investment_strategy",
                "category": "消费管理",
                "target_dimensions": ["消费行为", "财务基础"],
                "expected_outcomes": ["增加储蓄", "减少不必要支出", "提升生活质量"],
                "evidence_level": "高",
                "recommended_duration": "持续改进"
            },
            "保险保障完善": {
                "type": "investment_strategy",
                "category": "风险管理",
                "target_dimensions": ["风险规划", "财务基础"],
                "expected_outcomes": ["降低财务风险", "保障家庭安全", "安心投资"],
                "evidence_level": "高",
                "recommended_duration": "定期审视"
            },
            "副业收入开发": {
                "type": "investment_strategy",
                "category": "收入增长",
                "target_dimensions": ["收入结构", "财务基础"],
                "expected_outcomes": ["增加收入来源", "提升财务自由度", "实现财务目标"],
                "evidence_level": "中等",
                "recommended_duration": "长期发展"
            }
        }

        # 合并所有实体
        self.entities.update(financial_dimensions)
        self.entities.update(investment_strategies)

        # 定义关系
        self.relations = [
            {"from": "财务基础", "to": "现金流不足", "type": "causes_risk"},
            {"from": "债务管理", "to": "高息债务", "type": "causes_risk"},
            {"from": "投资配置", "to": "过度集中", "type": "causes_risk"},
            {"from": "风险规划", "to": "保障不足", "type": "causes_risk"},
            {"from": "消费行为", "to": "冲动消费", "type": "causes_risk"},
            {"from": "收入结构", "to": "收入单一", "type": "causes_risk"},
            {"from": "定期定额投资", "to": "投资配置", "type": "benefits_dimension"},
            {"from": "资产配置优化", "to": "投资配置", "type": "benefits_dimension"},
            {"from": "债务重组策略", "to": "债务管理", "type": "benefits_dimension"},
            {"from": "消费习惯优化", "to": "消费行为", "type": "benefits_dimension"},
            {"from": "保险保障完善", "to": "风险规划", "type": "benefits_dimension"},
            {"from": "副业收入开发", "to": "收入结构", "type": "benefits_dimension"}
        ]

        # 推理规则
        self.rules = [
            {
                "name": "高债务风险干预规则",
                "condition": lambda profile: profile.get('debt_ratio', 0) > 0.4,
                "recommendations": ["债务重组策略", "消费习惯优化", "资产配置优化"]
            },
            {
                "name": "投资知识不足干预规则",
                "condition": lambda profile: profile.get('investment_knowledge', 0) < 3,
                "recommendations": ["定期定额投资", "资产配置优化", "保险保障完善"]
            },
            {
                "name": "消费过度干预规则",
                "condition": lambda profile: profile.get('consumption_ratio', 0) > 0.8,
                "recommendations": ["消费习惯优化", "债务重组策略", "副业收入开发"]
            }
        ]

    def get_entity(self, entity_name: str) -> Optional[Dict[str, Any]]:
        """获取实体信息"""
        return self.entities.get(entity_name)

    def get_related_entities(self, entity_name: str, relation_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """获取相关实体"""
        related = []
        for relation in self.relations:
            if relation["from"] == entity_name or relation["to"] == entity_name:
                if relation_type is None or relation["type"] == relation_type:
                    related_entity = relation["to"] if relation["from"] == entity_name else relation["from"]
                    if related_entity in self.entities:
                        related.append({
                            "entity": self.entities[related_entity],
                            "relation": relation
                        })
        return related

    def infer_recommendations(self, user_profile: Dict[str, Any]) -> List[str]:
        """基于用户画像推理推荐"""
        recommendations = []
        for rule in self.rules:
            if rule["condition"](user_profile):
                recommendations.extend(rule["recommendations"])
        return list(set(recommendations))  # 去重

    def search_knowledge(self, query: str) -> Dict[str, Any]:
        """搜索知识库"""
        results = {
            "entities": [],
            "relations": [],
            "recommendations": []
        }

        # 搜索实体
        for name, entity in self.entities.items():
            if query.lower() in name.lower() or query.lower() in str(entity).lower():
                results["entities"].append({"name": name, "data": entity})

        # 搜索关系
        for relation in self.relations:
            if query.lower() in relation["from"].lower() or query.lower() in relation["to"].lower():
                results["relations"].append(relation)

        return results

    def get_brain_region_info(self, region_name: str) -> Optional[Dict[str, Any]]:
        """获取金融维度详细信息"""
        entity = self.get_entity(region_name)
        if entity and entity.get("type") == "financial_dimension":
            related_risks = self.get_related_entities(region_name, "causes_risk")
            beneficial_strategies = self.get_related_entities(region_name, "benefits_dimension")

            return {
                "basic_info": entity,
                "related_risks": [r["entity"] for r in related_risks],
                "beneficial_strategies": [r["entity"] for r in beneficial_strategies]
            }
        return None

# 全局知识图谱实例
knowledge_graph = FinancialKnowledgeGraph()

def get_brain_region_info(region_name: str) -> Optional[Dict[str, Any]]:
    """获取脑区信息"""
    return knowledge_graph.get_brain_region_info(region_name)

def search_knowledge(query: str) -> Dict[str, Any]:
    """搜索知识"""
    return knowledge_graph.search_knowledge(query)

def get_knowledge_recommendations(user_profile: Dict[str, Any]) -> List[str]:
    """获取知识推理推荐"""
    return knowledge_graph.infer_recommendations(user_profile)

def get_all_entities() -> Dict[str, Any]:
    """获取所有实体"""
    return knowledge_graph.entities

def get_entity_relations(entity_name: str) -> List[Dict[str, Any]]:
    """获取实体关系"""
    return knowledge_graph.get_related_entities(entity_name)