#!/bin/sh
# Netlify build step: fills %%TOKENS%% from [build.environment] in netlify.toml.
set -eu
: "${SITE_URL:?}" "${GAS_SAFE_NO:?}" "${BUSINESS_EMAIL:?}"
for f in $(grep -rlE '%%[A-Z_]+%%' public --include='*.html' --include='*.xml' --include='*.txt'); do
  sed -i "s|%%SITE_URL%%|$SITE_URL|g; s|%%GAS_SAFE_NO%%|$GAS_SAFE_NO|g; s|%%BUSINESS_EMAIL%%|$BUSINESS_EMAIL|g" "$f"
done
# Fail the deploy rather than publish a raw token.
if grep -rqE '%%[A-Z_]+%%' public --include='*.html' --include='*.xml' --include='*.txt'; then
  echo "build.sh: unreplaced token left in public/" >&2; exit 1
fi
