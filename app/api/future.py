from flask import Blueprint, jsonify, request
from app.services.future_service import get_future_insights, simulate_future

future_bp = Blueprint('future', __name__)


@future_bp.route('/future-insights/<int:user_id>', methods=['GET'])
def api_get_future(user_id):
    try:
        data = get_future_insights(user_id)
        if data is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@future_bp.route('/future-insights/<int:user_id>/simulate', methods=['POST'])
def api_simulate_future(user_id):
    try:
        payload = request.get_json(silent=True) or {}
        data = simulate_future(user_id, payload)
        if data is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
