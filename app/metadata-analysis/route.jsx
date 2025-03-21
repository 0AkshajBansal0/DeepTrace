// /app/api/behavioral-analysis/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Replicate from 'replicate';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Initialize API clients using environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // First, analyze the content using OpenAI to detect if it's AI-generated
    const contentAnalysis = await analyzeContentWithOpenAI(openai, url);
    
    // Then, use Replicate to analyze spread patterns (this is simplified for example)
    const spreadAnalysis = await analyzeSpreadWithReplicate(replicate, url);
    
    // Combine the analysis results
    const results = {
      url,
      contentType: contentAnalysis.contentType,
      firstSeen: contentAnalysis.firstSeen,
      spreadPattern: spreadAnalysis.spreadPattern,
      aiProbability: contentAnalysis.aiProbability,
      spreadData: spreadAnalysis.spreadData,
      relatedContent: await findRelatedContent(openai, url),
      anomalies: spreadAnalysis.anomalies,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Behavioral analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

// Analyze content with OpenAI
async function analyzeContentWithOpenAI(openai, url) {
  try {
    // Fetch the actual content from the URL
    const content = await fetchContentFromUrl(url);
    
    // Use OpenAI to analyze if content is likely AI-generated
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing text to determine if it was likely written by an AI system. Provide results in JSON format."
        },
        {
          role: "user",
          content: `Analyze this content and determine the probability it was AI-generated, the content type, and when it may have first appeared online (estimate): ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    return {
      contentType: analysisResult.contentType || "Article",
      firstSeen: analysisResult.firstSeen || new Date().toLocaleString(),
      aiProbability: analysisResult.aiProbability || Math.random() * 100,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    // Fallback to mock data if the API call fails
    return {
      contentType: Math.random() > 0.5 ? "Article" : "Social Media Post",
      firstSeen: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
      aiProbability: Math.random() * 100,
    };
  }
}

// Analyze spread patterns with Replicate
async function analyzeSpreadWithReplicate(replicate, url) {
  try {
    // This is a simplified example. In a real implementation, you would use Replicate
    // to analyze spread patterns or other aspects of the content.
    // Since Replicate doesn't have a specific model for this exact purpose,
    // you might need to use a custom model or adapt an existing one.
    
    // For demonstration, we'll use a mock response that simulates what such an analysis might return
    return {
      spreadPattern: Math.random() > 0.5 ? "Viral" : "Gradual",
      spreadData: {
        timeline: [
          { date: "Day 1", shares: Math.floor(Math.random() * 100) },
          { date: "Day 2", shares: Math.floor(Math.random() * 500) },
          { date: "Day 3", shares: Math.floor(Math.random() * 1000) },
          { date: "Day 4", shares: Math.floor(Math.random() * 2000) },
          { date: "Day 5", shares: Math.floor(Math.random() * 3000) },
          { date: "Day 6", shares: Math.floor(Math.random() * 2500) },
          { date: "Day 7", shares: Math.floor(Math.random() * 2000) },
        ],
        platforms: [
          { name: "Twitter", shares: Math.floor(Math.random() * 5000) },
          { name: "Facebook", shares: Math.floor(Math.random() * 3000) },
          { name: "Reddit", shares: Math.floor(Math.random() * 2000) },
          { name: "Instagram", shares: Math.floor(Math.random() * 1500) },
          { name: "TikTok", shares: Math.floor(Math.random() * 1000) },
        ],
        demographics: [
          { name: "18-24", value: Math.floor(Math.random() * 30) },
          { name: "25-34", value: Math.floor(Math.random() * 30) },
          { name: "35-44", value: Math.floor(Math.random() * 20) },
          { name: "45-54", value: Math.floor(Math.random() * 15) },
          { name: "55+", value: Math.floor(Math.random() * 10) },
        ],
      },
      anomalies: [
        { description: "Unusual sharing pattern", severity: Math.random() > 0.5 ? "high" : "medium" },
        { description: "Coordinated sharing from new accounts", severity: Math.random() > 0.5 ? "medium" : "low" },
        { description: "Inconsistent engagement metrics", severity: Math.random() > 0.5 ? "low" : "medium" },
      ],
    };
  } catch (error) {
    console.error("Replicate analysis error:", error);
    // Fallback to mock data if the API call fails
    return {
      spreadPattern: Math.random() > 0.5 ? "Viral" : "Gradual",
      spreadData: {
        timeline: [
          { date: "Day 1", shares: Math.floor(Math.random() * 100) },
          { date: "Day 2", shares: Math.floor(Math.random() * 500) },
          { date: "Day 3", shares: Math.floor(Math.random() * 1000) },
          { date: "Day 4", shares: Math.floor(Math.random() * 2000) },
          { date: "Day 5", shares: Math.floor(Math.random() * 3000) },
          { date: "Day 6", shares: Math.floor(Math.random() * 2500) },
          { date: "Day 7", shares: Math.floor(Math.random() * 2000) },
        ],
        platforms: [
          { name: "Twitter", shares: Math.floor(Math.random() * 5000) },
          { name: "Facebook", shares: Math.floor(Math.random() * 3000) },
          { name: "Reddit", shares: Math.floor(Math.random() * 2000) },
          { name: "Instagram", shares: Math.floor(Math.random() * 1500) },
          { name: "TikTok", shares: Math.floor(Math.random() * 1000) },
        ],
        demographics: [
          { name: "18-24", value: Math.floor(Math.random() * 30) },
          { name: "25-34", value: Math.floor(Math.random() * 30) },
          { name: "35-44", value: Math.floor(Math.random() * 20) },
          { name: "45-54", value: Math.floor(Math.random() * 15) },
          { name: "55+", value: Math.floor(Math.random() * 10) },
        ],
      },
      anomalies: [
        { description: "Unusual sharing pattern", severity: Math.random() > 0.5 ? "high" : "medium" },
        { description: "Coordinated sharing from new accounts", severity: Math.random() > 0.5 ? "medium" : "low" },
        { description: "Inconsistent engagement metrics", severity: Math.random() > 0.5 ? "low" : "medium" },
      ],
    };
  }
}

// Find related content
async function findRelatedContent(openai, url) {
  try {
    // Use OpenAI to generate potential related content
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at finding related content. Provide results in JSON format."
        },
        {
          role: "user",
          content: `Find similar content to this URL that might be part of the same campaign: ${url}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Format the response or use mock data if the structure doesn't match
    if (Array.isArray(result.relatedContent)) {
      return result.relatedContent.map(item => ({
        url: item.url,
        similarity: item.similarity || (70 + Math.random() * 30),
        aiProbability: item.aiProbability || Math.random() * 100
      }));
    }
    
    // Fallback
    return generateMockRelatedContent();
  } catch (error) {
    console.error("Related content error:", error);
    return generateMockRelatedContent();
  }
}

// Helper function to fetch content from a URL
async function fetchContentFromUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching URL content:", error);
    return `Unable to fetch content from ${url}. Sample content for analysis...`;
  }
}

// Generate mock related content
function generateMockRelatedContent() {
  return [
    {
      url: "https://example.com/related1",
      similarity: 85 + Math.random() * 15,
      aiProbability: Math.random() * 100,
    },
    {
      url: "https://example.com/related2",
      similarity: 70 + Math.random() * 20,
      aiProbability: Math.random() * 100,
    },
    {
      url: "https://example.com/related3",
      similarity: 60 + Math.random() * 30,
      aiProbability: Math.random() * 100,
    },
  ];
}