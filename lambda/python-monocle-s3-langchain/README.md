# Monocle S3 Langchain Lambda

## Prerequisites

1. Update the credentials in `template.yaml` before deploying:
   - BUCKET_NAME: Your S3 bucket name
   - OPENAI_API_KEY: Your OpenAI API key
   - MONOCLE_AWS_ACCESS_KEY_ID: AWS access key for S3
   - MONOCLE_AWS_SECRET_ACCESS_KEY: AWS secret key for S3

## Vector Store Setup

1. Add your coffee-related text content in `coffee_text.py`.
2. Generate embeddings using OpenAI's Embedding API:

```python
from openai import OpenAI
import json

# Initialize OpenAI client
client = OpenAI(api_key='your-api-key')

# Get your text from coffee_text.py
from coffee_text import coffee_text

# Generate embeddings
response = client.embeddings.create(
    input=coffee_text,
    model="text-embedding-3-small"
)

# Extract the embeddings
embeddings = response.data[0].embedding

# Save to coffee_embedding.py
with open('coffee_embedding.py', 'w') as f:
    f.write(f'embedding_json = {json.dumps(embeddings, indent=4)}')
```

## Deployment

Deploy the application using AWS SAM:

1. Build the application:
   ```bash
   sam build
   ```

2. Deploy to AWS:
   ```bash
   sam deploy --guided
   ```

3. Follow the prompts to configure your deployment:
   - Stack Name: Choose a name for your CloudFormation stack
   - AWS Region: Choose your target region
   - Confirm changes before deploy: Yes
   - Allow SAM CLI IAM role creation: Yes
   - Save arguments to configuration file: Yes

4. Wait for the deployment to complete. SAM will provide the Lambda function's ARN in the outputs.