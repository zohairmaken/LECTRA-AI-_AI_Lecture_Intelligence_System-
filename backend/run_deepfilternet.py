import sys
import os
import subprocess

# Let Torch initialize normally
import os
import sys

# Critical Fix for Windows PyTorch DLL loading errors in subprocess
import importlib.util
torch_spec = importlib.util.find_spec("torch")
if torch_spec and torch_spec.submodule_search_locations:
    lib_path = os.path.join(torch_spec.submodule_search_locations[0], 'lib')
    if os.path.exists(lib_path) and hasattr(os, 'add_dll_directory'):
        os.add_dll_directory(lib_path)

# ============================================================
# CRITICAL FIX 2: Monkey-patch subprocess.check_output to
# intercept 'git' calls that crash DeepFilterNet on machines
# without git on PATH.
# ============================================================
_original_check_output = subprocess.check_output

def _safe_check_output(*args, **kwargs):
    cmd = args[0] if args else kwargs.get('args', [])
    if isinstance(cmd, (list, tuple)) and len(cmd) > 0 and 'git' in str(cmd[0]):
        return b"unknown"
    return _original_check_output(*args, **kwargs)

subprocess.check_output = _safe_check_output

try:
    import torch # Import torch first to resolve DLL paths for torchaudio on Windows
    from df.enhance import run

    if __name__ == "__main__":
        run()

except ImportError:
    print("CRITICAL: DeepFilterNet ('df') module not found. Ensure it is installed.")
    sys.exit(1)
except Exception as e:
    print(f"CRITICAL: DeepFilterNet wrapper failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)


