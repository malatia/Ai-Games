from sqlalchemy import true
from myproject import app, db
from flask import render_template, redirect, request, url_for, flash, abort
from flask_login import current_user, login_user, login_required, logout_user
from myproject.models import User, Game, Generation
from myproject.forms import LoginForm, RegistrationForm
from myproject.test_db import get_games_generations
from myproject.utils import add_stats
import json


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/add_data", methods=["POST"])
def add_data():
    output = request.get_json()
    data = json.loads(output)
    print(type(data))
    print(data)
    if len(data["generations"]) < 1:
        print("Pas assez de générations")
    else:
        add_stats(data)
    return render_template("test.html")


@app.route("/test2")
def test2():
    resultat = db.session.execute(
        db.select(Generation).order_by(Generation.highest_score)
    ).all()
    # for row in resultat:
    #     print(row)
    lowest_score = resultat[0][0].lowest_score
    highest_score = resultat[-1][0].highest_score
    print(lowest_score)
    print(highest_score)
    return render_template("test.html")


@app.route("/test3")
def test3():
    all_games = {}
    games = db.session.execute(
        db.select(Game).where(Game.user_id == current_user.user_id)
    ).all()
    for game in games:
        generations = db.session.execute(
            db.select(Generation).where(Generation.game_id == game[0].game_id)
        ).all()
        generations_list = []
        for generation in generations:
            generations_list.append(generation)
        current_game = {}
        current_game["game_name"] = game[0].game_played
        current_game["generations"] = generations_list
        all_games[game[0].game_id] = current_game

    keys_to_delete = [k for k, v in all_games.items() if len(v["generations"]) < 1]
    for key in keys_to_delete:
        all_games.pop(key)

    for k, v in all_games.items():
        print(f"{k} : {v}")

    return render_template("test.html")


@app.route("/welcome")
# @login_required
def welcome_user():
    return render_template("welcome_user.html")


@app.route("/samourai_fighters")
# @login_required
def samourai_fighters():
    return render_template("samourai_fighters.html")


@app.route("/vivarium")
# @login_required
def vivarium():
    return render_template("vivarium.html")


@app.route("/asteroids")
# @login_required
def asteroids():
    return render_template("asteroids.html")


@app.route("/flappy_bird")
# @login_required
def flappy_bird():
    return render_template("flappy_bird.html")


@app.route("/logout")
# @login_required
def logout():
    logout_user()
    flash("You logged out!")
    return redirect(url_for("home"))


@app.route("/my_statistics")
# @login_required
def my_statistics():
    json_file = get_games_generations()
    return render_template("my_statistics.html", json_file=json_file)


@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Grab the user from our User Models table
        user = User.query.filter_by(email=form.email.data).first()

        # Check that the user was supplied and the password is right
        # The verify_password method comes from the User object
        # https://stackoverflow.com/questions/2209755/python-operation-vs-is-not
        if user is not None:
            print(user)
            if user.check_password(form.password.data) :
                # Log in the user

                login_user(user)
                flash("Logged in successfully.")

                # If a user was trying to visit a page that requires a login
                # flask saves that URL as 'next'.
                next = request.args.get("next")

                # So let's now check if that next exists, otherwise we'll go to
                # the welcome page.
                if next == None or not next[0] == "/":
                    next = url_for("home")

                return redirect(next)
    return render_template("login.html", form=form)


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        user = User(
            email=form.email.data,
            username=form.username.data,
            password=form.password.data,
        )

        db.session.add(user)
        db.session.commit()
        flash("Thanks for registering! Now you can login!")
        return redirect(url_for("login"))
    return render_template("register.html", form=form)


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="0.0.0.0")
