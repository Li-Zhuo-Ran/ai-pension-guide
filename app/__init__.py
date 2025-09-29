
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from .api.dashboard import dashboard_bp
    from .api.future import future_bp
    from .api.recommendation import recommendation_bp
    from .api.assistant import assistant_bp
    from .api.knowledge import knowledge_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(future_bp, url_prefix='/api')
    app.register_blueprint(recommendation_bp, url_prefix='/api')
    app.register_blueprint(assistant_bp, url_prefix='/api')
    app.register_blueprint(knowledge_bp, url_prefix='/api')

    return app