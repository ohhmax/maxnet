#!/usr/bin/env python3
"""Appends complete Qualcomm IPQ95xx JioRouter AX6000 device profiles to ipq95xx.mk
Supports all hardware variants: JIDU6811, JIDU6911, JIDU6611, JIDU6411, JIDU6111
Pure USB 3.0 LAN build: Wi-Fi completely removed at firmware level, uhttpd enabled
"""
import sys

mk = sys.argv[1]

block = """
define Device/jiorouter_ax6000-jidu6j11
\t$(call Device/FitImage)
\t$(call Device/UbiFit)
\tDEVICE_VENDOR := JioRouter
\tDEVICE_MODEL := AX6000
\tSOC := ipq9554
\tBLOCKSIZE := 128k
\tPAGESIZE := 2048
\tSUPPORTED_DEVICES := jio,jidu6811 jio,jidu6911 jiorouter,ax6000-jidu6j11-6811 jiorouter,ax6000-jidu6j11-6911 jiorouter,ax6000-jidu6j11-6611 jiorouter,ax6000-jidu6j11-6411 jiorouter,ax6000-jidu6j11-6111 jiorouter,ax6000-jidu6j11
\tDEVICE_PACKAGES := uboot-envtools kmod-leds-gpio kmod-gpio-button-hotplug \\
\t\tkmod-qcom-ppe kmod-usb3 kmod-usb-dwc3 kmod-usb-dwc3-qcom \\
\t\tkmod-ledtrig-netdev uhttpd
endef

define Device/jiorouter_ax6000-jidu6j11-6811
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VARIANT := JIDU6J11-6811
\tDEVICE_DTS := ipq9554-jiorouter-ax6000-jidu6j11-6811
\tSUPPORTED_DEVICES := jiorouter,ax6000-jidu6j11-6811 jiorouter,ax6000-jidu6j11 jio,jidu6811
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6j11-6811

define Device/jiorouter_ax6000-jidu6j11-6911
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VARIANT := JIDU6J11-6911
\tDEVICE_DTS := ipq9554-jiorouter-ax6000-jidu6j11-6911
\tSUPPORTED_DEVICES := jiorouter,ax6000-jidu6j11-6911 jiorouter,ax6000-jidu6j11 jio,jidu6911 jio,jidu6811
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6j11-6911

define Device/jiorouter_ax6000-jidu6j11-6611
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VARIANT := JIDU6J11-6611
\tDEVICE_DTS := ipq9554-jiorouter-ax6000-jidu6j11-6611
\tSUPPORTED_DEVICES := jiorouter,ax6000-jidu6j11-6611 jiorouter,ax6000-jidu6j11 jio,jidu6811
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6j11-6611

define Device/jiorouter_ax6000-jidu6j11-6411
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VARIANT := JIDU6J11-6411
\tDEVICE_DTS := ipq9554-jiorouter-ax6000-jidu6j11-6411
\tSUPPORTED_DEVICES := jiorouter,ax6000-jidu6j11-6411 jiorouter,ax6000-jidu6j11 jio,jidu6811
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6j11-6411

define Device/jiorouter_ax6000-jidu6j11-6111
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VARIANT := JIDU6J11-6111
\tDEVICE_DTS := ipq9554-jiorouter-ax6000-jidu6j11-6111
\tSUPPORTED_DEVICES := jiorouter,ax6000-jidu6j11-6111 jiorouter,ax6000-jidu6j11 jio,jidu6811
endef
TARGET_DEVICES += jiorouter_ax6000-jidu6j11-6111

define Device/jio_jidu6811
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VENDOR := Jio
\tDEVICE_MODEL := JIDU6811
\tDEVICE_DTS := ipq9574-jidu6811
\tSUPPORTED_DEVICES := jio,jidu6811 jiorouter,ax6000-jidu6j11-6811 jiorouter,ax6000-jidu6j11
endef
TARGET_DEVICES += jio_jidu6811

define Device/jio_jidu6911
\t$(call Device/jiorouter_ax6000-jidu6j11)
\tDEVICE_VENDOR := Jio
\tDEVICE_MODEL := JIDU6911
\tDEVICE_DTS := ipq9574-jidu6911
\tSUPPORTED_DEVICES := jio,jidu6911 jio,jidu6811 jiorouter,ax6000-jidu6j11-6911 jiorouter,ax6000-jidu6j11
endef
TARGET_DEVICES += jio_jidu6911
"""

with open(mk, 'a') as f:
    f.write(block)

print("Qualcomm IPQ95xx device profiles (6811, 6911, 6611, 6411, 6111) appended to", mk)
