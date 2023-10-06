// Get video and microphone stream from camera and mic
export default function getMediaStream(type) {
  const promise = new Promise((resolve, reject) => {
    const constraint =
      type === 'video'
        ? { audio: true, video: true }
        : { audio: true, video: false };
    navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream) => {
        resolve(stream);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
}
