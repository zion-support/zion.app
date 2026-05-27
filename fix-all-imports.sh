#!/bin/bash

# Script to fix all missing icon imports
echo "Fixing all missing icon imports..."

# List of files that need fixing
files=(
  "app/it-services/cybersecurity-audit/page.tsx"
  "app/page-original.tsx"
  "app/supply-chain-optimizer/page.tsx"
  "app/global-error.tsx"
  "app/property-management-ai/page.tsx"
  "app/page-optimized.tsx"
  "app/page-new.tsx"
  "app/loading.tsx"
  "app/online-learning-platform/page.tsx"
  "app/error.tsx"
  "app/ecommerce-analytics-pro/page.tsx"
  "app/ai-powered-email-analyzer/page.tsx"
  "app/ai-powered-devops/page.tsx"
  "app/legal-document-manager/page.tsx"
  "app/test/page.tsx"
  "app/medical-records-manager/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Check if file uses Brain icon
    if grep -q "icon: Brain" "$file"; then
      # Replace the import line to include all needed icons
      sed -i "s/import { CheckCircle, ArrowRight } from 'lucide-react';/import { CheckCircle, ArrowRight, Brain, BarChart, Target, TrendingUp } from 'lucide-react';/g" "$file"
      echo "Fixed $file"
    fi
  fi
done

echo "All imports fixed!"
