#!/bin/bash

ls | grep -e "[^package].json" | xargs -d"\n" rm
ls | grep -e "[^package].txt" | xargs -d"\n" rm