.PHONY: all install preprocess train evaluate clean

# Install dependencies
install:
	pip install -r requirements.txt

# Data preprocessing
preprocess:
	python src/preprocess.py

# Model training
train:
	python src/train.py

# Model evaluation
evaluate:
	python src/evaluate.py

# Full pipeline: preprocess -> train -> evaluate
all: preprocess train evaluate

# Clean generated files
clean:
	rm -rf data/processed/*.csv models/*.pkl results/*.txt
