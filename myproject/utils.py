from myproject import db
from myproject.models import Game, Generation
from flask_login import current_user

def add_stats(data):
    current_game = Game(data["game_name"], current_user.user_id)
    db.session.add(current_game)
    db.session.commit()
    for generation in data["generations"]:
        generation_to_add = Generation(generation["generation_number"], generation["lowest_score"], generation["average_score"],  generation["highest_score"], current_game.game_id)
        db.session.add(generation_to_add)
    db.session.commit()