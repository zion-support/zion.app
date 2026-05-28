export interface Partner {
  id: string;
  name: string;
  category: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  description: string;
  website: string | null;
  logo: string | null;
}

export const partners = {
  "partners": [
    {
      "id": "aws",
      "name": "Amazon Web Services",
      "category": "Cloud Infrastructure",
      "tier": "Platinum",
      "description": "Strategic cloud infrastructure partner enabling enterprise-grade deployments on AWS.",
      "website": "https://aws.amazon.com/partners/",
      "logo": null
    },
    {
      "id": "microsoft",
      "name": "Microsoft",
      "category": "Technology Platform",
      "tier": "Platinum",
      "description": "Microsoft Gold partner specializing in Azure cloud, Microsoft 365 integrations, and enterprise AI solutions.",
      "website": "https://www.microsoft.com/partner/",
      "logo": null
    },
    {
      "id": "google",
      "name": "Google Cloud",
      "category": "Cloud Infrastructure",
      "tier": "Gold",
      "description": "Google Cloud partner delivering AI-first architectures, data analytics, and serverless solutions.",
      "website": "https://cloud.google.com/partners/",
      "logo": null
    },
    {
      "id": "nvidia",
      "name": "NVIDIA",
      "category": "AI / GPUs",
      "tier": "Platinum",
      "description": "NVIDIA AI partner \u2014 GPU-accelerated ML pipelines, LLM inference, and HPC deployments.",
      "website": "https://www.nvidia.com/en-us/partners/",
      "logo": null
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "category": "AI Models",
      "tier": "Gold",
      "description": "OpenAI integration partner \u2014 GPT-4o, embeddings, and fine-tuned enterprise assistants.",
      "website": "https://openai.com/partners/",
      "logo": null
    },
    {
      "id": "hashicorp",
      "name": "HashiCorp",
      "category": "DevOps / IaC",
      "tier": "Silver",
      "description": "HashiCorp partner \u2014 Terraform, Vault, and Nomad implementations for secure infrastructure automation.",
      "website": "https://www.hashicorp.com/partner",
      "logo": null
    }
  ]
} as const satisfies { partners: Partner[] };
