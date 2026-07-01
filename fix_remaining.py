#!/usr/bin/env python3
"""Fix remaining encoding corruption from CP1252-as-UTF-8 mojibake.

Root cause: UTF-8 files were read as CP1252, then saved back as UTF-8.
Every byte was re-interpreted through the CP1252 codepage, including
"undefined" positions 0x81 and 0x90 which CP1252 maps to C1 controls
U+0081 and U+0090 respectively.
"""
import os

BASE = r'c:\Users\abdi5\OneDrive - USN\Deen portal project\Deen portal'

# ── Latin / punctuation fixes ─────────────────────────────────────────────────
# (corrupted_in_file, correct_replacement)

LATIN_FIXES = [
    # ﷺ (U+FDFA): bytes EF B7 BA
    #   → ï(U+00EF) + ·(U+00B7) + º(U+00BA)
    # Fix this FIRST so the ·(U+00B7) here isn't hit by the Â· rule below.
    ('ï·º', 'ﷺ'),

    # ← (U+2190): bytes E2 86 90
    #   → â(U+00E2) + †(U+2020) + \x90(U+0090, C1-control, undefined in CP1252)
    # Try full 3-char sequence first, then 2-char fallback.
    ('â†\x90', '←'),   # full sequence  â†\x90 → ←
    ('â†', '←'),       # fallback if U+0090 already stripped

    # · (U+00B7 middle dot): bytes C2 B7 → Â(U+00C2) + ·(U+00B7)
    ('Â·', '·'),

    # É (U+00C9): bytes C3 89 → Ã(U+00C3) + ‰(U+2030)
    ('Ã‰', 'É'),       # Ã‰ → É

    # × (U+00D7): bytes C3 97 → Ã(U+00C3) + —(U+2014 em dash)
    ('Ã—', '×'),       # Ã— → ×
]

# ── Arabic character fixes ────────────────────────────────────────────────────
# Arabic chars use 2-byte UTF-8 (D8/D9 high + 80-BF low).
# D8 → Ø(U+00D8), D9 → Ù(U+00D9) in CP1252.
# The low byte maps via CP1252; positions 0x80-0x9F use special CP1252 glyphs.
# Undefined positions 0x81 and 0x90 map to C1 codepoints U+0081, U+0090.
#
# Apply these ONLY to files that actually contain Arabic text to avoid
# accidental replacement of legitimate Ø/Ù characters in other contexts.

ARABIC_FIXES = [
    # D8 + low-byte pairs
    ('Ø¢', 'آ'),   # Ø + ¢(U+00A2)  → آ
    ('Ø£', 'أ'),   # Ø + £(U+00A3)  → أ
    ('Ø§', 'ا'),   # Ø + §(U+00A7)  → ا
    ('Ø¨', 'ب'),   # Ø + ¨(U+00A8)  → ب
    ('Ø©', 'ة'),   # Ø + ©(U+00A9)  → ة
    ('Ø«', 'ث'),   # Ø + «(U+00AB)  → ث
    ('Ø­', 'ح'),   # Ø + ­(U+00AD soft-hyphen)  → ح
    ('Ø¯', 'د'),   # Ø + ¯(U+00AF)  → د
    ('Ø±', 'ر'),   # Ø + ±(U+00B1)  → ر
    ('Ø³', 'س'),   # Ø + ³(U+00B3)  → س
    ('Ø¶', 'ض'),   # Ø + ¶(U+00B6)  → ض
    ('Ø·', 'ط'),   # Ø + ·(U+00B7)  → ط  (note: Â· already fixed above)
    ('Ø¹', 'ع'),   # Ø + ¹(U+00B9)  → ع

    # D9 + low-byte pairs (CP1252 0x80-0x9F special chars)
    # 0x81 is undefined in CP1252 → C1 control U+0081
    ('Ù\x81', 'ف'),   # Ù + U+0081(C1-control)  → ف
    ('Ù‚', 'ق'), # Ù + ‚(U+201A, CP1252 0x82)  → ق
    ('Ù„', 'ل'), # Ù + „(U+201E, CP1252 0x84)  → ل
    ('Ù…', 'م'), # Ù + …(U+2026, CP1252 0x85)  → م
    ('Ù†', 'ن'), # Ù + †(U+2020, CP1252 0x86)  → ن
    ('Ù‡', 'ه'), # Ù + ‡(U+2021, CP1252 0x87)  → ه
    ('Ùˆ', 'و'), # Ù + ˆ(U+02C6, CP1252 0x88)  → و
    ('ÙŠ', 'ي'), # Ù + Š(U+0160, CP1252 0x8A)  → ي
]


LATIN_FILES = [
    r'app\page.tsx',
    r'app\login\page.tsx',
    r'app\slide\page.tsx',
    r'app\student\page.tsx',
    r'app\student\live\page.tsx',
    r'app\live\page.tsx',
]

ARABIC_FILES = [
    r'app\student\page.tsx',
    r'app\slide\page.tsx',
    r'app\page.tsx',
]


def fix_file(rel_path, fix_pairs):
    full = os.path.join(BASE, rel_path)
    with open(full, 'r', encoding='utf-8') as f:
        original = f.read()
    result = original
    applied = []
    for corrupted, correct in fix_pairs:
        if corrupted in result:
            result = result.replace(corrupted, correct)
            applied.append(f'  {ascii(corrupted)[:40]} -> {ascii(correct)}')
    if result != original:
        with open(full, 'w', encoding='utf-8', newline='\n') as f:
            f.write(result)
        print(f'FIXED  {rel_path}:')
        for a in applied:
            print(a)
    else:
        print(f'clean  {rel_path}')


print('=== Latin / punctuation fixes ===')
for p in LATIN_FILES:
    fix_file(p, LATIN_FIXES)

print('\n=== Arabic character fixes ===')
for p in ARABIC_FILES:
    fix_file(p, ARABIC_FIXES)

print('\nDone.')
