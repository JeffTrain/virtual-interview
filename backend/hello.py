import os
from time import sleep

from flask import Flask, request, redirect, url_for, send_from_directory
from subprocess import call
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

from face import faces

app = Flask(__name__)

ALLOWED_EXTENSIONS = set(['webm', 'mp4', 'png'])
UPLOAD_FOLDER = 'uploads'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_screenshot_filename(file, index):
    return file + "-" + index + ".jpg"


def shot(file, video_full_path, index):
    screenshot_filename = get_screenshot_filename(file, index)
    call(["ffmpeg", "-ss", index, "-i", video_full_path, "-vframes", "1", "-q:v", "2", screenshot_filename])
    sleep(1)
    face_numbers = faces(screenshot_filename)

    if face_numbers == 1:
        return 1

    return 0


def take_screen_shots(video_full_path):
    file, ext = os.path.splitext(video_full_path)
    score_file = file + '-score.txt'

    score = 0
    score += shot(file, video_full_path, "0")
    score += shot(file, video_full_path, "1")
    score += shot(file, video_full_path, "2")
    score += shot(file, video_full_path, "3")
    score += shot(file, video_full_path, "4")

    with open(score_file, 'w') as file:
        file.writelines(str(score))


@app.route('/')
@cross_origin()
def hello():
    return "Hello World"


def allowed_files(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploads', methods=['POST', 'GET'])
@cross_origin()
def uploads():
    if request.method == 'POST':
        if 'video' not in request.files:
            return redirect(request.url + '?err=NoVideoPart')

        video_file = request.files['video']
        if video_file.filename == '':
            return redirect(request.url + '?err=NoSelectedFile')

        if video_file and allowed_files(video_file.filename):
            filename = secure_filename(video_file.filename)
            video_full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            video_file.save(video_full_path)

            take_screen_shots(video_full_path)

            location = url_for('uploaded_file', filename=filename)

            return redirect(location)


        else:
            return redirect(request.url + '?err=FileTypeNotSupported')
    else:
        return "Error"


@app.route('/uploaded_file/<filename>', methods=['GET'])
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
