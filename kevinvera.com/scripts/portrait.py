"""
Turns Kevin's profile photo into pen strokes for the home page.

  python scripts/portrait.py photo.jpg src/content/portrait.ts

Needs opencv-python-headless and numpy. It inks the photo the way a person
would: the outline of the figure, the edges of the darkest shapes (hair,
shirt, brows, eyes), the contours of the shadows on the face and hand, then
hatching for the dark areas and lighter hatching for the shadows. The white
earphone cable is left as paper, so the hatching draws around it.

The output is a TypeScript module: `ink` strokes in drawing order (outline
first, then features), then `shade` strokes (hatching), each list top to
bottom.
"""

import argparse

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--size", type=int, default=600, help="working size in pixels, also the viewBox")
ap.add_argument("--dark", type=int, default=62, help="below this is hair, shirt, brows and eyes")
ap.add_argument("--mid", type=int, default=110, help="below this is shadow")
ap.add_argument("--spacing", type=float, default=7.0, help="hatching gap in the dark areas")
ap.add_argument("--seed", type=int, default=7)
ap.add_argument("--debug", help="write the working image with a grid to this path")
ap.add_argument("--low", type=int, default=60, help="Canny low threshold for fine features")
ap.add_argument("--high", type=int, default=140, help="Canny high threshold for fine features")
args = ap.parse_args()
rand = np.random.default_rng(args.seed)

img = cv2.imread(args.src, cv2.IMREAD_GRAYSCALE)

# crop to the figure, with a little air around it
ys, xs = np.nonzero(img < 225)
pad = int(0.02 * img.shape[0])
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + 1, img.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, img.shape[1])
img = img[y0:y1, x0:x1]
h, w = img.shape
scale = args.size / max(h, w)
img = cv2.resize(img, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_AREA)
H, W = img.shape
soft = cv2.GaussianBlur(img, (0, 0), 1.6)

if args.debug:
    # the working image with a grid every 20 px, for placing strokes by hand
    dbg = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    for g in range(0, max(W, H), 20):
        c = (0, 0, 255) if g % 100 == 0 else (255, 160, 0)
        cv2.line(dbg, (g, 0), (g, H), c, 1)
        cv2.line(dbg, (0, g), (W, g), c, 1)
    cv2.imwrite(args.debug, cv2.resize(dbg, (W * 2, H * 2), interpolation=cv2.INTER_NEAREST))


def f(n):
    return f"{n:.1f}".rstrip("0").rstrip(".")


def to_path(pts):
    """A smooth curve through the points (Catmull Rom as cubic Béziers)."""
    d = f"M{f(pts[0][0])} {f(pts[0][1])}"
    if len(pts) == 2:
        return d + f"L{f(pts[1][0])} {f(pts[1][1])}"
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}"
    return d


# The face and hand, drawn by hand: the traced edges there come out as blobs.
# Points are in working pixels at --size 600, read off the --debug grid.
FACE_BOX = (282, 196, 404, 300)  # x0, y0, x1, y1: no traced detail inside
CHIN_BOX = (268, 300, 345, 345)  # the shadow between chin and fist
FEATURES = [
    [(294, 210), (315, 204), (340, 208), (364, 217)],  # brow, his right
    [(296, 213), (318, 207.5), (341, 211), (363, 220)],  # the brows are heavy: a second pass
    [(377, 219), (395, 213), (416, 209)],  # brow, his left
    [(378, 222), (396, 216.5), (414, 212.5)],
    [(311, 226), (322, 221.5), (335, 221.5), (347, 226)],  # upper lid
    [(315, 230), (330, 231.5), (344, 228)],  # lower lid
    [(381, 230), (390, 226), (401, 228)],  # upper lid
    [(383, 233), (395, 233.5)],  # lower lid
    [(370, 233), (374, 255), (378, 278)],  # side of the nose
    [(346, 286), (358, 294), (374, 292), (381, 282)],  # tip of the nose
    [(217, 178), (201, 188), (194, 205), (200, 222), (210, 232)],  # ear
    [(210, 191), (204, 205), (209, 217)],  # inside the ear
    [(302, 338), (325, 325), (365, 322)],  # thumb over the fist
    [(320, 355), (350, 350), (377, 350)],  # finger
    [(335, 377), (365, 372), (395, 375)],  # finger
    [(350, 397), (375, 394), (397, 392)],  # finger
]
PUPILS = [(329, 225.5), (392, 229.5)]


