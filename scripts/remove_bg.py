import sys
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, gaussian_filter, label

def remove_white_background(in_path, out_path, white_thresh=235, feather=3):
    img = Image.open(in_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    rgb = arr[:, :, :3]

    # Near-white mask
    near_white = np.all(rgb >= white_thresh, axis=2)

    # Flood fill from border: only remove background connected to the edges,
    # so light pixels inside the subject (eyes, collar) are preserved.
    labeled, num = label(near_white)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)

    bg_mask = np.isin(labeled, list(border_labels))

    # Slight dilation to catch anti-aliased edge halo, then feather alpha.
    bg_mask_dilated = binary_dilation(bg_mask, iterations=2)

    alpha = np.where(bg_mask_dilated, 0.0, 255.0)
    alpha = gaussian_filter(alpha, sigma=feather)
    alpha = np.clip(alpha, 0, 255)

    # Keep fully-opaque subject pixels fully opaque, only feather near the boundary.
    alpha[~bg_mask_dilated & ~near_white] = 255

    arr[:, :, 3] = alpha
    out = Image.fromarray(arr.astype(np.uint8), mode="RGBA")

    # Crop to content bounding box for easier placement in layouts.
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)

    out.save(out_path)
    print(f"Saved {out_path} ({out.size[0]}x{out.size[1]})")

if __name__ == "__main__":
    remove_white_background(sys.argv[1], sys.argv[2])
