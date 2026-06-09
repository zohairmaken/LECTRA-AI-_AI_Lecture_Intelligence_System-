import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, classification_report

# Paths
PROCESSED_DIR = "data/processed"
MODELS_DIR = "models"
RESULTS_DIR = "results"
os.makedirs(RESULTS_DIR, exist_ok=True)

# Load test data
print("[EVALUATE] Loading test data...")
X_test = pd.read_csv(f"{PROCESSED_DIR}/X_test.csv")
y_test = pd.read_csv(f"{PROCESSED_DIR}/y_test.csv").squeeze()

# Load model
model = joblib.load(f"{MODELS_DIR}/logistic_model.pkl")
print("[EVALUATE] Model loaded.")

# Predict
y_pred = model.predict(X_test)

# Metrics
acc = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"\n[EVALUATE] Test Accuracy: {acc * 100:.2f}%")
print("\n[EVALUATE] Classification Report:")
print(report)

# Save results
results_path = f"{RESULTS_DIR}/evaluation_results.txt"
with open(results_path, "w") as f:
    f.write(f"Test Accuracy: {acc * 100:.2f}%\n\n")
    f.write("Classification Report:\n")
    f.write(report)

print(f"[EVALUATE] Results saved to {results_path}")
