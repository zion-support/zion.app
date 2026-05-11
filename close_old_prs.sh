#!/bin/bash

# Close old PRs from October 13th and earlier
old_prs=(31819 31820 31822 31823 31824 31825 31826 31827 31828 31829 31830 31831 31832 31833 31834 31835 31836 31838 31839 31840 31841 31842 31843 31845 31846 32379)

echo "Closing old PRs..."
for pr in "${old_prs[@]}"; do
    echo "Closing PR $pr"
    gh pr close $pr || echo "Failed to close PR $pr"
done

echo "Done closing old PRs"