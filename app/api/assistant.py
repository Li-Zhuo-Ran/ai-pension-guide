# backend/app/api/assistant.py
from flask import Blueprint, request, jsonify
from app.services.nlp_service import process_user_message, extract_health_info
from app.services.analysis_service import get_user_profile
from app.services.data_service import get_latest_metrics, update_user_metrics
import speech_recognition as sr
import io
import base64

assistant_bp = Blueprint('assistant', __name__)

@assistant_bp.route('/assistant/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400

        user_id = data.get('user_id', 1)
        message = data['message']

        # 获取用户画像
        metrics = get_latest_metrics(user_id)
        if not metrics:
            return jsonify({"error": "User not found"}), 404

        user_profile = get_user_profile(metrics)

        # 处理消息
        result = process_user_message(message, user_profile)

        # 从对话中提取健康信息并更新画像
        health_info = extract_health_info(message)
        if health_info:
            update_user_metrics(user_id, health_info)
            # 重新计算画像
            updated_metrics = get_latest_metrics(user_id)
            updated_profile = get_user_profile(updated_metrics)
            result['updated_profile'] = updated_profile

        return jsonify(result)
    except Exception as e:
        print(f"Error in chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def speech_to_text(audio_data):
    """将语音数据转换为文本"""
    try:
        recognizer = sr.Recognizer()
        # 假设audio_data是base64编码的音频
        audio_bytes = base64.b64decode(audio_data)
        audio = sr.AudioData(audio_bytes, sample_rate=16000, sample_width=2)

        text = recognizer.recognize_google(audio, language='zh-CN')
        return text
    except Exception as e:
        print(f"Speech recognition error: {e}")
        return None

@assistant_bp.route('/assistant/voice-chat', methods=['POST'])
def voice_chat():
    """处理语音输入的健康对话"""
    try:
        data = request.get_json()
        if not data or 'audio' not in data:
            return jsonify({"error": "Audio data is required"}), 400

        user_id = data.get('user_id', 1)
        audio_data = data['audio']

        # 语音转文本
        message = speech_to_text(audio_data)
        if not message:
            return jsonify({"error": "Speech recognition failed"}), 400

        # 获取用户画像
        metrics = get_latest_metrics(user_id)
        if not metrics:
            return jsonify({"error": "User not found"}), 404

        user_profile = get_user_profile(metrics)

        # 处理消息
        result = process_user_message(message, user_profile)

        # 从对话中提取健康信息并更新画像
        health_info = extract_health_info(message)
        if health_info:
            update_user_metrics(user_id, health_info)
            # 重新计算画像
            updated_metrics = get_latest_metrics(user_id)
            updated_profile = get_user_profile(updated_metrics)
            result['updated_profile'] = updated_profile

        result['recognized_text'] = message
        return jsonify(result)
    except Exception as e:
        print(f"Error in voice chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@assistant_bp.route('/assistant/history/<int:user_id>', methods=['GET'])
def get_chat_history(user_id):
    try:
        # 模拟聊天历史，实际应用中应从数据库获取
        history = [
            {
                'id': 1,
                'message': '我最近感觉记忆力下降了',
                'response': '我理解您的担忧。记忆力问题可能是多种因素造成的。建议您记录一下具体的情况，比如什么时候出现的问题，有没有伴随其他症状。同时，保持规律的作息和适量的运动对大脑健康很有帮助。',
                'timestamp': '2024-01-01T10:00:00Z',
                'intent': 'symptom_report',
                'sentiment': 'negative'
            },
            {
                'id': 2,
                'message': '谢谢你的建议，我会试试的',
                'response': '不客气！记住，健康管理是一个持续的过程。如果您有任何新的情况或需要更多建议，都可以随时告诉我。我会一直在这里支持您。',
                'timestamp': '2024-01-01T10:05:00Z',
                'intent': 'general_chat',
                'sentiment': 'positive'
            }
        ]
        return jsonify({"history": history})
    except Exception as e:
        print(f"Error in get_chat_history: {e}")
        return jsonify({"error": str(e)}), 500