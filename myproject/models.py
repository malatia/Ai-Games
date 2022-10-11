from myproject import db,login_manager
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import UserMixin
# By inheriting the UserMixin we get access to a lot of built-in attributes
# which we will be able to call in our views!
# is_authenticated()
# is_active()
# is_anonymous()
# get_id()


# The user_loader decorator allows flask-login to load the current user
# and grab their id.
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

class User(db.Model, UserMixin):

    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    games = db.relationship('Game',backref='user',lazy='dynamic')

    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.password_hash = generate_password_hash(password)
        

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)

    def get_id(self):
        return (self.user_id)


class Game(db.Model):
    __tablename__ = 'game'

    game_id = db.Column(db.Integer, primary_key = True)
    game_played = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    generations = db.relationship('Generation',backref='game',lazy='dynamic')

    def __init__(self, game_played, user_id):
        self.game_played = game_played
        self.user_id = user_id
    
    def get_id(self):
        return (self.game_id)

    

class Generation(db.Model):
    generation_id = db.Column(db.Integer, primary_key = True)
    generation_number = db.Column(db.Integer)
    lowest_score = db.Column(db.Float)
    average_score = db.Column(db.Float)
    highest_score = db.Column(db.Float)
    game_id = db.Column(db.Integer, db.ForeignKey('game.game_id'))

    def __init__(self, generation_number, lowest_score, average_score,highest_score, game_id):
        self.generation_number = generation_number
        self.lowest_score = lowest_score
        self.average_score = average_score
        self.highest_score = highest_score
        self.game_id = game_id

    def get_id(self):
        return (self.generation_id)

    def __repr__(self):
        return f"Generation number {self.generation_number}, {self.highest_score=}, {self.average_score=} {self.lowest_score=}"