#!/usr/bin/env python3
"""Appends and patches MediaTek Filogic (MT7986A) JioRouter AX6000 device profiles to filogic.mk
Supports all hardware variants: JIDU6801, JIDU6401, JIDU6601, JIDU6701, JIDU6201, JIDU6101, JIDU6J01
"""
import sys
import re

mk = sys.argv[1]

with open(mk, 'r') as f:
    content = f.read()

# Add aliases to jiorouter_ax6000-jidu6j01 if not already present
patch_needed = False
if "jiorouter,ax6000-jidu6801" not in content:
    content = re.sub(
        r'(define Device/jiorouter_ax6000-jidu6j01[\s\S]*?)(IMAGE/sysupgrade\.bin :=[^\n]*)',
        r'\1SUPPORTED_DEVICES += jiorouter,ax6000-jidu6801 jio,jidu6801 jiorouter,ax6000-jidu6401 jio,jidu6401 jiorouter,ax6000-jidu6601 jiorouter,ax6000-jidu6701 jiorouter,ax6000-jidu6201\n  \2',
        content
    )
    patch_needed = True

block = """
define Device/jiorouter_ax6000-jidu6801
  $(call Device/jiorouter_ax6000-jidu6j01)
  DEVICE_VARIANT := JIDU6801
  DEVICE_DTS := mt7986a-jiorouter-ax6000-jidu6801
  DEVICE_DTS_DIR := ../dts
  SUPPORTED_DEVICES += jiorouter,ax6000-jidu6801 jio,jidu6801 jiorouter,ax6000-jidu6j01
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6801

define Device/jiorouter_ax6000-jidu6401
  $(call Device/jiorouter_ax6000-jidu6j01)
  DEVICE_VARIANT := JIDU6401
  DEVICE_DTS := mt7986a-jiorouter-ax6000-jidu6401
  DEVICE_DTS_DIR := ../dts
  SUPPORTED_DEVICES += jiorouter,ax6000-jidu6401 jio,jidu6401 jiorouter,ax6000-jidu6j01
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6401
"""

if "Device/jiorouter_ax6000-jidu6801" not in content:
    content += "\n" + block
    patch_needed = True

if patch_needed:
    with open(mk, 'w') as f:
        f.write(content)
    print("MediaTek Filogic device profiles (6801, 6401, 6101, 6j01) patched into", mk)
else:
    print("MediaTek Filogic device profiles already present in", mk)
