import os

from flask import Flask, request, redirect, url_for
from flask import send_from_directory
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['webm', 'mp4', 'png'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/upload", methods=['get', 'post'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url + '?error=NoFilePart')
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url + '?error=NoSelectedFile')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            location = url_for('uploaded_file', filename=filename)
            print('location = ', location)
            return redirect(location)
        else:
            url = request.url + '?error=FileTypeError'
            print('url = ', url)
            return redirect(url)

    return 'Error'


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
