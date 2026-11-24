#!/usr/bin/env python3
"""Appends and patches MediaTek Filogic (MT7986A) JioRouter AX6000 device profiles to filogic.mk
Supports all hardware variants:
- Separate builds: JIDU6801, JIDU6401, JIDU6101, JIDU6J01
- Board aliases mapping to JIDU6J01: JIDU6601, JIDU6701, JIDU6201
"""
import sys
import re

mk = sys.argv[1]

with open(mk, 'r') as f:
    content = f.read()

patch_needed = False

# Ensure jidu6j01 only aliases hardware variants sharing its exact board layout (6601, 6701, 6201)
# 6801, 6401, and 6101 build their own distinct firmware images
if "jiorouter,ax6000-jidu6601" not in content:
    content = re.sub(
        r'(define Device/jiorouter_ax6000-jidu6j01[\s\S]*?)(IMAGE/sysupgrade\.bin :=[^\n]*)',
        r'\1SUPPORTED_DEVICES += jiorouter,ax6000-jidu6601 jio,jidu6601 jiorouter,ax6000-jidu6701 jio,jidu6701 jiorouter,ax6000-jidu6201 jio,jidu6201\n  \2',
        content
    )
    patch_needed = True

block = """
define Device/jiorouter_ax6000-jidu6801
  $(call Device/jiorouter_ax6000-jidu6j01)
  DEVICE_VARIANT := JIDU6801
  DEVICE_DTS := mt7986a-jiorouter-ax6000-jidu6801
  DEVICE_DTS_DIR := ../dts
  SUPPORTED_DEVICES := jiorouter,ax6000-jidu6801 jio,jidu6801
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6801

define Device/jiorouter_ax6000-jidu6401
  $(call Device/jiorouter_ax6000-jidu6j01)
  DEVICE_VARIANT := JIDU6401
  DEVICE_DTS := mt7986a-jiorouter-ax6000-jidu6401
  DEVICE_DTS_DIR := ../dts
  SUPPORTED_DEVICES := jiorouter,ax6000-jidu6401 jio,jidu6401
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6401

define Device/jiorouter_ax6000-jidu6101
  $(call Device/jiorouter_ax6000-jidu6j01)
  DEVICE_VARIANT := JIDU6101
  DEVICE_DTS := mt7986a-jiorouter-ax6000-jidu6101
  DEVICE_DTS_DIR := ../dts
  SUPPORTED_DEVICES := jiorouter,ax6000-jidu6101 jio,jidu6101
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6101
"""

if "Device/jiorouter_ax6000-jidu6101" not in content:
    # If old partial block exists without 6101, clean it up first
    if "Device/jiorouter_ax6000-jidu6801" in content:
        content = re.sub(r'\ndefine Device/jiorouter_ax6000-jidu6801[\s\S]*$', '', content)
    content += "\n" + block.strip() + "\n"
    patch_needed = True

if patch_needed:
    with open(mk, 'w') as f:
        f.write(content)
    print("MediaTek Filogic device profiles (6801, 6401, 6101, 6j01) patched into", mk)
else:
    print("MediaTek Filogic device profiles already present in", mk)
