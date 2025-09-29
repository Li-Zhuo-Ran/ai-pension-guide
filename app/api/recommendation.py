# backend/app/api/recommendation.py
from flask import Blueprint, jsonify
from app.services.recommendation_service import (
    generate_personalized_recommendations,
    get_recommendation_progress,
    update_recommendation_progress
)
from app.services.analysis_service import get_user_profile
from app.services.data_service import get_latest_metrics

recommendation_bp = Blueprint('recommendation', __name__)

@recommendation_bp.route('/recommendation/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        metrics = get_latest_metrics(user_id)
        if not metrics:
            return jsonify({"error": "User not found"}), 404

        user_profile = get_user_profile(metrics)
        recommendations = generate_personalized_recommendations(user_profile, metrics)

        return jsonify(recommendations)
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@recommendation_bp.route('/recommendation/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    try:
        progress = get_recommendation_progress(user_id)
        return jsonify(progress)
    except Exception as e:
        print(f"Error in get_progress: {e}")
        return jsonify({"error": str(e)}), 500

@recommendation_bp.route('/recommendation/progress/<int:user_id>/<task_id>', methods=['PUT'])
def update_progress(user_id, task_id):
    try:
        # 简化处理，实际应从请求体获取completed状态
        success = update_recommendation_progress(user_id, task_id, True)
        return jsonify({"success": success})
    except Exception as e:
        print(f"Error in update_progress: {e}")
        return jsonify({"error": str(e)}), 500