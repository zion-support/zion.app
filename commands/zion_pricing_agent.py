#!/usr/bin/env python3
"""
Zion Tech Group – Dynamic Pricing Engine
Imports and processes competitor prices from a predefined list.
Accepts optional flag to skip market parsing if already stored.
"""

import os
import json
from datetime import datetime

# -------------------
# Configuration