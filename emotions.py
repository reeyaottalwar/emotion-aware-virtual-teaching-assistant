from keras.models import load_model
from time import sleep
from keras.preprocessing.image import img_to_array
import cv2
import numpy as np
import warnings
warnings.filterwarnings("ignore")

# Load the pre-trained model and cascade classifier
classifier = load_model(r'/Users/kriti/Emotion-Detection-With-Ratio/model.h5')
face_classifier = cv2.CascadeClassifier(r'/Users/kriti/Emotion-Detection-With-Ratio/haarcascade_frontalface_default.xml')

# Define emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Initialize video capture
cap = cv2.VideoCapture(1)

# Counters for overall emotion occurrences
overall_emotion_counts = {label: 0 for label in emotion_labels}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

        if np.sum([roi_gray]) != 0:
            roi = roi_gray.astype('float') / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)

            prediction = classifier.predict(roi)[0]
            label = emotion_labels[prediction.argmax()]
            overall_emotion_counts[label] += 1

            # Draw rectangle and label on the frame
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    cv2.imshow('Emotion Detector', frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Find the most frequent emotion overall
if sum(overall_emotion_counts.values()) > 0:
    max_emotion = max(overall_emotion_counts, key=overall_emotion_counts.get)
    print("\nMost frequent emotion detected:", max_emotion)
    print("Emotion counts:", overall_emotion_counts)
    with open(r'/Users/kriti/Emotion-Detection-With-Ratio/output.txt', 'w') as f:
        f.write(f"{max_emotion}")
else:
    print("\nNo faces detected.")
