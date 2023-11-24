import cv2
from deepface import DeepFace
import requests
import base64
import json
import numpy as np
import sys

def process_video_stream(video_stream, image_url):
    # Decode video stream
    video_array = base64.b64decode(video_stream)
    video_np = np.frombuffer(video_array, dtype=np.uint8)
    video = cv2.imdecode(video_np, flags=cv2.IMREAD_COLOR)

    # Load the image from URL
    response = requests.get(image_url)
    img_array = bytearray(response.content)

    # Decode the image using OpenCV
    image = cv2.imdecode(np.asarray(img_array), cv2.IMREAD_COLOR)

    # Detect faces using deepface
    # (Note: This is a placeholder; you may replace this with your actual face recognition logic)
    # Example: `face_locations = your_face_recognition_function(image)`
    face_locations = DeepFace.detectFace(image, detector_backend='opencv')

    if not face_locations:
        print("No faces found")
        return False  # No faces found, indicating no match

    is_match = True  # Placeholder, replace with your logic

    return is_match

# Example usage
# Assuming you receive video_stream and image_url from the Node.js server
video_stream_from_server = sys.argv[1] 
image_url_from_server = sys.argv[2]
result = process_video_stream(video_stream_from_server, image_url_from_server)
print(result)
