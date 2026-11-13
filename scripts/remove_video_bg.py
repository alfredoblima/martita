import os
import sys
import subprocess
from pathlib import Path
from PIL import Image
from rembg import remove, new_session
import time

VIDEO_IN = r"C:\Users\alfre\Downloads\Coffee_beans_transform_into_espr…_c523e12a.mp4"
FRAMES_DIR = r"C:\Users\alfre\Downloads\coffee_frames_raw"
OUT_FRAMES_DIR = r"C:\Users\alfre\Downloads\coffee_frames_alpha"
OUT_WEBM = r"C:\Users\alfre\Downloads\Coffee_beans_transparent.webm"
OUT_MOV = r"C:\Users\alfre\Downloads\Coffee_beans_transparent.mov"

os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(OUT_FRAMES_DIR, exist_ok=True)

# 1. Extract frames with ffmpeg
print("Passo 1/3: Extraindo frames...")
cmd_extract = f'ffmpeg -y -i "{VIDEO_IN}" -fps_mode passthrough "{FRAMES_DIR}\\frame_%04d.png"'
subprocess.run(cmd_extract, shell=True, check=True)

frame_files = sorted([f for f in os.listdir(FRAMES_DIR) if f.endswith(".png")])
total = len(frame_files)
print(f"Total de quadros a processar: {total}")

# 2. Process with rembg (session loaded once in memory)
print("Passo 2/3: Removendo fundo com IA frame a frame...")
session = new_session("bria-rmbg")

start_time = time.time()
for idx, fname in enumerate(frame_files):
    in_path = os.path.join(FRAMES_DIR, fname)
    out_path = os.path.join(OUT_FRAMES_DIR, fname)
    
    with Image.open(in_path) as img:
        res = remove(img, session=session)
        res.save(out_path, format="PNG")
        
    if (idx + 1) % 15 == 0 or idx == total - 1:
        elapsed = time.time() - start_time
        fps = (idx + 1) / elapsed
        remaining = (total - (idx + 1)) / (fps if fps > 0 else 1)
        print(f"Progresso: {idx + 1}/{total} ({(idx + 1)/total*100:.1f}%) - {fps:.1f} fps - Restante aprox: {remaining:.0f}s")

# 3. Assemble transparent videos
print("Passo 3/3: Renderizando vídeo WebM transparente (VP9 com Alpha)...")
cmd_webm = (
    f'ffmpeg -y -framerate 24 -i "{OUT_FRAMES_DIR}\\frame_%04d.png" '
    f'-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M "{OUT_WEBM}"'
)
subprocess.run(cmd_webm, shell=True, check=True)

print("Renderizando vídeo ProRes 4444 com Alpha (.mov)...")
cmd_mov = (
    f'ffmpeg -y -framerate 24 -i "{OUT_FRAMES_DIR}\\frame_%04d.png" '
    f'-c:v prores_ks -profile:v 4 -pix_fmt yuva444p10le "{OUT_MOV}"'
)
subprocess.run(cmd_mov, shell=True, check=True)

print("SUCESSO TOTAL!")
print(f"WebM: {OUT_WEBM}")
print(f"MOV: {OUT_MOV}")
