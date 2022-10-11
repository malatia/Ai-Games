from myproject import db 
from myproject.models import Generation, Game, User
from flask_login import current_user
from ping3 import ping

def ping_site(ip_adress):
    resp = ping(ip_adress)
    if resp:
        return True
    return False

def get_extreme_scores():
    resultat = db.session.execute(db.select(Generation).order_by(Generation.highest_score)).all()
    lowest_score = resultat[0][0].lowest_score
    highest_score = resultat[-1][0].highest_score
    return lowest_score, highest_score


def get_games_generations():
    all_games = {}
    games = db.session.execute(db.select(Game).where(Game.user_id == current_user.user_id)).all()
    for game in games:
        generations = db.session.execute(db.select(Generation).where(Generation.game_id == game[0].game_id)).all()
        generations_list = []
        for generation in generations:
            generation_object = {"min" : generation[0].lowest_score,
                                "average" : generation[0].average_score, 
                                "max" : generation[0].highest_score, 
                                "gen_number" : generation[0].generation_number, }
            generations_list.append(generation_object)
        current_game = {}
        current_game["game_name"] = game[0].game_played
        current_game["generations"] = generations_list
        all_games[game[0].game_id] = current_game

    keys_to_delete = [k for k,v in all_games.items() if len(v["generations"]) < 1]
    for key in keys_to_delete:
        all_games.pop(key)       
        
    for k,v in all_games.items():
        print(f"{k} : {v}")
    
    return all_games