def circle(cx, cy, r, n=10):
    return [(cx + r * np.cos(t), cy + r * np.sin(t)) for t in np.linspace(0, 2 * np.pi * 1.1, n)]


def in_face(x, y):
    return any(b[0] <= x <= b[2] and b[1] <= y <= b[3] for b in (FACE_BOX, CHIN_BOX))


def clean(mask, k=3):
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    return cv2.morphologyEx(cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel), cv2.MORPH_CLOSE, kernel)


def outlines(mask, min_area, eps, closed=True, edge_gap=3, skip_face=False):
    """The borders of a mask as smooth strokes, leaving out the parts that run along the photo's edge."""
    cs, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cs:
        if cv2.contourArea(c) < min_area:
            continue
        if skip_face:
            x, y, w_, h_ = cv2.boundingRect(c)
            if in_face(x + w_ / 2, y + h_ / 2) and w_ * h_ < 6000:
                continue
        pts = [(float(x), float(y)) for x, y in c[:, 0, :]]
        # split where the border hugs the frame: nobody draws the edge of the photo
        runs, cur = [], []
        for p in pts:
            on_edge = p[0] < edge_gap or p[0] > W - 1 - edge_gap or p[1] > H - 1 - edge_gap
            if on_edge:
                if len(cur) > 4:
                    runs.append(cur)
                cur = []
            else:
                cur.append(p)
        if len(cur) > 4:
            runs.append(cur)
        if len(runs) == 1 and len(runs[0]) == len(pts) and closed:
            runs[0] = runs[0] + runs[0][:3]  # overlap the start, like a pen closing a loop
        for r in runs:
            a = cv2.approxPolyDP(np.array(r, dtype=np.float32).reshape(-1, 1, 2), eps, False)[:, 0, :]
            if len(a) >= 2:
                out.append([(float(x), float(y)) for x, y in a])
    return out


def hatch(mask, angle, spacing, min_len, wobble=0.6, inset=1.5):
    """Parallel strokes clipped to a mask, each with a little hand in it."""
    a = np.deg2rad(angle)
    dx, dy = np.cos(a), np.sin(a)
    nx, ny = -dy, dx
    corners = [(0, 0), (W, 0), (0, H), (W, H)]
    offs = [x * nx + y * ny for x, y in corners]
    span = np.hypot(W, H)
    ts = np.arange(-span, span, 1.0)
    segs = []
    for off in np.arange(min(offs), max(offs), spacing):
        off += rand.uniform(-0.25, 0.25) * spacing
        xs, ys = off * nx + ts * dx, off * ny + ts * dy
        keep = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
        xs, ys = xs[keep], ys[keep]
        if not len(xs):
            continue
        on = mask[ys.astype(int), xs.astype(int)] > 0
        edges = np.flatnonzero(np.diff(np.concatenate([[0], on.astype(np.int8), [0]])))
        for s, e in zip(edges[::2], edges[1::2]):
            if e - s < min_len:
                continue
            s2, e2 = s + inset, e - 1 - inset
            p0 = (xs[int(s2)] + rand.normal(0, wobble), ys[int(s2)] + rand.normal(0, wobble))
            p1 = (xs[int(e2)] + rand.normal(0, wobble), ys[int(e2)] + rand.normal(0, wobble))
            m = ((p0[0] + p1[0]) / 2 + nx * rand.normal(0, wobble), (p0[1] + p1[1]) / 2 + ny * rand.normal(0, wobble))
            segs.append([p0, m, p1])
    return segs


figure = clean((soft < 228).astype(np.uint8) * 255, 5)
dark = clean((soft < args.dark).astype(np.uint8) * 255, 3)
# shadows read better soft: a wider blur, and no outline, only light hatching
shadow_tone = cv2.GaussianBlur(img, (0, 0), 3.2)
mid = clean(((shadow_tone < args.mid) & (soft >= args.dark)).astype(np.uint8) * 255, 7)
near_dark = cv2.dilate(dark, np.ones((9, 9), np.uint8))


