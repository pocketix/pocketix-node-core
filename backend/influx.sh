#!/bin/bash
influx ping

influx bucket delete -n dip -o home
influx restore influx
