# backend/app/api/knowledge.py
from flask import Blueprint, request, jsonify
from app.services.knowledge_graph_service import (
    get_brain_region_info,
    search_knowledge,
    get_knowledge_recommendations,
    get_all_entities,
    get_entity_relations
)
from app.services.data_service import get_latest_metrics

knowledge_bp = Blueprint('knowledge', __name__)

@knowledge_bp.route('/knowledge/brain-region/<region_name>', methods=['GET'])
def get_brain_region(region_name):
    try:
        info = get_brain_region_info(region_name)
        if not info:
            return jsonify({"error": "Brain region not found"}), 404
        return jsonify(info)
    except Exception as e:
        print(f"Error in get_brain_region: {e}")
        return jsonify({"error": str(e)}), 500

@knowledge_bp.route('/knowledge/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({"error": "Query parameter 'q' is required"}), 400

        results = search_knowledge(query)
        return jsonify(results)
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({"error": str(e)}), 500

@knowledge_bp.route('/knowledge/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        metrics = get_latest_metrics(user_id)
        if not metrics:
            return jsonify({"error": "User not found"}), 404

        recommendations = get_knowledge_recommendations(metrics)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return jsonify({"error": str(e)}), 500

@knowledge_bp.route('/knowledge/entities', methods=['GET'])
def get_entities():
    try:
        entities = get_all_entities()
        return jsonify({"entities": entities})
    except Exception as e:
        print(f"Error in get_entities: {e}")
        return jsonify({"error": str(e)}), 500

@knowledge_bp.route('/knowledge/relations/<entity_name>', methods=['GET'])
def get_relations(entity_name):
    try:
        relations = get_entity_relations(entity_name)
        return jsonify({"relations": relations})
    except Exception as e:
        print(f"Error in get_relations: {e}")
        return jsonify({"error": str(e)}), 500