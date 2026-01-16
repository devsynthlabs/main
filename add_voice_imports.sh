#!/bin/bash

# Script to add VoiceButton import to all page files that don't have it yet

PAGES_DIR="src/pages"
VOICE_BUTTON_IMPORT='import { VoiceButton } from "@/components/ui/VoiceButton";'

# List of pages to update (excluding Auth.tsx and TaxGST.tsx which are already done)
PAGES=(
  "BalanceSheet.tsx"
  "FinancialRatios.tsx"
  "Dashboard.tsx"
  "Payroll.tsx"
  "ProfitLoss.tsx"
  "CashFlow.tsx"
  "CashFlowStatement.tsx"
  "BankReconciliation.tsx"
  "Bookkeeping.tsx"
  "Inventory.tsx"
  "FraudDetection.tsx"
  "CivilEngineering.tsx"
  "AutomationInvoice.tsx"
)

for page in "${PAGES[@]}"; do
  FILE="$PAGES_DIR/$page"
  if [ -f "$FILE" ]; then
    # Check if VoiceButton import already exists
    if ! grep -q "VoiceButton" "$FILE"; then
      echo "Adding VoiceButton import to $page"
      # Add import after the last import statement
      sed -i '' '/^import.*from/a\
'"$VOICE_BUTTON_IMPORT"'
' "$FILE" 2>/dev/null || echo "Could not update $page automatically"
    else
      echo "$page already has VoiceButton import"
    fi
  else
    echo "File not found: $FILE"
  fi
done

echo "Done! Please manually add VoiceButton components next to Input fields."
