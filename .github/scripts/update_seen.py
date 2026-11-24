#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timezone

def update_seen(repo_path, event_name="activity", actor="ohhmax", version=""):
    seen_path = os.path.join(repo_path, "seen.json")
    now_utc = datetime.now(timezone.utc)
    
    seen_data = {
        "last_seen": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "last_seen_formatted": now_utc.strftime("%d %b %Y, %H:%M UTC"),
        "timestamp": int(now_utc.timestamp()),
        "event": event_name or "activity",
        "actor": actor or "ohhmax",
        "author": "Mahendra Mali (Max)",
        "repo": os.environ.get("GITHUB_REPOSITORY", "ohhmax/maxnet"),
        "branch": os.environ.get("GITHUB_REF_NAME", "main"),
        "commit_sha": os.environ.get("GITHUB_SHA", ""),
        "run_id": os.environ.get("GITHUB_RUN_ID", ""),
        "run_number": os.environ.get("GITHUB_RUN_NUMBER", ""),
        "latest_version": version or "v2.2.54",
        "status": "success",
        "details": {
            "engine": "MAXNET Universal Engine",
            "target_models": 11
        }
    }
    
    with open(seen_path, "w", encoding="utf-8") as f:
        json.dump(seen_data, f, indent=2)
        f.write("\n")
    print(f"Successfully updated seen.json: {seen_data['last_seen_formatted']}")

if __name__ == "__main__":
    repo_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    event = sys.argv[2] if len(sys.argv) > 2 else "activity"
    act = sys.argv[3] if len(sys.argv) > 3 else "ohhmax"
    ver = sys.argv[4] if len(sys.argv) > 4 else "v2.2.54"
    update_seen(repo_dir, event, act, ver)
