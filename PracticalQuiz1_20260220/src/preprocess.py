import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Paths
RAW_DATA = "data/sample_data.csv"
PROCESSED_DIR = "data/processed"
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Load dataset
print("[PREPROCESS] Loading dataset...")
df = pd.read_csv(RAW_DATA)
print(f"  Shape: {df.shape}")

# Handle missing values
print("[PREPROCESS] Handling missing values...")
df = df.dropna()
print(f"  Shape after dropna: {df.shape}")

# Split features and target
X = df.drop("approved", axis=1)
y = df["approved"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Save processed splits
X_train.to_csv(f"{PROCESSED_DIR}/X_train.csv", index=False)
X_test.to_csv(f"{PROCESSED_DIR}/X_test.csv", index=False)
y_train.to_csv(f"{PROCESSED_DIR}/y_train.csv", index=False)
y_test.to_csv(f"{PROCESSED_DIR}/y_test.csv", index=False)

print(f"[PREPROCESS] Done. Train size: {len(X_train)}, Test size: {len(X_test)}")
print(f"[PREPROCESS] Saved to {PROCESSED_DIR}/")
