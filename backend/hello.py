from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/upload", methods=['post'])
def upload_file():
    pass
