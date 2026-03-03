from flask import Blueprint

api_bp = Blueprint('api', __name__)

from . import posts, categories, tags, media, settings, menus
