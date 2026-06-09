import torch
import torch.nn as nn
import torch.optim as optim
import time

def train_dummy_model():
    print("--- NVIDIA GPU TRAINING TEST ---")
    
    # 1. Device Verification
    if not torch.cuda.is_available():
        print("ERROR: CUDA is NOT available! PyTorch is running on CPU.")
        return
        
    device = torch.device('cuda')
    print(f"SUCCESS: CUDA Available: {torch.cuda.is_available()}")
    print(f"SUCCESS: Device Active: {torch.cuda.get_device_name(device)}")
    print(f"SUCCESS: VRAM Available: {torch.cuda.get_device_properties(device).total_memory / 1e9:.2f} GB")
    
    # 2. Dummy Dataset
    print("\n[1/3] Generating synthetic dataset...")
    # 10,000 samples, 512 dimensions
    X = torch.randn(10000, 512).to(device)
    y = torch.randint(0, 10, (10000,)).to(device)
    
    # 3. Dummy Neural Network
    model = nn.Sequential(
        nn.Linear(512, 1024),
        nn.ReLU(),
        nn.Linear(1024, 1024),
        nn.ReLU(),
        nn.Linear(1024, 10)
    ).to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # 4. Training Loop (Stress Test GPU Compute)
    print("[2/3] Warming up and training for 1500 epochs (Monitor NVIDIA-SMI now!)...")
    start_time = time.time()
    
    for epoch in range(1500):
        optimizer.zero_grad()
        outputs = model(X)
        loss = criterion(outputs, y)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 300 == 0:
            print(f"Epoch [{epoch+1}/1500], Loss: {loss.item():.4f}")
            
    end_time = time.time()
    
    print("\n[3/3] Training Complete!")
    print(f"Total GPU compute time: {end_time - start_time:.2f} seconds")
    print("SUCCESS: Model successfully mapped, pushed, and computed purely on the Quadro T1000.")

if __name__ == "__main__":
    train_dummy_model()