def away_from(strokes, mask):
    """Cut strokes where they run along a mask, so no edge is drawn twice."""
    out = []
    for st in strokes:
        cur = []
        for p in st:
            if mask[min(int(p[1]), H - 1), min(int(p[0]), W - 1)]:
                if len(cur) > 2:
                    out.append(cur)
                cur = []
            else:
                cur.append(p)
        if len(cur) > 2:
            out.append(cur)
    return out


# fine features: eyes, nose, ear, knuckles; edges inside the light areas the masks miss
fine = cv2.Canny(cv2.bilateralFilter(img, 7, 40, 7), args.low, args.high)
fine[cv2.dilate(dark, np.ones((5, 5), np.uint8)) > 0] = 0
fine[figure == 0] = 0
fine = cv2.dilate(fine, np.ones((2, 2), np.uint8))

face = np.zeros_like(dark)
cv2.rectangle(face, FACE_BOX[:2], FACE_BOX[2:], 255, -1)
hand_drawn_zone = cv2.dilate(face, np.ones((15, 15), np.uint8))
hand_drawn_zone[300:410, 295:405] = 255  # the fist

ink = []
ink += away_from(outlines(figure, 4000, 1.4), near_dark)
ink += outlines(dark, 30, 1.1, skip_face=True)
ink += away_from(outlines(fine, 20, 1.0, closed=False), hand_drawn_zone)
ink += FEATURES + [circle(x, y, 2.4) for x, y in PUPILS]


def curls(mask, count, gap):
    """Loose C shaped loops scattered through the hair, so it reads curly."""
    room = cv2.erode(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
    ys, xs = np.nonzero(room)
    order = rand.permutation(len(xs))
    placed, out = [], []
    for i in order:
        x, y = float(xs[i]), float(ys[i])
        if any((x - px) ** 2 + (y - py) ** 2 < gap * gap for px, py in placed):
            continue
        placed.append((x, y))
        r = rand.uniform(4.5, 8)
        start = rand.uniform(0, 2 * np.pi)
        sweep = rand.uniform(3.6, 5.2) * rand.choice([-1, 1])
        ts = np.linspace(start, start + sweep, 9)
        out.append([(x + r * np.cos(t) * (1 - 0.06 * k), y + r * np.sin(t) * (1 - 0.06 * k)) for k, t in enumerate(ts)])
        if len(out) >= count:
            break
    return out


# the hair is the big dark shape at the top
n, labels, stats, cents = cv2.connectedComponentsWithStats(dark)
tops = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 4000]
hair_id = min(tops, key=lambda i: cents[i][1])
hair = ((labels == hair_id) * 255).astype(np.uint8)
hair[FACE_BOX[1]:, :] = 0  # the same shape runs down into the shadow under the chin: no curls there
ink += curls(hair, 40, 20)

shade = []
shade += hatch(dark, -52, args.spacing, 4)
shade += hatch(cv2.erode(mid, np.ones((5, 5), np.uint8)), 40, args.spacing * 1.6, 8, wobble=0.5)

ink.sort(key=lambda s: min(p[1] for p in s))
shade.sort(key=lambda s: min(p[1] for p in s))


def mod(name, strokes):
    return f"  {name}: [\n" + "".join(f'    "{to_path(s)}",\n' for s in strokes) + "  ],\n"


with open(args.out, "w") as fh:
    fh.write("// Generated by scripts/portrait.py from Kevin's profile photo. Do not edit by hand.\n")
    fh.write(f"export const PORTRAIT = {{\n  width: {W},\n  height: {H},\n")
    fh.write(mod("ink", ink))
    fh.write(mod("shade", shade))
    fh.write("};\n")

size = sum(len(to_path(s)) for s in ink + shade) // 1024
print(f"{len(ink)} ink strokes, {len(shade)} hatching strokes, {W}x{H}, {size} KB")
