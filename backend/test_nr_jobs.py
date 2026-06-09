import sys
import numpy as np
import noisereduce as nr
import traceback

def test_nr():
    try:
        print("Testing noisereduce with n_jobs=2 on Windows...")
        rate = 16000
        data = np.random.normal(0, 0.1, rate * 5) # 5 seconds of noise
        reduced = nr.reduce_noise(y=data, sr=rate, stationary=False, prop_decrease=1.0, n_jobs=2)
        print("Success with n_jobs=2! length:", len(reduced))
    except Exception as e:
        print(f"FAILED with n_jobs=2: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_nr()
