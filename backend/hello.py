import os
from subprocess import call

from flask import Flask, request, redirect, url_for
from flask import send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

from face import faces

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['webm', 'mp4', 'png'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def write_score(score_file, score):
    with open(score_file, 'w') as f:
        f.writelines(str(score))


def get_screenshots(video_full_path):
    file, ext = os.path.splitext(video_full_path)
    score_file = file + '-score.txt'

    score = 0
    score += shot(file, video_full_path, "0")
    score += shot(file, video_full_path, "1")
    score += shot(file, video_full_path, "2")
    score += shot(file, video_full_path, "3")
    score += shot(file, video_full_path, "4")

    write_score(score_file, score)


def shot(file, filename, index):
    screenshot_filename = get_screenshot_filename(file, index)
    call(["ffmpeg", "-ss", index, "-i", filename, "-vframes", "1", "-q:v", "2", screenshot_filename])
    face_numbers = faces(screenshot_filename)

    score = 0
    if face_numbers == 1:
        score = 1

    return score


def get_screenshot_filename(file, index):
    return file + "-" + index + ".jpg"


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
