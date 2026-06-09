import asyncio

class GpuManager:
    """
    Manages access to the GPU to prevent OOM on 4GB Quadro T1000.
    Allows tasks to be parallel on CPU but serial on GPU.
    """
    def __init__(self):
        self._lock = asyncio.Lock()

    async def acquire(self):
        await self._lock.acquire()

    def release(self):
        self._lock.release()

    async def __aenter__(self):
        await self.acquire()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.release()

gpu_manager = GpuManager()
