import os
from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

app = Flask(__name__)

ALLOWED_EXTENSIONS = set(['webm', 'mp4', 'png'])
UPLOAD_FOLDER = 'uploads'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
            video_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

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
