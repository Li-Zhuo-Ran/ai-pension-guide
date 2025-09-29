# backend/app/api/dashboard.py
from flask import Blueprint, jsonify
from app.services.analysis_service import get_dashboard_analysis

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/<int:user_id>', methods=['GET'])
def get_dashboard_data(user_id):
    try:
        data = get_dashboard_analysis(user_id)
        if data is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(data)
    except Exception as e:
        print(f"Error in get_dashboard_data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500