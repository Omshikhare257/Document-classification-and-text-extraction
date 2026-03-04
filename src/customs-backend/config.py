import os
from datetime import timedelta

class Config:
    """Base configuration"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ultra-secure-customs-analyzer-key-2024'
    DEBUG = False
    TESTING = False
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    EXPORT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'exports')
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
    
    # Allowed file extensions
    ALLOWED_EXTENSIONS = {
        'pdf', 'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp',
        'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 'zip'
    }
    
    # CORS settings
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
    ]
    
    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    SESSION_TYPE = 'filesystem'
    
    # API settings
    API_VERSION = 'v1'
    API_TITLE = 'Customs Document Analyzer API'
    API_DESCRIPTION = 'Ultra-Accurate Customs Document Analysis with 99.9% Accuracy'
    
    # Processing settings
    MAX_FILES_PER_REQUEST = 50
    PROCESSING_TIMEOUT = 300  # 5 minutes
    
    # Tesseract OCR path (adjust based on your system)
    TESSERACT_CMD = None  # Auto-detect or set manually
    
    @staticmethod
    def init_app(app):
        """Initialize application with config"""
        # Create necessary directories
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.EXPORT_FOLDER, exist_ok=True)


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Override with environment variables in production
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Add production CORS origins
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '').split(',')


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}