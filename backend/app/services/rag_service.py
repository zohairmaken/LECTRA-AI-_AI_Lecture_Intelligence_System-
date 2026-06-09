class RAGService:
    def __init__(self):
        self.chroma_client = None
        self.collection = None
        self._initialized = False

    def _initialize(self):
        if self._initialized: return
        import chromadb
        print("[RAG] Initializing ChromaDB...")
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.chroma_client.get_or_create_collection(
            name="lectures"
        )
        self._initialized = True

    def add_lecture(self, lecture_id: int, transcript: str):
        self._initialize()
        """
        Chunk and vectorstore the transcript.
        """
        # Simple chunking
        chunk_size = 1000
        chunks = [transcript[i:i+chunk_size] for i in range(0, len(transcript), chunk_size)]
        
        ids = [f"{lecture_id}_{i}" for i in range(len(chunks))]
        metadatas = [{"lecture_id": lecture_id} for _ in range(len(chunks))]
        
        print(f"Vectorizing {len(chunks)} chunks for Lecture {lecture_id}...")
        self.collection.upsert(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )

    def query(self, lecture_id: int, query_text: str, n_results=3):
        self._initialize()
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where={"lecture_id": lecture_id}
        )
        return results['documents'][0]

rag_service = RAGService()
