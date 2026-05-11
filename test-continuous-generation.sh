#!/bin/bash

# Test script for continuous autonomous content generation
# This will run for 30 seconds and show the generation speed

echo "=================================="
echo "TESTING CONTINUOUS CONTENT GENERATION"
echo "=================================="
echo "Fast Mode: ENABLED"
echo "Duration: 30 seconds"
echo "Expected: ~3 pieces in 30 seconds (with 100ms delay)"
echo "=================================="
echo ""

# Set environment variables for fast mode
export FAST_MODE=true
export CONTINUOUS_MODE=true

# Run the generator in the background
node automation/ai-content-generator-automation.cjs start &
PID=$!

echo "Generator started (PID: $PID)"
echo "Generating content..."
echo ""

# Wait 30 seconds
sleep 30

# Stop the generator
kill $PID 2>/dev/null

echo ""
echo "=================================="
echo "GENERATION TEST COMPLETE"
echo "=================================="
echo ""
echo "Check the statistics:"
npm run content:stats
echo ""
echo "Check generated files:"
echo "Blog posts:"
ls -1 pages/blog/*.tsx 2>/dev/null | wc -l
echo "Service pages:"
ls -1 pages/services/*.tsx 2>/dev/null | wc -l
echo "Case studies:"
ls -1 pages/case-studies/*.tsx 2>/dev/null | wc -l
echo ""
echo "Check logs:"
tail -20 automation/logs/content-generator.log

