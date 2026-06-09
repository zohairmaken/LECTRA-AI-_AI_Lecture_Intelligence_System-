import torch
import sys

def verify_gpu():
    print("--- GPU Verification Script ---")
    print(f"PyTorch Version: {torch.__version__}")
    
    if torch.cuda.is_available():
        print(f"✅ CUDA is available!")
        device_count = torch.cuda.device_count()
        print(f"Device Count: {device_count}")
        
        for i in range(device_count):
            print(f"Device {i}: {torch.cuda.get_device_name(i)}")
            props = torch.cuda.get_device_properties(i)
            print(f"  - Total VRAM: {props.total_memory / 1024**3:.2f} GB")
            print(f"  - Compute Capability: {props.major}.{props.minor}")
            
        # Test tensor allocation
        try:
            print("\nTesting tensor allocation on GPU...")
            x = torch.rand(1000, 1000).cuda()
            print("✅ Tensor allocated successfully on GPU.")
            print(f"Tensor device: {x.device}")
        except Exception as e:
            print(f"❌ Tensor allocation failed: {e}")
            
    else:
        print("❌ CUDA is NOT available.")
        print("This means PyTorch cannot see your GPU.")
        print("Possible reasons:")
        print("1. Incorrect PyTorch version installed (CPU-only).")
        print("2. NVIDIA Drivers are outdated.")
        print("3. CUDA Toolkit issues (though PyTorch usually bundles its own).")

if __name__ == "__main__":
    try:
        verify_gpu()
    except ImportError:
        print("❌ PyTorch is not installed or corrupted.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
