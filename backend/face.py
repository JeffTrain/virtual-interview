import cv2
import dlib
import os

face_detector = dlib.get_frontal_face_detector()

dir_path = os.path.dirname(os.path.realpath(__file__))
landmark_file_path = os.path.realpath(os.path.join(dir_path, './shape_predictor_68_face_landmarks.dat'))
print(landmark_file_path)
predictor = dlib.shape_predictor(landmark_file_path)


def faces(filename):
    filename = os.path.realpath(os.path.join(dir_path, filename))
    print('file name = ', filename)
    frame = cv2.imread(filename)
    scale = 200 / min(frame.shape[1], frame.shape[0])
    thumb = cv2.resize(frame, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(thumb, cv2.COLOR_BGR2GRAY)
    faces = face_detector(gray, 1)

    return len(faces)
