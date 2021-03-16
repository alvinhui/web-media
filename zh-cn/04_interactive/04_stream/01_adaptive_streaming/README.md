# DASH Adaptive Streaming for HTML 5 Video

## Prepare DASH files

1. [Download FFmpeg](https://www.ffmpeg.org/download.html)
2. Create the audio using and each video variant:

  ```bash
  ffmpeg -i my_video.mp4 -c:v libvpx-vp9 -keyint_min 150 \
  -g 150 -tile-columns 4 -frame-parallel 1  -f webm -dash 1 \
  -an -vf scale=160:90 -b:v 250k -dash 1 video_160x90_250k.webm \
  -an -vf scale=320:180 -b:v 500k -dash 1 video_320x180_500k.webm \
  -an -vf scale=640:360 -b:v 750k -dash 1 video_640x360_750k.webm \
  -an -vf scale=640:360 -b:v 1000k -dash 1 video_640x360_1000k.webm \
  -an -vf scale=1280:720 -b:v 1500k -dash 1 video_1280x720_1500k.web
  ```
3. Create the manifest file:

  ```bash
  ffmpeg \
  -f webm_dash_manifest -i video_160x90_250k.webm \
  -f webm_dash_manifest -i video_320x180_500k.webm \
  -f webm_dash_manifest -i video_640x360_750k.webm \
  -f webm_dash_manifest -i video_1280x720_1500k.webm \
  -f webm_dash_manifest -i my_audio.webm \
  -c copy \
  -map 0 -map 1 -map 2 -map 3 -map 4 \
  -f webm_dash_manifest \
  -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=4" \
  my_video_manifest.mpd
  ```

## Using DASH files

```bash
$ npm install --global http-server
$ http-server
// http://127.0.0.1:8080
```