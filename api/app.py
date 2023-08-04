from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from models import db, URLMapping, User, generate_short_code
from dotenv import dotenv_values


app = Flask(__name__)
shrtcut_env = dotenv_values("../.env")

DOMAIN_NAME = shrtcut_env.get('DOMAIN_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = shrtcut_env.get('DATABASE_URI')
app.config['SECRET_KEY'] = shrtcut_env.get('SECRET_KEY')
login_manager = LoginManager(app)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 409

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate the access token using Flask-JWT-Extended
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token})

@app.route('/logout')
@jwt_required()
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})


@app.route('/shorten', methods=['POST'])
@jwt_required()
def shorten_url():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    long_url = request.json.get('long_url')
    if not long_url:
        return jsonify({'error': 'No URL provided'}), 400

    short_code = generate_short_code()

    # Insert the mapping into the database associated with the current user
    new_mapping = URLMapping(short_code=short_code, long_url=long_url, user_id=user.id)
    db.session.add(new_mapping)
    db.session.commit()

    return jsonify({'short_url': f'http://{DOMAIN_NAME}/{short_code}'})

@app.route('/urls', methods=['GET'])
@jwt_required()
def get_user_urls():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_urls = URLMapping.query.filter_by(user_id=user.id).all()
    urls = [{'short_code': url.short_code, 'long_url': url.long_url} for url in user_urls]
    return jsonify({'urls': urls})


@app.route('/<string:short_code>')
def redirect_to_long_url(short_code):
    # Retrieve the long URL from the database using the short code
    mapping = URLMapping.query.get(short_code)
    if mapping:
        return redirect(mapping.long_url)
    else:
        return jsonify({'error': 'Invalid short URL'}), 404

if __name__ == '__main__':
    app.run(debug=True)