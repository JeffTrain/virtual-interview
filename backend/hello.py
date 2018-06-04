import os
from subprocess import call

from flask import Flask, request, redirect, url_for
from flask import send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['webm', 'mp4', 'png'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_screenshots(filename):
    file, ext = os.path.splitext(filename)
    screenshot_filename = file + ".jpg"

    call(["ffmpeg", "-ss", "0", "-i", filename, "-vframes", "1", "-q:v", "2", screenshot_filename])


@app.route("/")
@cross_origin()
def hello():
    return "Hello World!"


@app.route("/upload", methods=['get', 'post'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url + '?error=NoFilePart')
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url + '?error=NoSelectedFile')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            webm_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(webm_path)

            get_screenshots(webm_path)

            location = url_for('uploaded_file', filename=filename)
            return redirect(location)
        else:
            url = request.url + '?error=FileTypeError'
            print('url = ', url)
            return redirect(url)

    return 'Error'


@app.route('/uploads/<filename>')
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
