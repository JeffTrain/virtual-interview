To trim video:

ffmpeg -i movie.mp4 -ss 00:00:03 -t 00:00:08 -async 1 -c copy cut.mp4 


